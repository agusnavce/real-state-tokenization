import React from "react";
import {
  Card, Text, CardHeader, CardBody, Divider,
  UnorderedList, ListItem
} from "@chakra-ui/react";

const PropertyCard = ({ property, shareholders }) => {
  return (
    <Card maxW='lg'>
      <CardHeader>
        <Text fontSize="xl" fontWeight="semibold">
          {property.name} ({property.propertyId.toNumber()}) - $
          {property.propertyValue.toNumber()}
        </Text>
        <Text fontSize="lg" color="gray.600">
          {property.tokenAddress}
        </Text>
      </CardHeader>
      <Divider />
      <CardBody>
        <Text>
          Description: {property.description} <br />
          Location: {property.location} <br />
        </Text>
        <Text fontWeight="medium">Shareholders:</Text>
        <UnorderedList>
          {shareholders.map((shareholder, index) => (
            <ListItem key={index}>
              {shareholder.shareholder} - {shareholder.shareAmount.toNumber()}{" "}
              shares
            </ListItem>
          ))}
        </UnorderedList>
      </CardBody>
    </Card >
  );
};

export default PropertyCard;
