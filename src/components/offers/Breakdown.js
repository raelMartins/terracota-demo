import React from 'react';
import {Box, VStack, Flex, Text, Center} from '@chakra-ui/react';
import {fetchCustomPlanSummary, fetchUpcomingPayments} from '../../api/payment';
import {useQuery} from 'react-query';
import {formatToCurrency} from '../../utils';
import {Spinner} from '../../ui-lib';

const Breakdown = ({asset, customScrollbarStyles}) => {
  const customPlanBreakDown = useQuery(
    ['customPLansummary', asset?.payment_plan?.id],
    () => fetchCustomPlanSummary(asset?.payment_plan?.id),
    {
      enabled: !!asset?.payment_plan,
    }
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

  const FEES = asset?.equity_fees;

  return (
    <Box h={'fit-content'} overflowY="auto">
      {/* <Box h={'fit-content'} overflowY="auto" __css={customScrollbarStyles}> */}
      <Box w="full">
        <VStack w="full" spacing={'20px'}>
          <Flex
            w="full"
            direction="column"
            mt="20px"
            py="23px"
            bg="background"
            px="15px"
            align={'center'}
            justify={'center'}
            borderRadius={'5px'}
            border="1px solid"
            borderColor={'matador_border_color.100'}
          >
            <Text color="text" fontSize={'13px'} fontWeight={500}>
              Initial Deposit
            </Text>
            <Text color="text" fontSize={'19px'} fontWeight={500}>
              {formatToCurrency(asset?.payment_plan?.initial_deposit_in_value)}
            </Text>
          </Flex>
          {customPlanBreakDown?.isLoading ? (
            <Center w="full" h="full">
              <Spinner noAbsolute />
            </Center>
          ) : (
            <>
              {customPlanBreakDown.data?.data?.data?.map((item, idx) => (
                <Flex
                  key={idx}
                  w="full"
                  direction="column"
                  mt="20px"
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
                  <Box position={'absolute'} p="2.316px 4.631px" bg="tag_bg" top={0} right={0}>
                    <Text fontSize={'10px'} fontWeight={400} color={'matador_form.label'}>
                      {`Due After ${item?.period_in_months} month${
                        Number(item?.period_in_months) === 1 ? '' : 's'
                      }`}
                    </Text>
                  </Box>

                  <Text color="text" fontSize={'13px'} fontWeight={500}>
                    {getOrdinal(idx + 1)} payment
                  </Text>
                  <Text color="text" fontSize={'19x'} fontWeight={500}>
                    {item?.amount ? formatToCurrency(item?.amount) : '-'}
                  </Text>
                </Flex>
              ))}
              {FEES?.map((fee, idx) => (
                <Flex
                  key={idx}
                  w="full"
                  direction="column"
                  mt="20px"
                  py="23px"
                  bg="background"
                  px="15px"
                  align={'center'}
                  justify={'center'}
                  borderRadius={'2px'}
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
    </Box>
  );
};

export default Breakdown;
