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
                {property.status === 0 && <Badge variant='solid' colorScheme='green'>
                    Pending Approval
                </Badge>}
                {property.status === 1 && <Badge variant='solid' colorScheme='gray'>
                    Ready to pay for shares
                </Badge>}
                {property.status === 3 && <Badge variant='solid' colorScheme='red'>
                    Rejected
                </Badge>}
            </CardBody>
        </Card >
    );
};

export default PropertyRequestCard;
