import {useState} from 'react';
import {Flex, Text, HStack, Icon, Stack, StackDivider} from '@chakra-ui/react';
import {Button} from '@/ui-lib';
import {ArrowBackIcon, CloseIcon} from '@chakra-ui/icons';
import {formatToCurrency} from '@/utils';

import {IoChevronForward} from 'react-icons/io5';
import {formatPaymentPlanInMonthsString} from '@/utils/formatDate';

export const SelectionFlowSummary = ({
  setSelectedPlan,
  setTab,
  selectedPlan,
  setAmountToPay,
  unit,
  backScreen,
  disclosure,
}) => {
  const {
    initial_deposit_in_value,
    purchase_price,
    payment_period_in_months,
    periodic_payment,
    payment_frequency,
    plan_type,
  } = selectedPlan || {};
  const [amount, setAmount] = useState(initial_deposit_in_value || unit?.price || '');

  const FEES = selectedPlan ? selectedPlan?.bundle?.fees : unit?.fees;

  const handleProceed = () => {
    const accumulatedFeeAndAmount = FEES?.reduce(
      (acc, obj) => acc + Number(obj?.amount),
      Number(amount)
    );
    setAmountToPay(accumulatedFeeAndAmount);
    setSelectedPlan({
      ...selectedPlan,
      initial_deposit_in_value: amount,
    });
    setTab('terms');
  };
  return (
    <Stack w="full" gap={{base: `16px`}} p={`16px`}>
      <Flex direction="row" justify="space-between" align={'center'} px={`8px`}>
        <HStack>
          {backScreen && (
            <ArrowBackIcon
              color="text"
              fontSize={'25px'}
              onClick={() => setTab(backScreen)}
              style={{cursor: 'pointer'}}
            />
          )}
          <Text
            fontSize={{base: '23px', md: '25px'}}
            fontWeight={400}
            color="text"
            className="heading-text-regular"
          >
            {payment_period_in_months
              ? formatPaymentPlanInMonthsString(payment_period_in_months)
              : 'Payment Summary'}
          </Text>
        </HStack>
        <CloseIcon
          fontWeight={600}
          alignSelf={'flex-start'}
          fontSize={'13px'}
          style={{color: '#667085', cursor: 'pointer'}}
          onClick={disclosure?.onClose}
        />
      </Flex>
      <Stack gap={`8px`} maxH={'500px'} overflowY="auto">
        <Flex
          direction="column"
          justify={'center'}
          p={`18px`}
          align={'center'}
          color="text"
          border="1px solid"
          borderColor={'matador_border_color.100 !important'}
          bg="matador_background.100"
          borderRadius={`5px`}
          gap={`4px`}
        >
          <Text
            fontSize={'13px'}
            fontWeight={`400`}
            lineHeight={`135%`}
            letterSpacing={`4%`}
            color={`matador_form.label`}
          >
            {selectedPlan ? `Initial Deposit` : `You will Pay`}
          </Text>

          <Text
            fontWeight={{base: '500'}}
            fontSize={{base: '19px'}}
            lineHeight={{base: `140%`}}
            letterSpacing={`0%`}
          >
            {formatToCurrency(amount)}
          </Text>
        </Flex>
        {plan_type === 'manual' && payment_frequency !== 'flexible' && (
          <Flex
            direction="column"
            justify={'center'}
            p={`18px`}
            align={'center'}
            color="text"
            border="1px solid"
            borderColor={'matador_border_color.100 !important'}
            bg="matador_background.100"
            borderRadius={`5px`}
            gap={`4px`}
          >
            <Text
              fontSize={'13px'}
              fontWeight={`400`}
              lineHeight={`135%`}
              letterSpacing={`4%`}
              color={`matador_form.label`}
            >
              {payment_frequency
                ? payment_frequency?.charAt(0).toUpperCase() +
                  payment_frequency?.slice(1) +
                  ' Payment'
                : 'Periodic Payment'}{' '}
            </Text>

            <Text
              fontWeight={{base: '500'}}
              fontSize={{base: '19px'}}
              lineHeight={{base: `140%`}}
              letterSpacing={`0%`}
            >
              {payment_frequency !== 'flexible' ? formatToCurrency(periodic_payment) : '-'}
            </Text>
          </Flex>
        )}
        <Stack
          gap={`0px`}
          fontSize={`13px`}
          fontWeight={`400`}
          lineHeight={`140%`}
          letterSpacing={`5%`}
          bg={`matador_background.100`}
        >
          <Flex justify={'space-between'} align={'center'} p={`16px`}>
            <Text color={`matador_form.label`}>Purchase Price</Text>
            <Text fontWeight={`500`} fontSize={`16px`} letterSpacing={`1%`} textAlign={`right`}>
              {selectedPlan
                ? formatToCurrency(selectedPlan?.purchase_price)
                : formatToCurrency(unit?.price)}
            </Text>
          </Flex>
          {selectedPlan && (
            <Flex justify={'space-between'} align={'center'} p={`16px`}>
              <Text color={`matador_form.label`}>Initial deposit percentage</Text>
              <Text fontWeight={`500`} fontSize={`16px`} letterSpacing={`1%`} textAlign={`right`}>
                {Math.round((amount / purchase_price) * 100)}%
              </Text>
            </Flex>
          )}
          {plan_type === 'custom' && (
            <Flex
              justify={'space-between'}
              align={'center'}
              onClick={() => setTab('breakdown')}
              cursor={`pointer`}
              p={`16px`}
            >
              <Text color={`matador_form.label`}>Payment Breakdown</Text>
              <HStack
                align={'center'}
                justify={'center'}
                color="custom_color.dark_background_pop"
                fontWeight={600}
                gap={`4px`}
              >
                <Text color={`matador_form.label`}>View</Text>
                <Icon as={IoChevronForward} fontSize={'20px'} />
              </HStack>
            </Flex>
          )}

          {FEES?.map((fee, i) => (
            <Flex key={i} justify={'space-between'} align={'center'} gap={`5px`} p={`16px`}>
              <Text color={`matador_form.label`}>{fee?.name}</Text>

              <Text
                fontWeight={`500`}
                letterSpacing={`1%`}
                textAlign={`right`}
                minW={`max-content`}
                fontSize={fee?.amount * 1 > 999999 ? `14px` : `16px`}
              >
                {formatToCurrency(fee?.amount)}
              </Text>
            </Flex>
          ))}
        </Stack>
      </Stack>

      <Button
        variation={`primary`}
        // fontSize={`16px`}
        // fontWeight={`600`}
        // lineHeight={`140%`}
        // letterSpacing={`0.48px`}
        onClick={handleProceed}
        w={`100%`}
      >
        Proceed to Payment
      </Button>
    </Stack>
  );
};
