import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import Link from 'next/link';
import useWallet from '../hooks/useWallet';

const Header = () => {
  const { isConnected, connectWallet, isContractOwner } = useWallet();

  return (
    <Box bg='blue.900' p={4}>
      <Flex justifyContent='space-between' alignItems='center'>
        <Text fontSize='lg' fontWeight='bold' color='white'>
          Real Estate Tokenization
        </Text>
        <Flex flexDirection={'row'}>
          {isContractOwner && (
            <Link href='/owner' passHref>
              <Button colorScheme='blue' variant='ghost' ml={2}>
                Admin Properties
              </Button>
            </Link>
          )}
          {isConnected && (
            <Menu>
              <Box>
                <MenuButton
                  as={Button}
                  colorScheme='blue'
                  variant='ghost'
                  mb={2}
                >
                  Properties
                </MenuButton>
                <MenuList>
                  <Link href='/properties' passHref>
                    <MenuItem>My properties</MenuItem>
                  </Link>
                  <Link href='/tokenize' passHref>
                    <MenuItem>Tokenization</MenuItem>
                  </Link>
                </MenuList>
              </Box>
            </Menu>
          )}
          {isConnected && (
            <Menu>
              <Box>
                <MenuButton as={Button} colorScheme='blue' variant='ghost'>
                  Trading
                </MenuButton>
                <MenuList>
                  <Link href='/shares' passHref>
                    <MenuItem>My Shares</MenuItem>
                  </Link>
                  <Link href='/orders' passHref>
                    <MenuItem>Orders</MenuItem>
                  </Link>
                </MenuList>
              </Box>
            </Menu>
          )}
          {!isConnected && (
            <Button
              colorScheme='blue'
              variant='ghost'
              ml={2}
              onClick={connectWallet}
            >
              Connect
            </Button>
          )}
          {isConnected && <Avatar ml={2} />}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
