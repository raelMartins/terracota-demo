import React, {useEffect, useState} from 'react';
import {
  ModalContent,
  Flex,
  Box,
  Text,
  VStack,
  Divider,
  Modal,
  ModalOverlay,
  Input,
  useToast,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Icon,
} from '@chakra-ui/react';
import {Button, CustomizableButton} from '../../../../ui-lib';
import {ArrowBackIcon, CheckIcon, CloseIcon, EditIcon} from '@chakra-ui/icons';
import {formatToCurrency} from '../../../../utils';
import isMobile from '../../../../utils/extras';
import {BiCaretRight} from 'react-icons/bi';
import useLocalStorage from '../../../../utils/hooks/useLocalStorage';
import {PaymentAccess} from '@/components/payment/PaymentAccess';

const customScrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '4px',
    borderRadius: '16px',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: '16px',
    WebkitBoxShadow: 'inset 0 0 6px rgba(255, 255, 255, 0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    // outline: "1px solid slategrey", // You can include this line if needed
  },
};
const Summary = ({
  onCloseModal,
  setSelectedPlan,
  PAYMENT_PLAN_DATA,
  setStep,
  selectedPlan,
  buyModal,
  setAmountToPay,
  unitData,
}) => {
  const toast = useToast();
  const {
    initial_deposit_in_value,
    purchase_price,
    payment_period_in_months,
    periodic_payment,
    payment_frequency,
    plan_type,
  } = selectedPlan || {};
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(initial_deposit_in_value || unitData?.price || '');
  // const [amount, setAmount] = useState(
  //   initial_deposit_in_value ||
  //     unitData?.fees?.reduce((acc, obj) => acc + Number(obj?.amount), Number(unitData?.price)) ||
  //     ''
  // );

  const isCoownerShipEnabled =
    useLocalStorage('storeThemeInfo')?.[0]?.isCoownershipEnabled ?? false;
  const FEES = selectedPlan ? selectedPlan?.bundle?.fees : unitData?.fees;

  const handleProceed = () => {
    if (editing) return handleEditing();
    const accumulatedFeeAndAmount = FEES?.reduce(
      (acc, obj) => acc + Number(obj?.amount),
      Number(amount)
    );
    setAmountToPay(selectedPlan ? initial_deposit_in_value : accumulatedFeeAndAmount);
    setSelectedPlan({
      ...selectedPlan,
      initial_deposit_in_value: amount,
    });
    setStep('payment');
  };

  const handleEditing = () => {
    if (Number(amount) >= Number(initial_deposit_in_value)) return setEditing(!editing);
    else
      return toast({
        description: `Sorry, you can't set an amount lower than the initial deposit amount (${formatToCurrency(
          initial_deposit_in_value
        )})`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
  };

  const mainContent = (
    <Box w="full">
      <Flex justify={'space-between'} align={'center'}>
        <HStack spacing="12px" 
        // onClick={() => setStep('terms')} 
        cursor="pointer">
          {/* <ArrowBackIcon fontSize={'25px'} cursor="pointer" color="text" /> */}
          <Text
            className="heading-text-regular"
            fontSize={{base: '23px', md: '28px'}}
            fontWeight={400}
          >
            {payment_period_in_months
              ? `${payment_period_in_months} Month${payment_period_in_months == 1 ? `` : `s`}`
              : 'Payment Summary'}
          </Text>
        </HStack>
        <CloseIcon fontSize={'15px'} cursor="pointer" color="text" onClick={buyModal?.onClose} />
      </Flex>

      <Flex
        direction="column"
        mt="20px"
        py="23px"
        justify={'center'}
        px="15px"
        align={'center'}
        color="text"
        border="1px solid"
        borderColor={'matador_border_color.100 !important'}
        bg="matador_background.100"
      >
        {selectedPlan ? (
          <Flex gap="40px" align={'center'}>
            {/* <div /> */}
            <Text color="matador_text.500" fontSize={{base: '13px', md: '16px'}} fontWeight={500}>
              Initial Deposit
            </Text>
            {/* <Box cursor={'pointer'} onClick={handleEditing}>
              {editing ? <CheckIcon color="text" fontSize={'22px'} /> : <EditIcon color="text" />}
            </Box> */}
          </Flex>
        ) : (
          <Text color="matador_text.500" fontSize={{base: '13px', md: '16px'}} fontWeight={500}>
            You will Pay
          </Text>
        )}
        {editing ? (
          <Input
            color="text"
            autoFocus
            w="50%"
            mx="auto"
            textAlign="center"
            border={editing ? '1px solid !important' : 'none'}
            borderColor="matador_border_color.100 !important"
            outline={'none'}
            value={amount}
            type="number"
            min={initial_deposit_in_value || 0}
            onChange={e => setAmount(e.target.value)}
            fontSize={'20px'}
            fontWeight={600}
          />
        ) : (
          <Text
            color="matador_text.300"
            // className="heading-text-regular"
            fontWeight={{base: '500', md: '400'}}
            fontSize={{base: '19px', md: '33px'}}
          >
            {/* {formatToCurrency(amount)} */}
            {formatToCurrency(
              selectedPlan
                ? initial_deposit_in_value
                : unitData?.fees?.reduce(
                    (acc, obj) => acc + Number(obj?.amount),
                    Number(unitData?.price)
                  )
            )}
          </Text>
        )}
      </Flex>

      {plan_type === 'manual' && payment_frequency !== 'flexible' && (
        <Flex
          bg="matador_background.200"
          direction="column"
          mt="8px"
          py="23px"
          justify={'center'}
          px="15px"
          align={'center'}
          border="1px solid"
          borderColor="matador_border_color.100"
        >
          <Text color="matador_text.500" fontSize={{base: '13px', md: '16px'}} fontWeight={500}>
            {payment_frequency
              ? payment_frequency?.charAt(0).toUpperCase() +
                payment_frequency?.slice(1) +
                ' Payment'
              : 'Periodic Payment'}
          </Text>
          <Text
            color="matador_text.300"
            // className="heading-text-regular"
            fontWeight={{base: '500', md: '400'}}
            fontSize={{base: '19px', md: '33px'}}
          >
            {payment_frequency !== 'flexible' ? formatToCurrency(periodic_payment) : '-'}
          </Text>
        </Flex>
      )}

      {plan_type === 'custom' && (
        <Flex
          mt="8px"
          py="12px"
          px="16px"
          align={'center'}
          justify={'space-between'}
          borderRadius={'2px'}
          cursor={'pointer'}
          border="1px solid"
          borderColor="matador_border_color.100 !important"
          onClick={() => setStep('breakdown')}
        >
          <Text color="matador_text.500" fontSize={'14px'} fontWeight={400}>
            Payment Breakdown
          </Text>
          <HStack align={'center'} justify={'center'} spacing={0}>
            <Text color="matador_text.500" fontSize={'14px'} fontWeight={500}>
              View
            </Text>
            <Icon as={BiCaretRight} color="text" fontSize={'25px'} />
          </HStack>
        </Flex>
      )}

      <VStack
        align={'stretch'}
        mt="8px"
        gap={'20px'}
        __css={customScrollbarStyles}
        h="fit-content"
        maxH={'25vh'}
        overflowY="auto"
        border="1px solid"
        borderColor="matador_border_color.100 !important"
        p="16px"
      >
        <Flex justify={'space-between'} align={'center'}>
          <Text color="matador_form.label" fontSize={'13px'} fontWeight={500}>
            Purchase Price
          </Text>
          <Text color="text" fontSize={'16px'} fontWeight={500}>
            {selectedPlan
              ? formatToCurrency(selectedPlan?.purchase_price)
              : formatToCurrency(unitData?.price)}
          </Text>
        </Flex>
        {selectedPlan && (
          <Flex justify={'space-between'} align={'center'}>
            <Text color="matador_form.label" fontSize={'13px'} fontWeight={500}>
              Initial deposit percentage
            </Text>
            <Text color="text" fontSize={'16px'} fontWeight={500}>
              {Math.round((amount / purchase_price) * 100)}%
            </Text>
          </Flex>
        )}

        {FEES?.map((fee, i) => (
          <Flex key={i} justify={'space-between'} align={'center'}>
            <Text color="matador_form.label" fontSize={'13px'} fontWeight={500}>
              {fee?.name}
            </Text>
            <Text color="text" fontSize={'16px'} fontWeight={500}>
              {formatToCurrency(fee?.amount)}
            </Text>
          </Flex>
        ))}
      </VStack>

      <PaymentAccess
        content={
          <Button
            w="full"
            mt="30px"
            h="48px"
            bg="custom_color.color"
            color="custom_color.contrast"
            onClick={handleProceed}
          >
            Proceed to Payment
          </Button>
        }
      />

      {isCoownerShipEnabled ? (
        <CustomizableButton
          mt="12px"
          bg="custom_color.background"
          color="custom_color.color"
          border="1px solid !important"
          borderColor="custom_color.color"
          width={'full'}
          h="48px"
          onClick={() => setStep('inviteForm')}
        >
          Invite co-owner
        </CustomizableButton>
      ) : null}
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          autoFocus={false}
          onCloseComplete={onCloseModal}
          isCentered
          onClose={buyModal?.onClose}
          isOpen={buyModal?.isOpen}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent
            bg="card_bg"
            color={`text`}
            maxW="430px"
            px={{base: '15px', md: '32px'}}
            h="fit-content"
            py={{base: '28px', md: '38px'}}
            // borderTopRadius={{base: '10px', md: '16px'}}
          >
            {mainContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          autoFocus={false}
          onCloseComplete={onCloseModal}
          isCentered
          onClose={buyModal?.onClose}
          isOpen={buyModal?.isOpen}
        >
          <ModalOverlay />
          <ModalContent
            bg="card_bg"
            color={`text`}
            maxW="430px"
            px={{base: '15px', md: '32px'}}
            minH="318px"
            py={{base: '28px', md: '38px'}}
            borderRadius={0}
          >
            {mainContent}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Summary;
