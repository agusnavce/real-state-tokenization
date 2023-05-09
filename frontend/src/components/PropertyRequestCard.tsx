import React from 'react';
import {
  Card,
  Text,
  CardHeader,
  CardBody,
  Divider,
  Badge,
  Button,
  CardFooter,
  ButtonGroup,
  Box,
} from '@chakra-ui/react';
import { UserRequestedProperty } from '../types';

interface PropertyRequestCardProps {
  property: UserRequestedProperty;
  isOwner: boolean;
  onApprove?: (id: number) => void;
  onPayForShares?: (id: number) => void;
  onReject?: (id: number) => void;
}

const PropertyRequestCard: React.FC<PropertyRequestCardProps> = ({
  property,
  isOwner,
  onApprove,
  onPayForShares,
  onReject,
}) => {
  return (
    <Card maxW='lg'>
      <CardHeader>
        <Text fontSize='xl' fontWeight='semibold'>
          {property.name} - ${property.totalValue.toString()}
        </Text>
        <Text fontSize='lg' color='gray.600'>
          {property.requestorAddress}
        </Text>
      </CardHeader>
      <CardBody>
        <Text>
          Description: {property.description} <br />
          Location: {property.location} <br />
          Available Shares: {property.shares.toString()} <br />
        </Text>
        {property.status === 0 && (
          <Badge variant='solid' colorScheme='green'>
            Pending Approval
          </Badge>
        )}
        {property.status === 1 && (
          <Badge variant='solid' colorScheme='gray'>
            Ready to pay for shares
          </Badge>
        )}
        {property.status === 3 && (
          <Badge variant='solid' colorScheme='red'>
            Rejected
          </Badge>
        )}
      </CardBody>
      {((!isOwner && property.status === 1) ||
        (isOwner && property.status === 0)) && (
        <Box>
          <Divider />
          <CardFooter>
            {isOwner && property.status === 0 && (
              <ButtonGroup spacing='2'>
                <Button
                  colorScheme='teal'
                  onClick={() => {
                    if (onApprove) {
                      onApprove(property.id);
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  colorScheme='red'
                  onClick={() => {
                    if (onReject) {
                      onReject(property.id);
                    }
                  }}
                >
                  Reject
                </Button>
              </ButtonGroup>
            )}
            {!isOwner && property.status === 1 && (
              <Button
                colorScheme='teal'
                onClick={() => {
                  if (onPayForShares) {
                    onPayForShares(property.id);
                  }
                }}
              >
                Pay for Shares
              </Button>
            )}
          </CardFooter>
        </Box>
      )}
    </Card>
  );
};

export default PropertyRequestCard;
