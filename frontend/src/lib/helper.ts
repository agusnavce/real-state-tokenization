import axios from 'axios';

export const getDollarToEtherConversionRate = async (): Promise<number> => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error while fetching the conversion rate:', error);
    return 0;
  }
};
