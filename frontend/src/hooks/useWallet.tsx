import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EthereumWindow } from '../types';

interface Wallet {
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const useWallet = (): Wallet => {
  const [isConnected, setConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof (window as EthereumWindow).ethereum !== 'undefined') {
      const fetchUser = async (provider: ethers.providers.Web3Provider) => {
        const accounts = await (window as EthereumWindow).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length) {
          const newSigner = provider.getSigner(accounts[0]);
          setSigner(newSigner);
          setAddress(await newSigner.getAddress());
          setConnected(true);
        }
      };
      const newProvider = new ethers.providers.Web3Provider((window as EthereumWindow).ethereum);
      setProvider(newProvider);
      fetchUser(newProvider);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (provider) {
        const accounts = await (window as EthereumWindow).ethereum.request({ method: 'eth_requestAccounts' });
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

  return { isConnected, provider, signer, address, connectWallet, disconnectWallet };
};

export default useWallet;
