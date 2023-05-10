import React, { useEffect } from 'react';
import { usePropertyContext } from '../contexts/PropertyContext';
import { Grid, GridItem, Container, Heading, Text } from '@chakra-ui/react';
import PropertyRequestCard from '../components/PropertyRequestCard';
import { approveRequest, rejectRequest } from '../lib/property';

function OwnerPage() {
  const { notApprovedProperties, fetchNotApprovedProperties } =
    usePropertyContext();
  useEffect(() => {
    fetchNotApprovedProperties();
  }, []);

  const handleApprove = async (id: number) => {
    await approveRequest(id);
    fetchNotApprovedProperties();
  };

  const handleReject = async (id: number) => {
    await rejectRequest(id);
    fetchNotApprovedProperties();
  };

  return (
    <Container maxW='container.xl' py={5}>
      <Heading as='h1' size='2xl' mb={6} textAlign='center'>
        Approve Property Requests
      </Heading>
      {notApprovedProperties.length > 0 ? (
        <Grid templateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={4}>
          {notApprovedProperties.map((requestedProperty, index) => (
            <GridItem key={index}>
              <PropertyRequestCard
                property={requestedProperty}
                isOwner={true}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Text fontSize='xl' textAlign='center'>
          No properties to approve.
        </Text>
      )}
    </Container>
  );
}

export default OwnerPage;
