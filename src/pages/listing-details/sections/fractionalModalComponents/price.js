import React, {useEffect, useState} from 'react';
import {
  ModalContent,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  Box,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Image,
  VStack,
  Input,
  DrawerCloseButton,
  Stack,
} from '@chakra-ui/react';
import {Button} from '../../../../ui-lib';
import isMobile from '../../../../utils/extras';
import {CloseIcon} from '@chakra-ui/icons';
import {formatToCurrency} from '../../../../utils';
import FractionalDetails from './fractionalDetails';
import StackHoldersForFractional from './stakeHoldersForFractionals';

import {PriceContent} from './PriceContent';
import {PaymentAccess} from '@/components/payment/PaymentAccess';

const Price = ({
  fractionalData,
  onCloseModal,
  fractionalModal,
  fractions,
  setFractions,
  setStep,
  info,
}) => {
  const [error, setError] = useState('');
  const unitData = fractionalData?.fraction_data?.unit;

  const isBuildingTypeSingleFamilyResidential =
    unitData?.project?.building_type == 'Detached' ||
    unitData?.project?.building_type == 'Semi Detached' ||
    unitData?.project?.building_type == 'Land';

  const fractionalPercent = Math.ceil(
    (Number(unitData?.total_purchased_fractions) /
      (Number(unitData?.total_fractions) + Number(unitData?.total_purchased_fractions))) *
      100
  ).toFixed(2);

  const leftFractions = Number(unitData?.total_fractions);

  const handleFractionInput = e => {
    setError('');
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue > leftFractions)
      setError('Apologies, but you cannot purchase more fractions than are currently available.');
    setFractions(numericValue);
  };

  const mainContent = (
    <Box w="full">
      <Stack w="full" spacing="35px">
        <Stack w="full" spacing="30px">
          <Flex gap="20px">
            <Image alt="" w="170px" h="167px" src={unitData?.photos?.[0]?.photo} />
            <Box w="full">
              <Flex justify={'space-between'} w="full" align={'center'}>
                <Text className="heading-text-regular" fontSize={'23px'}>
                  {unitData?.project?.name}
                </Text>
                <CloseIcon cursor={'pointer'} onClick={fractionalModal?.onClose} />
              </Flex>
              <Text fontSize={'13px'} fontWeight={500} color="text">
                Price Per Fraction
              </Text>
              <Text fontSize={'33px'} className="heading-text-regular">
                {formatToCurrency(unitData?.price_per_fraction)}
              </Text>

              <Box
                w="full"
                bg="matador_background.100"
                border="0.2px solid"
                borderColor={`matador_border_color.100`}
                borderRadius={'5px'}
                px="10px"
                pb="9px"
              >
                <Box
                  mt="39px"
                  bg="text"
                  w="full"
                  h="10px"
                  borderRadius={'full'}
                  position={'relative'}
                >
                  <Box
                    position={'absolute'}
                    h="20px"
                    w="2px"
                    bg="custom_color.color"
                    left={`${fractionalPercent}%`}
                    top="-5px"
                  />

                  <Text
                    position={'absolute'}
                    color="custom_color.color"
                    left={`${fractionalPercent}%`}
                    transform={`translateX(-${
                      fractionalPercent < 3 ? '0' : fractionalPercent > 95 ? '100' : '50'
                    }%)`}
                    top="-30px"
                  >
                    {`${fractionalPercent}%`}
                  </Text>
                  <Box
                    w={`${fractionalPercent}%`}
                    h="full"
                    bg="custom_color.color"
                    borderRadius={'full'}
                  />
                </Box>
                <HStack w="full" align="center" justify={'space-between'} mt="10px" px="4px">
                  <Text fontSize={'11px'} fontWeight={400}>
                    {unitData?.total_purchased_fractions} fraction
                    {unitData?.total_purchased_fractions != 1 && `s`} sold
                  </Text>
                  <Text fontSize={'11px'} fontWeight={400}>
                    {leftFractions} fraction{leftFractions != 1 && `s`} left
                  </Text>
                </HStack>
              </Box>
            </Box>
          </Flex>

          <HStack w="full" justify={'space-between'}>
            {!isBuildingTypeSingleFamilyResidential && (
              <VStack>
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  Unit
                </Text>
                <Text fontSize={'19px'} fontWeight={500} textTransform="capitalize">
                  {fractionalData?.fraction_data?.unit?.unit_title || '-'}
                </Text>
              </VStack>
            )}
            {Number(fractionalData?.extra_info?.dividend_amount) && (
              <VStack>
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  Dividend
                </Text>
                <Text fontSize={'19px'} fontWeight={500} textTransform="capitalize">
                  {fractionalData?.extra_info?.dividend_amount
                    ? formatToCurrency(fractionalData?.extra_info?.dividend_amount)
                    : '-'}
                </Text>
              </VStack>
            )}
            {fractionalData?.extra_info?.dividend_payout && (
              <VStack>
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  Payout Type
                </Text>
                <Text fontSize={'19px'} fontWeight={500} textTransform="capitalize">
                  {fractionalData?.extra_info?.dividend_payout}
                </Text>
              </VStack>
            )}
            {/* <VStack>
          <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
            No of Stakeholders
          </Text>
          <Text fontSize={'19px'} fontWeight={500} textTransform="capitalize">
            {fractionalData?.partners?.length || '-'}
          </Text>
        </VStack> */}
            {unitData?.holding_period && (
              <VStack>
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  Holding Period
                </Text>
                <Text fontSize={'19px'} fontWeight={500} textTransform="capitalize">
                  {unitData?.holding_period}
                </Text>
              </VStack>
            )}
            <VStack>
              <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                Investor&apos;s Packet
              </Text>
              <Text
                fontSize={'19px'}
                fontWeight={500}
                color="custom_color.color"
                cursor={'pointer'}
                onClick={() =>
                  window.open(
                    `${
                      fractionalData?.packets?.[0]?.packet
                        ? fractionalData?.packets?.[0]?.packet
                        : ''
                    }`,
                    '_blank'
                  )
                }
              >
                View
              </Text>
            </VStack>
          </HStack>
        </Stack>
        {fractionalData?.partners?.length ? (
          <StackHoldersForFractional stackHolders={fractionalData?.partners} />
        ) : null}

        <VStack align={'stretch'} w="full" spacing={'15px'}>
          <Text fontSize={'16px'} fontWeight={400}>
            How many fraction would you like to purchase?
          </Text>
          <Flex gap="8px" w="full">
            <Input
              value={fractions}
              onChange={handleFractionInput}
              borderRadius={0}
              border="1px solid"
              bg={`matador_background.100`}
              borderColor={`matador_border_color.100 !important`}
              h="48px"
              w="70%"
              type="number"
              placeholder="0"
            />

            <PaymentAccess
              checkFractions
              content={
                <Button
                  h="48px"
                  bg={'custom_color.color'}
                  isDisabled={error || !Boolean(Number(fractions))}
                  onClick={() => setStep('payment')}
                  p={`13px 20px`}
                  color={`custom_color.contrast`}
                  fontSize={`14px`}
                >
                  Proceed to payment
                </Button>
              }
            />
          </Flex>
          {error ? (
            <Text fontSize={'16px'} fontWeight={400} color="red">
              {error}
            </Text>
          ) : (
            <Flex justify={'space-between'} w="full">
              <Text fontSize={'16px'} fontWeight={400}>
                Total Price
              </Text>
              <Text fontSize={'16px'} fontWeight={400}>
                {formatToCurrency(fractions * unitData?.price_per_fraction)}
              </Text>
            </Flex>
          )}
        </VStack>
      </Stack>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          autoFocus={false}
          blockScrollOnMount
          onCloseComplete={onCloseModal}
          isCentered
          onClose={fractionalModal?.onClose}
          isOpen={fractionalModal?.isOpen}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent
            bg="card_bg"
            color={`text`}
            maxW="full"
            w="full"
            h="full"
            maxH="80vh"
            // px={{base: '18px', md: '35px'}}
            // py={{base: '18px', md: '30px'}}
          >
            <DrawerCloseButton />
            {/* {mobileContent} */}
            <FractionalDetails
              setStep={setStep}
              // setAmountToPay={setAmountToPay}
              fractionalModal={fractionalModal}
              fractionalData={fractionalData}
              onCloseModal={onCloseModal}
              fractions={fractions}
              setFractions={setFractions}
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          autoFocus={false}
          blockScrollOnMount
          onCloseComplete={onCloseModal}
          isCentered
          onClose={fractionalModal?.onClose}
          isOpen={fractionalModal?.isOpen}
        >
          <ModalOverlay />
          <ModalContent
            bg="card_bg"
            color={`text`}
            maxW="640px"
            // mt="10vh"
            py={{base: '18px', md: '20px'}}
            px={{base: '18px', md: '34px'}}
            borderRadius={0}
          >
            <PriceContent
              unitData={unitData}
              fractionalData={fractionalData}
              fractionalModal={fractionalModal}
              fractions={fractions}
              setFractions={setFractions}
              setStep={setStep}
              progress_bar={info?.fractions_progress_bar}
              info={info}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Price;
