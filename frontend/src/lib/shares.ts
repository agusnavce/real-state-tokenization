import { ethers } from 'ethers';
import { SHARES_TOKEN_ADDRESS } from '../config';
import RealEstateShareTokenArtifact from '../contracts/RealEstateShareToken.json';
import { EthereumWindow, Shareholder } from '../types';

// Get the user's shares
export const getUserShares = async (
  userAddress: string
): Promise<Shareholder[]> => {
  const provider = new ethers.providers.Web3Provider(
    (window as EthereumWindow).ethereum
  );
  // Create a contract instance
  const realEstateShareTokenContract = new ethers.Contract(
    SHARES_TOKEN_ADDRESS,
    RealEstateShareTokenArtifact.abi,
    provider
  );

  try {
    const shares = await realEstateShareTokenContract.getUserShares(
      userAddress
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
