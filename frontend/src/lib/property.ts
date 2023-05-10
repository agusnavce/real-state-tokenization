import { ethers, BigNumber } from 'ethers';
import {
  PROPERTY_TOKEN_FACTORY_ADDRESS,
  PROPERTY_TOKEN_MANAGER_ADDRESS,
  SHARES_TOKEN_ADDRESS,
} from '../config';
import PropertyTokenManagerArtifact from '../contracts/PropertyTokenManager.json';
import PropertyTokenFactoryArtifact from '../contracts/PropertyTokenFactory.json';
import RealEstateShareTokenArtifact from '../contracts/RealEstateShareToken.json';
import {
  EthereumWindow,
  PropertyDetails,
  UserProperty,
  UserRequestedProperty,
} from '../types';
import { getDollarToEtherConversionRate } from './helper';

export const getUserProperties = async (): Promise<UserProperty[]> => {
  try {
    const provider = new ethers.providers.Web3Provider(
      (window as EthereumWindow).ethereum
    );
    const signer = provider.getSigner();
    const accountAddress = await signer.getAddress();

    console.log(accountAddress);

    const propertyTokenFactoryContract = new ethers.Contract(
      PROPERTY_TOKEN_FACTORY_ADDRESS,
      PropertyTokenFactoryArtifact.abi,
      signer
    );

    const shareTokenContract = new ethers.Contract(
      SHARES_TOKEN_ADDRESS,
      RealEstateShareTokenArtifact.abi,
      signer
    );

    const userPropertyIds =
      await shareTokenContract.getPropertiesForShareholder(accountAddress);

    // Filter properties where the user has shares
    const userProperties: UserProperty[] = await Promise.all(
      userPropertyIds.map(async (id: BigNumber) => {
        return await propertyTokenFactoryContract.getProperty(id);
      })
    );

    // Fetch shareholders for each user property
    const userPropertiesWithShareholders: UserProperty[] = await Promise.all(
      userProperties.map(async (property) => {
        const shareholders = await shareTokenContract.getPropertyShareholders(
          property.id
        );
        return { ...property, shareholders };
      })
    );

    return userPropertiesWithShareholders;
  } catch (error) {
    console.error('Error while sending the transaction:', error);
    return [];
  }
};

export const payForShares = async (
  id: number,
  value: number
): Promise<void> => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  const signer = provider.getSigner();
  const account = await signer.getAddress();

  const propertyTokenManagerContract = new ethers.Contract(
    PROPERTY_TOKEN_MANAGER_ADDRESS,
    PropertyTokenManagerArtifact.abi,
    signer
  );

  const conversionRate = await getDollarToEtherConversionRate();

  if (!conversionRate) {
    console.error('Failed to fetch the conversion rate.');
    return;
  }

  const valueInEther = value / conversionRate;
  const valueInWei = ethers.utils.parseEther(valueInEther.toString());

  try {
    const gasEstimate =
      await propertyTokenManagerContract.estimateGas.payForShares(id, {
        from: account,
        value: valueInWei,
      });

    const tx = await propertyTokenManagerContract.payForShares(id, {
      from: account,
      gasLimit: gasEstimate.add(5000),
      value: valueInWei,
    });

    await tx.wait();

    console.log('Property payed');
  } catch (error) {
    console.error('Error while sending the transaction:', error);
  }
};

export const requestPropertyTokenization = async (
  propertyDetails: PropertyDetails,
  setErrorMessage: (message: string) => void
): Promise<void> => {
  try {
    const provider = new ethers.providers.Web3Provider(
      (window as EthereumWindow).ethereum
    );
    const signer = provider.getSigner();
    const account = await signer.getAddress();

    // Get the correct nonce
    const correctNonce = await provider.getTransactionCount(account);

    const propertyTokenFactoryContract = new ethers.Contract(
      PROPERTY_TOKEN_FACTORY_ADDRESS,
      PropertyTokenFactoryArtifact.abi,
      signer
    );

    const gasEstimate =
      await propertyTokenFactoryContract.estimateGas.requestProperty(
        propertyDetails.name,
        propertyDetails.description,
        propertyDetails.location,
        propertyDetails.totalValue,
        propertyDetails.shares,
        { from: account, nonce: correctNonce }
      );

    const tx = await propertyTokenFactoryContract.requestProperty(
      propertyDetails.name,
      propertyDetails.description,
      propertyDetails.location,
      propertyDetails.totalValue,
      propertyDetails.shares,
      { from: account, gasLimit: gasEstimate.add(5000), nonce: correctNonce }
    );

    await tx.wait();

    console.log('Property added to the contract');
    setErrorMessage('');
  } catch (error) {
    if (error.code === 'ACTION_REJECTED') {
      setErrorMessage('Transaction rejected by the user');
    } else {
      // Other errors might be related to gas, network, etc.
      setErrorMessage('Error while sending the transaction');
      console.error('Error while sending the transaction:', error);
    }
  }
};

export const getUserRequestedProperties = async (): Promise<
  UserRequestedProperty[]
> => {
  try {
    const provider = new ethers.providers.Web3Provider(
      (window as EthereumWindow).ethereum
    );
    const signer = provider.getSigner();
    const account = await signer.getAddress();

    const propertyTokenFactoryContract = new ethers.Contract(
      PROPERTY_TOKEN_FACTORY_ADDRESS,
      PropertyTokenFactoryArtifact.abi,
      signer
    );

    const result = await propertyTokenFactoryContract.getUserPropertys(account);

    return result.filter((property) => property.status !== 2);
  } catch (error) {
    console.error('Error while sending the transaction:', error);
  }
};

export const approveRequest = async (requestId: number) => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  const signer = provider.getSigner();

  const propertyTokenFactoryContract = new ethers.Contract(
    PROPERTY_TOKEN_FACTORY_ADDRESS,
    PropertyTokenFactoryArtifact.abi,
    signer
  );

  try {
    const tx = await propertyTokenFactoryContract.approvePropertyRequest(
      requestId
    );
    await tx.wait();
  } catch (error) {
    console.error('Error approving property request:', error);
  }
};

export const rejectRequest = async (requestId: number) => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  const signer = provider.getSigner();

  const propertyTokenFactoryContract = new ethers.Contract(
    PROPERTY_TOKEN_FACTORY_ADDRESS,
    PropertyTokenFactoryArtifact.abi,
    signer
  );

  try {
    const tx = await propertyTokenFactoryContract.rejectPropertyRequest(
      requestId
    );
    await tx.wait();
  } catch (error) {
    console.error('Error rejecting property request:', error);
  }
};

export const getAllNotApprovedProperties = async (): Promise<
  UserRequestedProperty[]
> => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  const signer = provider.getSigner();
  const propertyTokenFactoryContract = new ethers.Contract(
    PROPERTY_TOKEN_FACTORY_ADDRESS,
    PropertyTokenFactoryArtifact.abi,
    signer
  );

  try {
    const requestedProperties =
      await propertyTokenFactoryContract.getAllRequestedProperties();
    return requestedProperties.filter(
      (property) => property.id.toString() !== '0'
    );
  } catch (error) {
    console.error('Error fetching requested properties:', error);
    return [];
  }
};
