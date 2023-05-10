// components/PropertyCard.tsx

import React, { useState } from 'react';
import {
  Card,
  Text,
  CardHeader,
  CardBody,
  Divider,
  Button,
} from '@chakra-ui/react';
import ShareholdersList from './ShareholderList';
import { UserProperty } from '../types';

interface PropertyCardProps {
  property: UserProperty;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [showShareholders, setShowShareholders] = useState(false);

  const toggleShareholders = () => {
    setShowShareholders(!showShareholders);
  };

  return (
    <Card maxW='lg'>
      <CardHeader>
        <Text fontSize='xl' fontWeight='semibold'>
          {property.name} ({property.id.toNumber()}) - $
          {property.totalValue.toNumber()}
        </Text>
      </CardHeader>
      <Divider />
      <CardBody>
        <Text>
          Description: {property.description} <br />
          Location: {property.location} <br />
        </Text>
        <Button colorScheme='blue' onClick={toggleShareholders} mt={2}>
          {showShareholders ? 'Hide Shareholders' : 'View Shareholders'}
        </Button>
        <ShareholdersList
          shareholders={property.shareholders}
          showShareholders={showShareholders}
        />
      </CardBody>
    </Card>
  );
};

export default PropertyCard;
