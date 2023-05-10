import React, { useEffect, useState } from 'react';
import UserShares from '../components/UserShares';
import { getUserShares } from '../lib/shares';
import useWallet from '../hooks/useWallet';

const Shares = () => {
  const [userShares, setUserShares] = useState([]);
  const { address } = useWallet();

  useEffect(() => {
    const fetchUserShares = async () => {
      const saleOrdersData = await getUserShares(address);
      setUserShares(saleOrdersData);
    };
    fetchUserShares();
  }, []);
  return <UserShares userShares={userShares} />;
};

export default Shares;
