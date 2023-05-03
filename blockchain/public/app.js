let web3;


async function checkWallet() {
    // Check if the user's wallet is connected
    if (web3 && web3.currentProvider) {
        console.log('Connected to Wallet');
      // Show the content and hide the connect wallet button
      document.getElementById('content').classList.remove('hidden');
      document.getElementById('connect-wallet').classList.add('hidden');
    }
    console.log('Not connected');
  }

  // Check the wallet status every 4 minutes
setInterval(checkWallet, 1 * 60 * 1000);

async function connectMetamask() {
  // Check if the MetaMask provider is available
  if (typeof window.ethereum !== 'undefined') {
    // Create a new Web3 object using the MetaMask provider
    web3 = new Web3(window.ethereum);

    try {
      // Request access to the user's MetaMask account
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Switch to the Polygon network
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });

      // Get the user's address
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];

      // Display the user's address
      console.log('Connected to MetaMask wallet address ${address} on Polygon network');
      checkWallet();
    } catch (error) {
        console.log(`Failed to connect to MetaMask: ${error.message}`);
    }
  } else {
    console.log('Please install MetaMask to use this feature');
  }
}

async function connectWalletConnect() {
  // Check if WalletConnect is available
  if (typeof window.ethereum !== 'undefined') {
    // Create a new Web3 object using the WalletConnect provider
    web3 = new Web3(window.ethereum);

    try {
      // Request access to the user's WalletConnect session
      await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });

      // Switch to the Polygon network
      await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://rpc-mainnet.matic.network'],
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        blockExplorerUrls: ['https://polygonscan.com/']
      }]});

      // Get the user's address
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];

      // Display the user's address
      console.log(`Connected to WalletConnect wallet address ${address} on Polygon network`);
      checkWallet();
    } catch (error) {
        console.log(`Failed to connect to WalletConnect: ${error.message}`);
    }
  } else {
    console.log('Please install WalletConnect to use this feature');
  }
}

const ALCH_ENDPOINT = 'https://polygon-mainnet.g.alchemy.com/v2/oKGUyma1y-qMRHhWGiJRxQlAJTT0CDHO';


async function checkTokenOwnership(tokenAddress, tokenId, userAddress) {
  web3 = new Web3(ALCH_ENDPOINT);
  // Construct the contract interface using the token's ABI
  const tokenABI = [/* token ABI */];
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

  // Check if the user owns the token
  const balance = await tokenContract.methods.balanceOf(userAddress).call();
  const ownsToken = balance >= tokenId;

  return ownsToken;
}