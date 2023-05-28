import React, { useEffect, useState } from 'react';
import UserShares from '../components/UserShares';
import { createSaleOrder, getUserSharesWithOrders } from '../lib/shares';
import { ShareWithOrder } from '../types';

const Shares: React.FC = () => {
  const [userShares, setUserShares] = useState<ShareWithOrder[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedShare, setSelectedShare] = useState<ShareWithOrder>(null);

  useEffect(() => {
    const fetchData = async () => {
      const saleOrdersData: ShareWithOrder[] = await getUserSharesWithOrders();
      setUserShares(saleOrdersData);
    };
    fetchData();
  }, []);

  const handleShareAmountChange = (
    valueAsString: string,
    valueAsNumber: number
  ) => {
    setSelectedShare(
      (prev: ShareWithOrder) =>
        ({
          ...prev,
          shareAmount: valueAsNumber,
        } as ShareWithOrder)
    );
  };

  const handleConfirmSell = async () => {
    console.log('Confirmed sell for:', selectedShare);
    await createSaleOrder(selectedShare.propertyId, selectedShare.shareAmount);
    setIsOpen(false);
  };

  return (
    <UserShares
      userShares={userShares}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      setSelectedShare={setSelectedShare}
      selectedShare={selectedShare}
      handleShareAmountChange={handleShareAmountChange}
      handleConfirmSell={handleConfirmSell}
    />
  );
};

export default Shares;
