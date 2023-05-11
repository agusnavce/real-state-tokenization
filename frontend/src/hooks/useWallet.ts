import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthereumWindow } from '../types';
import { PROPERTY_TOKEN_FACTORY_ADDRESS } from '../config';
import PropertyTokenFactoryArtifact from '../contracts/PropertyTokenFactory.json';

interface Wallet {
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string | null;
  isContractOwner: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const useWallet = (): Wallet => {
  const [isConnected, setConnected] = useState(false);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isContractOwner, setIsContractOwner] = useState(false);

  useEffect(() => {
    if (typeof (window as EthereumWindow).ethereum !== 'undefined') {
      const fetchUser = async (provider: ethers.providers.Web3Provider) => {
        const accounts = await (window as EthereumWindow).ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length) {
          const newSigner = provider.getSigner(accounts[0]);
          setSigner(newSigner);
          setAddress(await newSigner.getAddress());
          setConnected(true);
        }
      };
      const newProvider = new ethers.providers.Web3Provider(
        (window as EthereumWindow).ethereum
      );
      (window as EthereumWindow).ethereum.on(
        'accountsChanged',
        handleAccountsChanged
      );
      setProvider(newProvider);
      fetchUser(newProvider);
      return () => {
        if ((window as EthereumWindow).ethereum) {
          (window as EthereumWindow).ethereum.removeListener(
            'accountsChanged',
            handleAccountsChanged
          );
        }
      };
    }
  }, []);

  useEffect(() => {
    if (address) {
      checkIsContractOwner(address);
    }
  }, [provider]);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (provider && accounts.length) {
      const newSigner = provider.getSigner(accounts[0]);
      setSigner(newSigner);
      const address = await newSigner.getAddress();
      setAddress(address);
      checkIsContractOwner(address);
      setConnected(true);
    }
  };

  const connectWallet = async () => {
    try {
      if (provider) {
        const accounts = await (window as EthereumWindow).ethereum.request({
          method: 'eth_requestAccounts',
        });
        const newSigner = provider.getSigner(accounts[0]);
        setSigner(newSigner);
        setAddress(await newSigner.getAddress());
        setConnected(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setSigner(null);
    setAddress(null);
    setConnected(false);
    if ((window as EthereumWindow).ethereum) {
      (window as EthereumWindow).ethereum.removeAllListeners();
    }
  };

  const checkIsContractOwner = async (accountAddress: string) => {
    if (!provider) return;

    const propertyTokenFactoryContract = new ethers.Contract(
      PROPERTY_TOKEN_FACTORY_ADDRESS,
      PropertyTokenFactoryArtifact.abi,
      provider
    );

    const contractOwner = await propertyTokenFactoryContract.owner();
    const isContractOwner =
      contractOwner.toLowerCase() === accountAddress.toLowerCase();
    console.log('is contract owner:', isContractOwner);
    setIsContractOwner(isContractOwner);
  };

  return {
    isConnected,
    provider,
    signer,
    address,
    isContractOwner,
    connectWallet,
    disconnectWallet,
  };
};

export default useWallet;
