import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import SaleOrders from '../components/SalesOrders';

const Orders = () => {
  return (
    <div>
      <Tabs isFitted variant='enclosed'>
        <TabList>
          <Tab>My Orders</Tab>
          <Tab>Orders</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SaleOrders />
          </TabPanel>
          <TabPanel>
            <SaleOrders />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Orders;
