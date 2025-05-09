import React from 'react';
import {Flex, Box, Text, VStack} from '@chakra-ui/react';
import {Button, CustomizableButton} from '../../ui-lib';
import {formatToCurrency} from '../../utils';
import {useQuery} from 'react-query';
import {fetchInvestorPackets} from '../../api/payment';
import ThreeDots from '../loaders/ThreeDots';
import {formatDateToString, formatPaymentPlanInMonthsString} from '../../utils/formatDate';
import {PaymentAccess} from '../payment/PaymentAccess';

const SummaryDrawer = ({asset, setType, customScrollbarStyles}) => {
  const HOME__OWNERS__PACKETS = useQuery(['fetchInvestorPackets', asset?.id], () =>
    fetchInvestorPackets(asset?.id)
  );
  const packet =
    HOME__OWNERS__PACKETS?.data?.data?.received?.length &&
    HOME__OWNERS__PACKETS?.data?.data?.received[0];

  const handleProceed = () => {
    setType('payment');
  };

  return (
    <>
      {/* <Box h={'fit-content'} overflowY="auto" __css={customScrollbarStyles}> */}
      <Box h={'fit-content'} overflowY="auto" px={`4px`}>
        <Text fontWeight={600} fontSize={'20px'} color={'text'} mb="15px">
          {asset?.unit?.unit_title}
        </Text>

        <Flex
          mt="20px"
          h="130px"
          w="full"
          color="text"
          border="1px solid"
          bg="matador_background.100"
          borderColor={'matador_border_color.100'}
          align={'center'}
          justify={'center'}
          direction="column"
        >
          <Text fontSize={{base: '14px', md: '18px'}} fontWeight={400} className="sub-text-regular">
            {asset?.payment_plan ? 'Initial Deposit' : 'Offer Price'}
          </Text>
          <Text color="matador_text.500" fontSize={{base: '28px', md: '34px'}} fontWeight={600}>
            {asset?.payment_plan
              ? formatToCurrency(asset?.payment_plan?.initial_deposit_in_value)
              : formatToCurrency(asset?.offer_price)}
          </Text>
        </Flex>

        <VStack
          align={'stretch'}
          mt="20px"
          spacing={'24px'}
          fontWeight={500}
          className="sub-text-regular"
        >
          <Flex justify={'space-between'} align={'center'}>
            <Text color="matador_form.label" fontSize={'12px'}>
              Payment Type
            </Text>
            <Text color="text" fontSize={'13px'}>
              {asset?.payment_plan?.plan_type === 'custom'
                ? formatPaymentPlanInMonthsString(asset?.payment_plan?.payment_period_in_months)
                : asset?.payment_plan
                ? formatPaymentPlanInMonthsString(asset?.payment_plan?.payment_period_in_months)
                : 'Outright'}
            </Text>
          </Flex>
          {asset?.payment_plan?.plan_type === 'custom' && (
            <Flex justify={'space-between'} align={'center'}>
              <Text color="matador_form.label" fontSize={'12px'}>
                Payment Breakdown
              </Text>
              <Button
                border="1px solid !important"
                h="22px"
                w="50px"
                bg="matador_background.100"
                borderColor="matador_border_color.100"
                onClick={() => setType('breakdown')}
                hoverEffect={false}
              >
                <Text color={'text'} fontWeight={300} fontSize={'12px'}>
                  View
                </Text>
              </Button>
            </Flex>
          )}
          {/* {asset?.payment_plan ? (
            <>
              {asset?.payment_plan?.bundle?.fees?.map((fee, idx) => (
                <Flex
                  key={idx}
                  justify={'space-between'}
                  align={'center'}
                  display={fee?.private ? `none` : `flex`}
                >
                  <Text color="matador_form.label" fontSize={'12px'}>
                    {fee.name}
                  </Text>
                  <Text color="text" fontSize={'13px'}>
                    {formatToCurrency(fee.amount)}
                  </Text>
                </Flex>
              ))}
            </>
          ) : (
            <> */}
          {asset?.equity_fees?.map((fee, idx) => (
            <Flex
              key={idx}
              justify={'space-between'}
              align={'center'}
              display={fee?.private ? `none` : `flex`}
            >
              <Text color="matador_form.label" fontSize={'12px'}>
                {fee.name}
              </Text>
              <Text color="text" fontSize={'13px'}>
                {formatToCurrency(fee.amount)}
              </Text>
            </Flex>
          ))}
          {/* </>
          )} */}

          <Flex justify={'space-between'} align={'center'}>
            <Text color="matador_form.label" fontSize={'12px'}>
              Offer Date
            </Text>
            <Text color="text" fontSize={'13px'}>
              {formatDateToString(asset?.created_at)}
            </Text>
          </Flex>
          <Flex justify={'space-between'} align={'center'}>
            <Text color="matador_form.label" fontSize={'12px'}>
              Offer Expiration Date
            </Text>
            <Text color="text" fontSize={'13px'}>
              {formatDateToString(asset?.offer_expires)}
            </Text>
          </Flex>
          {asset?.payment_plan && asset?.payment_plan?.purchase_price * 1 && (
            <Flex justify={'space-between'} align={'center'}>
              <Text color="matador_form.label" fontSize={'12px'}>
                Initial deposit percentage
              </Text>
              <Text color="text" fontSize={'13px'}>
                {Math.round(
                  ((asset?.payment_plan?.initial_deposit_in_value * 1) /
                    asset?.payment_plan?.purchase_price) *
                    1 *
                    100
                )}
                %
              </Text>
            </Flex>
          )}
          {!packet?.packet && !HOME__OWNERS__PACKETS?.isLoading ? null : (
            <Flex justify={'space-between'} align={'center'}>
              <Text color="matador_form.label" fontSize={'13px'}>
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
                    borderColor="matador_border_color.100"
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
      </Box>
      <Flex
        // position={'fixed'}
        // bottom={0}
        // right={0}
        py="20px"
        gap="8px"
        align="stretch"
        mx={'auto'}
        w="full"
        bg="matador_background.200"
        // direction={'column'}
      >
        {/* {asset?.payment_plan?.plan_type === 'custom' && (
          <Button
            minH="48px"
            fontSize="14px"
            fontWeight="500"
            w="full"
            border="1px solid !important"
            borderColor="custom_color.color !important"
            color="custom_color.color"
            bg="custom_color.background"
            onClick={() => setType('breakdown')}
          >
            View Payment Breakdown
          </Button>
        )} */}

        <PaymentAccess
          content={
            <Button
              minH="48px"
              fontSize="14px"
              fontWeight="500"
              w="full"
              color="custom_color.contrast"
              bg="custom_color.color"
              onClick={handleProceed}
            >
              Proceed to Payment
            </Button>
          }
        />
      </Flex>
    </>
  );
};

export default SummaryDrawer;
