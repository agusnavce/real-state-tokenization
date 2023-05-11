import React, { useEffect, useState } from 'react';
import UserShares from '../components/UserShares';
import { getUserSharesWithOrders } from '../lib/shares';
import { ShareWithOrder } from '../types';

const Shares: React.FC = () => {
  const [userShares, setUserShares] = useState<ShareWithOrder[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const saleOrdersData: ShareWithOrder[] = await getUserSharesWithOrders();
      setUserShares(saleOrdersData);
    };
    fetchData();
  }, []);

  return <UserShares userShares={userShares} />;
};

export default Shares;
