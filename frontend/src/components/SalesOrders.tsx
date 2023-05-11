import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

// Replace this with the function to fetch sale orders from your smart contract
const fetchSaleOrders = async () => {
  return [
    {
      id: 1,
      property: 'Property 1',
      shareAmount: 5,
      pricePerShare: 100,
      seller: '0x12345',
    },
    {
      id: 2,
      property: 'Property 2',
      shareAmount: 10,
      pricePerShare: 150,
      seller: '0x67890',
    },
  ];
};

const SaleOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchSaleOrdersData = async () => {
      const saleOrdersData = await fetchSaleOrders();
      setOrders(saleOrdersData);
    };
    fetchSaleOrdersData();
  }, []);

  return (
    <Box>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Property</Th>
            <Th>Share Amount</Th>
            <Th>Price per Share</Th>
            <Th>Seller</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.property}</Td>
              <Td>{order.shareAmount}</Td>
              <Td>{order.pricePerShare}</Td>
              <Td>{order.seller}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SaleOrders;
