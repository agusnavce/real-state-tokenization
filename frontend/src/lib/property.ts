import { ethers } from "ethers";
import { PROPERTY_TOKEN_FACTORY_ADDRESS, SHARES_TOKEN_ADDRESS } from "../config";
import PropertyTokenFactoryArtifact from "../contracts/PropertyTokenFactory.json";
import RealEstateShareTokenArtifact from "../contracts/RealEstateShareToken.json";
import { EthereumWindow, PropertyDetails, UserProperty, UserRequestedProperty } from "../types";

export const getUserProperties = async (): Promise<UserProperty[]> => {
    try {
        const provider = new ethers.providers.Web3Provider((window as EthereumWindow).ethereum);
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

        const allProperties = await propertyTokenFactoryContract.getAllProperties();

        // Filter properties where the user has shares
        const userProperties: UserProperty[] = await Promise.all(
            allProperties.map(async (property: UserProperty) => {
                const userShares = await shareTokenContract.propertyBalanceOf(property.propertyId, accountAddress);
                return userShares.toNumber() > 0 ? property : null;
            })
        );

        const filteredUserProperties = userProperties.filter((property) => property !== null);

        // Fetch shareholders for each user property
        const userPropertiesWithShareholders: UserProperty[] = await Promise.all(
            filteredUserProperties.map(async (property) => {
                const shareholders = await shareTokenContract.getPropertyShareholders(property.propertyId);
                return { ...property, shareholders };
            })
        );

        return userPropertiesWithShareholders;
    } catch (error) {
        console.error('Error while sending the transaction:', error);
        return [];
    }
};

export const tokenizeProperty = async (propertyDetails: PropertyDetails): Promise<void> => {
    try {
        const provider = new ethers.providers.Web3Provider((window as EthereumWindow).ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        const propertyTokenFactoryContract = new ethers.Contract(
            PROPERTY_TOKEN_FACTORY_ADDRESS,
            PropertyTokenFactoryArtifact.abi,
            signer
        );

        const gasEstimate = await propertyTokenFactoryContract.estimateGas.createPropertyToken(
            propertyDetails.name,
            propertyDetails.description,
            propertyDetails.location,
            propertyDetails.totalValue,
            propertyDetails.shares,
            { from: account }
        );

        const result = await propertyTokenFactoryContract.createPropertyToken(
            propertyDetails.name,
            propertyDetails.description,
            propertyDetails.location,
            propertyDetails.totalValue,
            propertyDetails.shares,
            { from: account, gasLimit: gasEstimate.add(5000) }
        );

        console.log('Property added to the contract:', result);
    } catch (error) {
        console.error('Error adding property to the contract:', error);
    }
};

export const requestPropertyTokenization = async (
    propertyDetails: PropertyDetails,
    setErrorMessage: (message: string) => void
): Promise<void> => {
    try {
        const provider = new ethers.providers.Web3Provider((window as EthereumWindow).ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        // Get the correct nonce
        const correctNonce = await provider.getTransactionCount(account);

        const propertyTokenFactoryContract = new ethers.Contract(
            PROPERTY_TOKEN_FACTORY_ADDRESS,
            PropertyTokenFactoryArtifact.abi,
            signer
        );

        const gasEstimate = await propertyTokenFactoryContract.estimateGas.requestProperty(
            propertyDetails.name,
            propertyDetails.description,
            propertyDetails.location,
            propertyDetails.totalValue,
            propertyDetails.shares,
            { from: account, nonce: correctNonce }
        );

        const result = await propertyTokenFactoryContract.requestProperty(
            propertyDetails.name,
            propertyDetails.description,
            propertyDetails.location,
            propertyDetails.totalValue,
            propertyDetails.shares,
            { from: account, gasLimit: gasEstimate.add(5000), nonce: correctNonce }
        );

        console.log('Property added to the contract:', result);
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

export const getUserRequestedProperties = async (): Promise<UserRequestedProperty[]> => {
    try {
        const provider = new ethers.providers.Web3Provider((window as EthereumWindow).ethereum);
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        const propertyTokenFactoryContract = new ethers.Contract(
            PROPERTY_TOKEN_FACTORY_ADDRESS,
            PropertyTokenFactoryArtifact.abi,
            signer
        );

        const result = await propertyTokenFactoryContract.getUserPropertyRequests(account);
        return result;
    } catch (error) {
        console.error('Error while sending the transaction:', error);
    }
};