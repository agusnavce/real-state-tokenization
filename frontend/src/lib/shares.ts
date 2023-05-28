import { ethers } from 'ethers';
import { SHARES_TOKEN_ADDRESS, SHARE_TOKEN_MANAGER_ADDRESS } from '../config';
import RealEstateShareTokenArtifact from '../contracts/RealEstateShareToken.json';
import SharesTokenManagerArtifact from '../contracts/SharesTokenManager.json';

import {
  EthereumWindow,
  SaleOrder,
  ShareWithOrder,
  Shareholder,
} from '../types';

// Get the user's shares
const getUserShares = async (): Promise<Shareholder[]> => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  const signer = provider.getSigner();
  const accountAddress = await signer.getAddress();
  // Create a contract instance
  const realEstateShareTokenContract = new ethers.Contract(
    SHARES_TOKEN_ADDRESS,
    RealEstateShareTokenArtifact.abi,
    provider
  );

  try {
    const shares = await realEstateShareTokenContract.getUserShares(
      accountAddress
    );
    return shares.map((share: any) => ({
      propertyId: share.propertyId.toString(),
      shareAmount: share.shareAmount.toString(),
    }));
  } catch (error) {
    console.error('Error fetching user shares:', error);
    return [];
  }
};

const getUserOrders = async (): Promise<SaleOrder[]> => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  const signer = provider.getSigner();
  const accountAddress = await signer.getAddress();
  // Create a contract instance
  const shareTokenManagerContract = new ethers.Contract(
    SHARE_TOKEN_MANAGER_ADDRESS,
    SharesTokenManagerArtifact.abi,
    provider
  );

  try {
    const userOrders = await shareTokenManagerContract.getSaleOrdersByUser(
      accountAddress
    );
    return userOrders.map((order: any) => ({
      propertyId: order.propertyId.toString(),
      shareAmount: order.shareAmount.toString(),
    }));
  } catch (error) {
    console.error('Error fetching user shares:', error);
    return [];
  }
};

export const getUserSharesWithOrders = async (): Promise<ShareWithOrder[]> => {
  const formattedOrders = await getUserOrders();
  const formattedShares = await getUserShares();
  console.log(formattedShares, formattedOrders);
  // For each share, see if there's an associated order
  return formattedShares.map((share) => {
    const order = formattedOrders.find(
      (order) => order.propertyId === share.propertyId
    );
    return { ...share, order };
  });
};

export const createSaleOrder = async (
  propertyId: number,
  shareAmount: number
) => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  const shareTokenManagerContract = new ethers.Contract(
    SHARE_TOKEN_MANAGER_ADDRESS,
    SharesTokenManagerArtifact.abi,
    signer
  );

  try {
    const gasEstimate =
      await shareTokenManagerContract.estimateGas.createSaleOrder(
        propertyId,
        shareAmount,
        { from: address }
      );

    const tx = await shareTokenManagerContract.createSaleOrder(
      propertyId,
      shareAmount,
      { from: address, gasLimit: gasEstimate.add(5000) }
    );

    // Wait for transaction to be mined
    await tx.wait();
  } catch (error) {
    console.error('Error creating sale order:', error);
  }
};
