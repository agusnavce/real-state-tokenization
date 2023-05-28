import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { ShareWithOrder } from '../types';
import { getSharesForSelling } from '../hooks/util';

interface SellShareModalProps {
  selectedShare: ShareWithOrder | null;
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmSell: () => void;
  handleShareAmountChange: (
    valueAsString: string,
    valueAsNumber: number
  ) => void;
}

const SellShareModal: React.FC<SellShareModalProps> = ({
  selectedShare,
  isOpen,
  handleClose,
  handleConfirmSell,
  handleShareAmountChange,
}) => {
  const [max, setMax] = useState<number>(0);

  useEffect(() => {
    console.log(selectedShare);
    setMax(getSharesForSelling(selectedShare));
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sell Shares</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Property Id</FormLabel>
            <Input value={selectedShare?.propertyId} isReadOnly />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Share Amount</FormLabel>
            <NumberInput
              clampValueOnBlur={true}
              min={1}
              max={max}
              defaultValue={selectedShare?.shareAmount}
              onChange={handleShareAmountChange}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant='ghost' onClick={handleClose}>
            Cancel
          </Button>
          <Button colorScheme='blue' ml={3} onClick={handleConfirmSell}>
            Confirm Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SellShareModal;
