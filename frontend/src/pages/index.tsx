import React from 'react';
import { Box, Text, Button, Grid, Container, VStack } from '@chakra-ui/react';

const Home = () => {
  return (
    <Box minH="100vh" bg="gray.100">
      <Box
        bgImage="url('/assets/banner.jpg')"
        bgPosition="center"
        bgSize="cover"
        h="50vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="black"
      >
        <VStack spacing={6}>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center">
            Tokenization of Real Estate Assets
          </Text>
          <Text textAlign="center">
            Real estate properties can be represented as digital tokens on a blockchain, enabling fractional ownership and simplified trading of real estate assets. This can make real estate investments more accessible to a broader range of investors and increase liquidity in the market.
          </Text>
          <Text fontSize="xl" fontWeight="medium" textAlign="center">
            Click the Connect button to start testing our platform today!
          </Text>
          <Button colorScheme="blue">Learn More</Button>
        </VStack>
      </Box>
      <Box bg="white" py={10}>
        <Container maxW="container.md">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
            How It Works
          </Text>
          <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}>
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">Step 1: Tokenization</Text>
              <Text mt={4}>
                Real estate properties are converted into digital tokens that are stored on a blockchain.
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">Step 2: Fractional Ownership</Text>
              <Text mt={4}>
                Investors can purchase a fraction of a tokenized real estate asset, which gives them fractional ownership of the property.
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="xl" fontWeight="bold">Step 3: Trading</Text>
              <Text mt={4}>
                Investors can buy and sell their tokenized real estate assets on a blockchain-based exchange, which simplifies the trading process and increases liquidity in the market.
              </Text>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box bg="white" py={10}>
        <Container maxW="container.md">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
            Advantages
          </Text>
          <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}>
            <Box textAlign="center" p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold">Accessibility</Text>
              <Text mt={4}>
                Tokenization of real estate assets makes real estate investments more accessible to a broader range of investors.
              </Text>
            </Box>
            <Box textAlign="center" p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold">Liquidity</Text>
              <Text mt={4}>
                Tokenization of real estateassets increases liquidity in the market by simplifying the trading process.
              </Text>
            </Box>
            <Box textAlign="center" p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="xl" fontWeight="bold">Transparency</Text>
              <Text mt={4}>
                Tokenization of real estate assets increases transparency in the market by providing investors with a clear view of the underlying asset and its value.
              </Text>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box as="footer" textAlign="center" py={2}>
        <Text fontSize="sm">© 2023 My Landing Page. All rights reserved.</Text>
      </Box>
    </Box>
  );
};

export default Home;
