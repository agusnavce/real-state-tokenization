// components/ShareholdersList.tsx

import React from 'react';
import {
  UnorderedList,
  ListItem,
  Collapse,
  Flex,
  Box,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Shareholder } from '../types';

interface ShareholdersListProps {
  shareholders: Shareholder[];
  showShareholders: boolean;
}

const ShareholdersList: React.FC<ShareholdersListProps> = ({
  shareholders,
  showShareholders,
}) => {
  return (
    <Collapse in={showShareholders} animateOpacity>
      <UnorderedList>
        {shareholders.map((shareholder, index) => (
          <ListItem key={index}>
            <Flex align='center'>
              <Box>
                <Text>
                  {shareholder.shareholder} - {shareholder.shareAmount} shares
                </Text>
              </Box>
              <Spacer />
            </Flex>
          </ListItem>
        ))}
      </UnorderedList>
    </Collapse>
  );
};

export default ShareholdersList;
