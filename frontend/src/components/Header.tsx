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
    const { isConnected, connectWallet } = useWallet();

    return (
        <Box bg="blue.900" p={4}>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold" color="white">
                    Real Estate Tokenization
                </Text>
                <Flex>
                    <Menu>
                        {isConnected && <Box>
                            <MenuButton as={Button} colorScheme="blue" variant="ghost">
                                Properties
                            </MenuButton>
                            <MenuList>
                                <Link href="/properties" passHref>
                                    <MenuItem>My properties</MenuItem>
                                </Link>
                                <Link href="/trade" passHref>
                                    <MenuItem>Trade Properties</MenuItem>
                                </Link>
                                <Link href="/tokenize" passHref>
                                    <MenuItem>Tokenization</MenuItem>
                                </Link>
                            </MenuList>
                        </Box>}
                    </Menu>
                    {!isConnected && (
                        <Button colorScheme="blue" variant="ghost" ml={2} onClick={connectWallet}>
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
