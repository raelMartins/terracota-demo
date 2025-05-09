import React from 'react';
import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import {BsArrowLeft} from 'react-icons/bs';

import {fetchAllPurchaseHistory, fetchCustomPlanSummary} from '../../../../api/payment';
import {useQuery} from 'react-query';
import {toastForError} from '../../../../utils/toastForErrors';
import {formatToCurrency} from '../../../../utils';
import {changeDateFormat, formatPaymentPlanInMonthsString} from '../../../../utils/formatDate';
import {fetchEquityPaymentBreakdown, getAllUpcomingPayment} from '../../../../api/listing';

const CustomPaymentBreakdownForAssets = ({equityInfo, modalDisclosure}) => {
  const plan_type = equityInfo?.payment_plan?.plan_type;
  const periodic_payment = equityInfo?.payment_plan?.periodic_payment;
  const payment_frequency = equityInfo?.payment_plan?.payment_frequency;
  const payment_period_in_months = equityInfo?.payment_plan?.payment_period_in_months;
  const FEES = equityInfo?.payment_plan?.bundle?.fees;

  const customPlanBreakDown = useQuery(
    ['customPLansummary', equityInfo?.payment_plan?.id],
    () => fetchCustomPlanSummary(equityInfo?.id),
    {isenabled: !!equityInfo?.payment_plan?.id && plan_type === 'custom', retry: 0}
  );

  const TRANSACTIONS_HISTORY = useQuery(['purchase_history', equityInfo?.id], () =>
    fetchAllPurchaseHistory(equityInfo?.id)
  );

  const upcomingPayments = useQuery(
    ['upcoming_payments', equityInfo?.id],
    () => fetchEquityPaymentBreakdown(equityInfo?.id),
    {isenabled: !!equityInfo?.id && plan_type === 'custom', retry: 0}
  );

  const upcomingPaymentsNew = useQuery(
    ['upcoming_payments_new', equityInfo?.id],
    () => getAllUpcomingPayment(equityInfo?.id),
    {isenabled: !!equityInfo?.id && plan_type === 'custom', retry: 0}
  );

  const [isMobile] = useMediaQuery('(max-width: 540px)');

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

  const toast = useToast();

  // toastForError(customPlanBreakDown.error, customPlanBreakDown.isError, toast);
  toastForError(upcomingPaymentsNew.error, upcomingPaymentsNew.isError, toast);

  function getOrdinal(number) {
    if (typeof number !== 'number') {
      return ''; // Return an empty string for invalid inputs
    }

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    // Special cases for 11, 12, and 13, as they don't follow the usual pattern
    if (lastTwoDigits === 11 || lastTwoDigits === 12 || lastTwoDigits === 13) {
      return number + 'th';
    }

    // Use the appropriate suffix based on the last digit
    const suffix = suffixes[lastDigit] || 'th';

    return number + suffix;
  }

  const FEES_ARRAY = equityInfo?.equity_fees || FEES || [];
  // const FEES_ARRAY = FEES;

  const HISTORY = TRANSACTIONS_HISTORY.data?.data.filter(el => !el.is_fees)?.toReversed();
  // const UPCOMING = upcomingPayments.data?.data?.data.filter(el => !el.is_fees);
  const UPCOMING = upcomingPaymentsNew.data?.data?.results?.filter(el => !el.is_fees);

  return (
    <Drawer
      placement={isMobile ? 'bottom' : 'right'}
      onClose={modalDisclosure.onClose}
      isOpen={modalDisclosure.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: '0px !important', md: '10vh !important'}}
        right={{base: 'unset', md: '24px !important'}}
        w="full"
        minH="50vh"
        maxH={'75vh'}
        p="36px"
        pt="0px"
        maxW={'400px'}
        bg="matador_background.200"
        px="0"
      >
        <HStack
          borderBottom="1px solid"
          borderColor={`matador_border_color.100`}
          p="24px"
          justify="space-between"
          align="center"
          position="relative"
        >
          <Text color="text" fontSize={'21.34px'} fontWeight={400} className="heading-text-regular">
            {formatPaymentPlanInMonthsString(payment_period_in_months)}
            {/* {payment_period_in_months} Month Plan */}
          </Text>

          <DrawerCloseButton
            right="0px"
            left="0px"
            color="text"
            position="initial"
            my="auto"
            top="0"
            bottom="0"
          />
        </HStack>
        <DrawerBody sx={customScrollbarStyles} p="0">
          <Box px="24px" h={'fit-content'}>
            <VStack w="full" spacing={'20px'} mt="19px">
              {/* <Flex
                w="full"
                direction="column"
                py="23px"
                minH="100px"
                bg="matador_background.100"
                px="15px"
                align={'center'}
                justify={'center'}
                border="1px solid"
                borderColor={'matador_border_color.100'}
              >
                <Text color="text" fontSize={'13px'} fontWeight={500}>
                  Initial Deposit
                </Text>
                <Text color="text" fontSize={'19px'} fontWeight={500}>
                  {formatToCurrency(equityInfo?.payment_plan?.initial_deposit_in_value)}
                </Text>
              </Flex> */}
              {TRANSACTIONS_HISTORY?.isLoading ? (
                <Center w="full" h="full">
                  <Spinner noAbsolute />
                </Center>
              ) : (
                HISTORY?.map((item, idx) => (
                  <Flex
                    key={idx}
                    w="full"
                    direction="column"
                    minH="100px"
                    py="23px"
                    bg="matador_background.100"
                    position="relative"
                    px="15px"
                    align={'center'}
                    justify={'center'}
                    border="1px solid"
                    borderColor={'matador_border_color.100'}
                  >
                    <Text color="text" fontSize={'13px'} fontWeight={500}>
                      {item?.transaction_action_type?.toLowerCase()?.includes(`initial`)
                        ? `Initial Deposit`
                        : `${getOrdinal(idx + 1)} payment`}
                    </Text>
                    <Text color="text" fontSize={'19px'} fontWeight={500}>
                      {item?.amount ? formatToCurrency(item?.amount) : '-'}
                    </Text>

                    <VStack
                      bg="tag_bg"
                      justify="center"
                      position="absolute"
                      top="0px"
                      right="0px"
                      h="16.4px"
                      align="center"
                      p="2.316px 4.631px"
                    >
                      <Text fontSize="9px" color="matador_form.label" fontWeight="400">
                        Paid on: {item?.created_at ? changeDateFormat(item.created_at) : '-'}
                      </Text>
                    </VStack>
                  </Flex>
                ))
              )}

              {upcomingPaymentsNew?.isLoading ? (
                <Center w="full" h="full">
                  <Spinner noAbsolute />
                </Center>
              ) : (
                <>
                  {plan_type === 'custom' ? (
                    UPCOMING?.map((item, idx) => (
                      <Flex
                        key={idx}
                        w="full"
                        direction="column"
                        minH="100px"
                        py="23px"
                        bg="matador_background.100"
                        position="relative"
                        px="15px"
                        align={'center'}
                        justify={'center'}
                        border="1px solid"
                        borderColor={'matador_border_color.100'}
                      >
                        <Text color="text" fontSize={'13px'} fontWeight={500}>
                          {/* {getOrdinal(idx + 1)} payment */}
                          {getOrdinal((HISTORY?.length || 0) + idx + 1)} payment
                        </Text>
                        <Text color="text" fontSize={'19px'} fontWeight={500}>
                          {item?.amount ? formatToCurrency(item?.amount) : '-'}
                        </Text>

                        <VStack
                          bg="tag_bg"
                          justify="center"
                          position="absolute"
                          top="0px"
                          right="0px"
                          h="16.4px"
                          align="center"
                          p="2.316px 4.631px"
                        >
                          <Text fontSize="9px" color="matador_form.label" fontWeight="400">
                            Due date: {item?.due_date ? changeDateFormat(item.due_date) : '-'}
                          </Text>
                        </VStack>
                      </Flex>
                    ))
                  ) : plan_type === 'manual' && payment_frequency !== 'flexible' ? (
                    <Flex
                      w="full"
                      direction="column"
                      minH="100px"
                      py="19px"
                      bg="matador_background.100"
                      position="relative"
                      px="15px"
                      align={'center'}
                      justify={'center'}
                      border="1px solid"
                      borderColor={'matador_border_color.100'}
                    >
                      <Text color="text" fontSize={'13px'} fontWeight={500}>
                        {payment_frequency
                          ? payment_frequency?.charAt(0).toUpperCase() +
                            payment_frequency?.slice(1) +
                            ' Payment'
                          : 'Periodic Payment'}
                      </Text>
                      <Text color="text" fontSize={'19px'} fontWeight={500}>
                        {payment_frequency !== 'flexible'
                          ? formatToCurrency(periodic_payment)
                          : '-'}
                      </Text>
                    </Flex>
                  ) : null}
                  <Flex
                    w="full"
                    direction="column"
                    minH="100px"
                    py="19px"
                    bg="matador_background.100"
                    position="relative"
                    px="15px"
                    align={'center'}
                    justify={'center'}
                    border="1px solid"
                    borderColor={'matador_border_color.100'}
                  >
                    <Text color="text" fontSize={'13px'} fontWeight={500}>
                      Total
                    </Text>
                    <Text color="text" fontSize={'19px'} fontWeight={500}>
                      {formatToCurrency(equityInfo?.total_unit_price)}
                    </Text>
                  </Flex>

                  {FEES_ARRAY?.map((fee, idx) => (
                    <Flex
                      key={idx}
                      w="full"
                      direction="column"
                      minH="100px"
                      py="19px"
                      bg="matador_background.100"
                      position="relative"
                      px="15px"
                      align={'center'}
                      justify={'center'}
                      border="1px solid"
                      borderColor={'matador_border_color.100'}
                    >
                      <Text color="text" fontSize={'13px'} fontWeight={500}>
                        {fee.name}
                      </Text>
                      <Text color="text" fontSize={'19px'} fontWeight={500}>
                        {formatToCurrency(fee.amount)}
                      </Text>
                    </Flex>
                  ))}
                </>
              )}
            </VStack>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomPaymentBreakdownForAssets;
