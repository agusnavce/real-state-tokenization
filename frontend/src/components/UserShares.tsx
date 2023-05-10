import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

const UserShares = ({ userShares }) => {
  const handleSellShares = (share) => {
    console.log('Selling shares:', share);
    // Implement the logic to sell shares using your smart contract
  };

  return (
    <Box>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Property Id</Th>
            <Th>Share Amount</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userShares.map((share, index) => (
            <Tr key={index}>
              <Td>{share.propertyId}</Td>
              <Td>{share.shareAmount}</Td>
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
    </Box>
  );
};

export default UserShares;
