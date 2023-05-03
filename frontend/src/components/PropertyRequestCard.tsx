import React from "react";
import {
    Card, Text, CardHeader, CardBody, Divider,
    Badge
} from "@chakra-ui/react";
import { UserRequestedProperty } from "../types";

interface PropertyRequestCardProps {
    property: UserRequestedProperty;
}

const PropertyRequestCard: React.FC<PropertyRequestCardProps> = ({ property }) => {
    return (
        <Card maxW='lg'>
            <CardHeader>
                <Text fontSize="xl" fontWeight="semibold">
                    {property.name} - $
                    {property.totalValue.toString()}
                </Text>
                <Text fontSize="lg" color="gray.600">
                    {property.requestorAddress}
                </Text>
            </CardHeader>
            <Divider />
            <CardBody>
                <Text>
                    Description: {property.description} <br />
                    Location: {property.location} <br />
                    Available Shares: {property.shares.toString()} <br />
                </Text>
                {property.status === 1 && <Badge variant='solid' colorScheme='green'>
                    Approved
                </Badge>}
                {property.status === 2 && <Badge variant='solid' colorScheme='red'>
                    Not Approved
                </Badge>}
            </CardBody>
        </Card >
    );
};

export default PropertyRequestCard;
