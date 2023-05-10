import React, { useEffect } from 'react';
import { usePropertyContext } from '../contexts/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import PropertyRequestCard from '../components/PropertyRequestCard';

import {
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import useWallet from '../hooks/useWallet';
import { payForShares } from '../lib/property';

function MyProperties() {
  const { address } = useWallet();
  const {
    properties,
    fetchProperties,
    userRequestedProperties,
    fetchUserRequestedProperties,
  } = usePropertyContext();

  useEffect(() => {
    fetchProperties();
    fetchUserRequestedProperties();
  }, [address]);

  const handlePayForShares = async (id: number, value: number) => {
    await payForShares(id, value);
    fetchProperties();
    fetchUserRequestedProperties();
  };

  return (
    <Tabs isFitted variant='enclosed'>
      <TabList mb='1em'>
        <Tab>My properties with shares</Tab>
        <Tab>Requested Properties</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Grid templateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={4}>
            {properties.map((property, index) => (
              <GridItem key={index}>
                <PropertyCard property={property} />
              </GridItem>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid templateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={4}>
            {userRequestedProperties.map((requestedProperty, index) => (
              <GridItem key={index}>
                <PropertyRequestCard
                  property={requestedProperty}
                  isOwner={false}
                  onPayForShares={handlePayForShares}
                />
              </GridItem>
            ))}
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default MyProperties;
