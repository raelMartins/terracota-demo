import React, {useEffect, useState} from 'react';
import {
  ModalContent,
  Box,
  ModalBody,
  VStack,
  Image,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  HStack,
  Input,
} from '@chakra-ui/react';
import {CloseIcon} from '@chakra-ui/icons';
import isMobile from '../../../utils/extras';
import {Button, CustomizableButton} from '../../../ui-lib';
import {formatToCurrency} from '../../../utils';
import {PaymentAccess} from '@/components/payment/PaymentAccess';

const EnterFraction = ({
  fractionalData,
  onCloseModal,
  fractionalModal,
  fractions,
  setFractions,
  setStep,
}) => {
  const [error, setError] = useState('');
  const unitData = fractionalData?.fraction_data?.unit;
  const leftFractions =
    Number(unitData?.total_fractions) - Number(unitData?.total_purchased_fractions);

  const handleFractionInput = e => {
    setError('');
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue > leftFractions)
      setError('Apologies, but you cannot purchase more fractions than are currently available.');
    setFractions(numericValue);
  };

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth);
    });
  }, []);

  const mainContent = (
    <Box w="full" color="text">
      <Flex w="full" justify="space-between" align="center">
        <Text
          color="text"
          fontSize={{base: '23px', md: '33px'}}
          fontWeight={400}
          className="heading-text-regular"
        >
          Buy Fraction
        </Text>
        <CloseIcon
          color="text"
          cursor={'pointer'}
          onClick={fractionalModal?.onClose}
          fontSize={'15px'}
        />
      </Flex>

      <Text fontSize="16px" fontWeight={400} mt="22px">
        How many fraction would you like to purchase?
      </Text>

      <Flex
        direction={'column'}
        align={'stretch'}
        justify={'space-between'}
        mt="14px"
        h="143px"
        borderRadius={'2px'}
        border={`1px solid`}
        borderColor={`matador_border_color.100 !important`}
        bg="matador_background.100"
        w="full"
        px="10px"
        py="18"
      >
        <Input
          value={fractions}
          onChange={handleFractionInput}
          borderRadius={0}
          border={'none'}
          borderBottom="1px solid"
          borderColor={`matador_border_color.100 !important`}
          h="48px"
          w="full"
          pb="39px"
          pt="25px"
          textAlign={'center'}
          fontSize={'28px'}
          fontWeight={600}
          type="number"
          placeholder="0"
        />
        {error ? (
          <Text fontSize={'12px'} fontWeight={400} color="red">
            {error}
          </Text>
        ) : (
          <Flex justify={'space-between'} w="full">
            <Text fontSize={'16px'} fontWeight={400} color="text">
              Total Price
            </Text>
            <Text fontSize={'16px'} fontWeight={500} color="text">
              {formatToCurrency(fractions * unitData?.price_per_fraction)}
            </Text>
          </Flex>
        )}
      </Flex>

      <PaymentAccess
        checkFractions
        content={
          <Button
            mt="32px"
            // onClick={() => setStep('price')}
            color="custom_color.contrast"
            bg="custom_color.color"
            h="49px"
            w="full"
            onClick={() => setStep('payment')}
            isDisabled={error || !Boolean(Number(fractions))}
          >
            Proceed to payment
          </Button>
        }
      />
    </Box>
  );

  return (
    <>
      {isMobile && (
        <Drawer
          autoFocus={false}
          onCloseComplete={onCloseModal}
          isCentered
          onClose={fractionalModal?.onClose}
          isOpen={fractionalModal?.isOpen}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent
            bg="card_bg"
            maxW="716px"
            maxH={`70vh`}
            h="fit-content"
            minH={'372px'}
            py={{base: '22px', md: '35px'}}
            pb={{base: '25px', md: '50px'}}
            px={{base: '17px', md: '37px'}}
            // borderTopRadius={{base: '10px', md: '16px'}}
          >
            <DrawerBody px="0">{mainContent}</DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default EnterFraction;
