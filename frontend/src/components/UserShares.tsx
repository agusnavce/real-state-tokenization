import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import SellShareModal from './SellShareModal';
import { ShareWithOrder } from '../types';
import { getSharesForSelling } from '../hooks/util';

interface UserSharesProps {
  userShares: ShareWithOrder[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedShare: Dispatch<SetStateAction<ShareWithOrder>>;
  selectedShare: ShareWithOrder;
  handleShareAmountChange: (
    valueAsString: string,
    valueAsNumber: number
  ) => void;
  handleConfirmSell: () => Promise<void>;
}

const UserShares: React.FC<UserSharesProps> = ({
  userShares,
  isOpen,
  setIsOpen,
  selectedShare,
  setSelectedShare,
  handleShareAmountChange,
  handleConfirmSell,
}) => {
  const handleSellShares = (share: ShareWithOrder) => {
    setSelectedShare(share);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedShare(null);
  };

  const getShareToSell = (swo: ShareWithOrder) => {
    return swo.order ? swo.order.shareAmount : 0;
  };

  return (
    <Box>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Property Id</Th>
            <Th>Share Amount</Th>
            <Th>Shares on sell</Th>
            <Th>Shares for selling</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userShares.map((share, index) => (
            <Tr key={index}>
              <Td>{share.propertyId}</Td>
              <Td>{share.shareAmount}</Td>
              <Td>{getShareToSell(share)}</Td>
              <Td>{getSharesForSelling(share)}</Td>
              <Td>
                <Button
                  colorScheme='blue'
                  onClick={() => handleSellShares(share)}
                >
                  Sell Shares
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {isOpen && (
        <SellShareModal
          selectedShare={selectedShare}
          isOpen={isOpen}
          handleClose={handleClose}
          handleConfirmSell={handleConfirmSell}
          handleShareAmountChange={handleShareAmountChange}
        />
      )}
    </Box>
  );
};

export default UserShares;
