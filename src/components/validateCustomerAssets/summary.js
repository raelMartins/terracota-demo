import {formatToCurrency} from '../../utils';
import {Button, CustomizableButton} from '../../ui-lib';
import orangeAlertIcon from '../../images/icons/orange-alert-icon.svg';
import {
  Flex,
  Box,
  Text,
  VStack,
  Divider,
  HStack,
  Image,
  Spinner,
  Center,
  Stack,
} from '@chakra-ui/react';
import {
  fetchAllPurchaseHistory,
  fetchInvestorPackets,
  fetchUpcomingPayments,
} from '../../api/payment';
import {useQuery} from 'react-query';
import {
  changeDateFormat,
  formatPaymentPlanInMonthsString,
  monthDayYear,
} from '../../utils/formatDate';
import ThreeDots from '../loaders/ThreeDots';
import {fetchEquityPaymentBreakdown, getAllUpcomingPayment} from '../../api/listing';

const Summary = ({equityData, setType, customScrollbarStyles}) => {
  const HOME__OWNERS__PACKETS = useQuery(['fetchInvestorPackets', equityData?.id], () =>
    fetchInvestorPackets(equityData?.id)
  );
  const packet =
    HOME__OWNERS__PACKETS?.data?.data?.received?.length &&
    HOME__OWNERS__PACKETS?.data?.data?.received[0];

  const TRANSACTIONS_HISTORY = useQuery(['fetchAllPurchaseHistory', equityData?.id], () =>
    fetchAllPurchaseHistory(equityData?.id)
  );
  const UpcomingPayment = useQuery(['fetchUpcomingPayments', equityData?.id], () =>
    fetchUpcomingPayments(equityData?.id)
  );

  const paymentBreakdownData = useQuery(['paymentBreakdownData', equityData?.id], () =>
    fetchEquityPaymentBreakdown(equityData?.id)
  );

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

  const TRANSACTIONS_HISTORY_DATA = TRANSACTIONS_HISTORY.data?.data
    .filter(el => !el.is_fees)
    ?.toReversed();
  const future_payments = paymentBreakdownData?.data?.data?.data?.filter(el => !el.is_fees);
  const FEES_ARRAY = equityData?.equity_fees || [];

  return (
    equityData && (
      <>
        <Flex
          direction={`column`}
          w="full"
          h={`100%`}
          overflowY={`auto`}
          flex={`1`}
          gap={`10px`}
          px={`4px`}
        >
          <HStack
            align="start"
            spacing="7.42px"
            p="10px"
            w="full"
            borderRadius="2px"
            border="0.5px solid #DD4449"
            bg="rgba(221, 68, 73, 0.1)"
          >
            <Image src={orangeAlertIcon.src} alt="orange alert icon" />
            <Text mt="-2px" fontSize="11.448px" fontWeight="300" color="#DD4449">
              We kindly request your confirmation regarding the property, amount paid,{' '}
              {packet?.packet ? `the ownership of the uploaded documents,` : ``} and transaction
              date. If any information is inaccurate, please initiate a dispute. However, if all
              details are accurate, we kindly ask you to proceed with validation.
            </Text>
          </HStack>
          <Text fontWeight={600} fontSize={'20px'} color={'text'} my="15px">
            {equityData?.unit?.unit_title}
          </Text>

          <Flex
            mt="0px"
            h="130px"
            p={`16px`}
            w="full"
            color="text"
            border="1px solid"
            borderColor={'matador_border_color.100'}
            bg="matador_background.100"
            align={'center'}
            justify={'center'}
            direction="column"
          >
            <Text
              color="matador_form.label"
              fontSize={{base: '13px', md: '18px'}}
              fontWeight={500}
              className="sub-text-regular"
            >
              {equityData?.payment_plan ? 'Offer Price' : 'Purchase price'}
            </Text>
            <Text color="text" fontSize={{base: '24px', md: '34px'}} fontWeight={600}>
              {equityData?.payment_plan
                ? formatToCurrency(equityData?.payment_plan?.purchase_price)
                : formatToCurrency(equityData?.total_unit_price)}
            </Text>
          </Flex>

          {equityData?.payment_plan && (
            <Box w="full" color={`text`}>
              {TRANSACTIONS_HISTORY?.isLoading ? (
                <Center w="full" h="20vh" gap="10px">
                  <Spinner color="custom_color.color" />
                </Center>
              ) : TRANSACTIONS_HISTORY_DATA?.length ? (
                <Box mt="10px">
                  <Text color="text" fontSize={'13px'} fontWeight={500}>
                    Previous payment
                  </Text>
                  <VStack align={'stretch'} mt="10px" gap={'10px'}>
                    {TRANSACTIONS_HISTORY_DATA?.length &&
                      TRANSACTIONS_HISTORY_DATA?.map((item, idx) => (
                        <Flex
                          key={idx}
                          w="full"
                          direction="column"
                          py="23px"
                          bg="background"
                          px="15px"
                          align={'center'}
                          justify={'center'}
                          borderRadius={'2px'}
                          border="1px solid"
                          borderColor={'matador_border_color.100'}
                          position={'relative'}
                        >
                          <Box
                            position={'absolute'}
                            p="2.316px 4.631px"
                            bg="tag_bg"
                            top={0}
                            right={0}
                          >
                            <Text fontSize={'10px'} fontWeight={400} color={'matador_form.label'}>
                              Paid on {item?.created_at ? changeDateFormat(item.created_at) : '-'}
                            </Text>
                          </Box>

                          <Text fontSize={'16px'} fontWeight={500} color="text">
                            {getOrdinal(idx + 1)} payment
                          </Text>
                          <Text color="text" fontSize={'19x'} fontWeight={500}>
                            {item?.amount ? formatToCurrency(item?.amount) : '-'}
                          </Text>
                        </Flex>
                      ))}
                  </VStack>
                </Box>
              ) : null}

              {paymentBreakdownData?.isLoading ? (
                <Center w="full" h="20vh" gap="10px" color="text">
                  <Spinner color="custom_color.color" />
                </Center>
              ) : future_payments?.length ? (
                <Box mt="10px">
                  <Text color="text" fontSize={'14px'} fontWeight={500}>
                    Upcoming payment
                  </Text>
                  <VStack align={'stretch'} mt="10px" gap={'10px'}>
                    {future_payments?.length &&
                      future_payments?.map((item, idx) => (
                        <Flex
                          key={idx}
                          w="full"
                          py="23px"
                          px="15px"
                          bg="background"
                          align={'center'}
                          justify={'center'}
                          direction="column"
                          border="1px solid"
                          borderRadius={'2px'}
                          position={'relative'}
                          borderColor={'matador_border_color.100'}
                        >
                          <Box
                            top={0}
                            right={0}
                            p="2.316px 4.631px"
                            position={'absolute'}
                            bg="tag_bg"
                          >
                            <Text fontSize={'10px'} fontWeight={400} color={'matador_form.label'}>
                              Due date: {item?.due_date ? changeDateFormat(item.due_date) : '-'}
                            </Text>
                          </Box>
                          <Text fontSize={'16px'} fontWeight={500} color="text">
                            {getOrdinal(idx + 1 + (TRANSACTIONS_HISTORY?.data?.data?.length || 0))}{' '}
                            payment
                          </Text>
                          <Text color="text" fontSize={'19x'} fontWeight={500}>
                            {item?.amount ? formatToCurrency(item?.amount) : '-'}
                          </Text>
                        </Flex>
                      ))}
                  </VStack>
                </Box>
              ) : null}
              {FEES_ARRAY?.length &&
              !paymentBreakdownData?.isLoading &&
              !TRANSACTIONS_HISTORY?.isLoading ? (
                <Box mt="10px">
                  <Text color="text" fontSize={'14px'} fontWeight={500}>
                    Closing Costs
                  </Text>
                  <VStack align={'stretch'} mt="10px" gap={'10px'}>
                    {FEES_ARRAY?.map((item, idx) => (
                      <Flex
                        key={idx}
                        w="full"
                        direction="column"
                        py="23px"
                        bg="background"
                        px="15px"
                        align={'center'}
                        justify={'center'}
                        borderRadius={'2px'}
                        border="1px solid"
                        borderColor={'matador_border_color.100'}
                        position={'relative'}
                      >
                        <Text fontSize={'16px'} fontWeight={500} color="text">
                          {item?.name}
                        </Text>
                        <Text color="text" fontSize={'19x'} fontWeight={500}>
                          {item?.amount ? formatToCurrency(item?.amount) : '-'}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              ) : null}
            </Box>
          )}

          <VStack
            pb="0px" //was previously 80px will confirm the reason for that later
            mt="20px"
            spacing={'24px'}
            fontWeight={500}
            align={'stretch'}
            className="sub-text-regular"
          >
            <Flex justify={'space-between'} align={'center'}>
              <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                Payment Type
              </Text>
              <Text fontSize={'16px'} fontWeight={500} color="text">
                {equityData?.payment_plan
                  ? formatPaymentPlanInMonthsString(
                      equityData?.payment_plan?.payment_period_in_months
                    )
                  : 'Outright'}
              </Text>
            </Flex>

            {!equityData?.payment_plan && (
              <Flex justify={'space-between'} align={'center'}>
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  Offer Price
                </Text>
                <Text fontSize={'16px'} fontWeight={500} color="text">
                  {formatToCurrency(equityData?.offer_price)}
                </Text>
              </Flex>
            )}
            {!equityData?.payment_plan && equityData?.purchase_date ? (
              <Flex justify={'space-between'} align={'center'}>
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  Purchase Date
                </Text>
                <Text fontSize={'16px'} fontWeight={500} color="text">
                  {monthDayYear(equityData?.purchase_date)}
                </Text>
              </Flex>
            ) : null}

            {!packet?.packet && !HOME__OWNERS__PACKETS?.isLoading ? null : (
              <Flex justify={'space-between'} align={'center'}>
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  Terms of Agreement
                </Text>
                {HOME__OWNERS__PACKETS?.isLoading ? (
                  <ThreeDots />
                ) : (
                  <a rel="noreferrer" target="_blank" href={packet?.packet}>
                    <Button
                      border="1px solid !important"
                      h="22px"
                      w="50px"
                      bg="matador_background.100"
                      borderColor={'matador_border_color.100'}
                      hoverEffect={false}
                    >
                      <Text color={'text'} fontWeight={300} fontSize={'12px'}>
                        View
                      </Text>
                    </Button>
                  </a>
                )}
              </Flex>
            )}
          </VStack>
        </Flex>
        <Flex py="20px" w="full" gap="8px" mx={'auto'} align="center">
          <Button
            h="48px"
            w="50%"
            color="#DD4449"
            fontSize="16px"
            fontWeight="500"
            bg="transparent"
            onClick={() => setType('dispute')}
            border="1px solid #DD4449 !important"
          >
            Dispute
          </Button>
          <Button
            h="48px"
            w="50%"
            fontSize="16px"
            fontWeight="500"
            bg="custom_color.color"
            color="custom_color.contrast"
            onClick={() => setType('validate')}
          >
            Validate
          </Button>
        </Flex>
      </>
    )
  );
};

export default Summary;
