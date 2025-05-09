import {
  Box,
  Divider,
  Flex,
  HStack,
  Input,
  Stack,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import {formatToCurrency} from '../../../../utils';
import {Button} from '../../../../ui-lib';
import {CloseIcon} from '@chakra-ui/icons';
import {useState} from 'react';
import {appCurrentTheme} from '../../../../utils/localStorage';
import {LIGHT} from '../../../../constants/names';
import {PaymentAccess} from '@/components/payment/PaymentAccess';
import {checkIfSFH} from '@/utils/misc';

export const PriceContent = ({
  progress_bar,
  unitData,
  fractionalData,
  fractionalModal,
  fractions,
  setFractions,
  setStep,
  info,
}) => {
  const [error, setError] = useState('');

  const leftFractions = Number(unitData?.total_fractions);

  const fractionalPercent = Math.ceil(
    (Number(unitData?.total_purchased_fractions) /
      (Number(unitData?.total_fractions) + Number(unitData?.total_purchased_fractions))) *
      100
  ).toFixed(2);

  const handleFractionInput = e => {
    setError('');
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue > leftFractions)
      setError('Apologies, but you cannot purchase more fractions than are currently available.');
    setFractions(numericValue);
  };

  const is_detached = checkIfSFH(info);

  const top_row = [
    {
      title: `Price Per Fraction`,
      value: formatToCurrency(unitData?.price_per_fraction),
      show: true,
    },
    {
      title: `Unit Type`,
      // value: unitData?.unit_type,
      value: unitData?.unit_title,
      // show: !is_detached && unitData?.unit_type,
      show: !is_detached && unitData?.unit_title,
    },
    {
      title: `Dividend`,
      value: fractionalData?.extra_info?.dividend_amount
        ? formatToCurrency(fractionalData?.extra_info?.dividend_amount)
        : '-',
      show:
        fractionalData?.extra_info?.dividend_amount &&
        parseInt(fractionalData?.extra_info?.dividend_amount) !== 0,
    },
    {
      title: `Dividend Payout`,
      value: fractionalData?.extra_info?.dividend_payout,
      show: fractionalData?.extra_info?.dividend_payout ? true : false,
    },
    {
      title: `Holding Period`,
      value: unitData?.holding_period,
      show: unitData?.holding_period ? true : false,
    },
  ];
  return (
    <Box w="full" className="sub-text-regular">
      <Stack w="full">
        <Flex justify={'space-between'} w="full" align={'center'}>
          <Text
            className="heading-text-regular"
            fontSize={'28px'}
            lineHeight={`133%`}
            textTransform="capitalize"
          >
            {unitData?.project?.name}
          </Text>
          <CloseIcon cursor={'pointer'} onClick={fractionalModal?.onClose} />
        </Flex>
        {progress_bar && (
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
              bg={appCurrentTheme === LIGHT ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.2)'}
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
                top="-20px"
                fontSize={`8px`}
              >
                {`${fractionalPercent}%`}
              </Text>
              <Box
                w={`${fractionalPercent}%`}
                h="full"
                bg="custom_color.color"
                borderRadius={'20px 0px 0px 20px'}
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
        )}
        <Stack
          w="full"
          divider={
            <StackDivider
              border={`1px solid`}
              borderColor={`matador_border_color.100`}
              m={`0px !important`}
            />
          }
        >
          <HStack gap={`35px`} py={`20px`} flexWrap={`wrap`}>
            {top_row?.map((el, i) => {
              return el.show ? (
                <Stack key={i}>
                  <Text
                    fontSize={`12px`}
                    fontWeight={`500`}
                    lineHeight={`17px`}
                    letterSpacing={`0.01em`}
                    color={`matador_form.label`}
                  >
                    {el.title}
                  </Text>
                  <Text
                    fontSize={'12px'}
                    fontWeight={`600`}
                    color="text"
                    textTransform="capitalize"
                    lineHeight={`16px`}
                    letterSpacing={`-0.02em`}
                    textAlign={`left`}
                  >
                    {el.value}
                  </Text>
                </Stack>
              ) : (
                <></>
              );
            })}
          </HStack>
          {fractionalData?.partners?.length > 0 && (
            <HStack gap={`35px`} py={`20px`} flexWrap={`wrap`}>
              {/* {fractionalData?.extra_info?.issuer && (
              <Stack>
                <Text
                  fontSize={'12px'}
                  fontWeight={`600`}
                  color="text"
                  textTransform="capitalize"
                  lineHeight={`16px`}
                  letterSpacing={`-0.02em`}
                  textAlign={`left`}
                >
                  Property Management
                </Text>
                <Text
                  fontSize={`12px`}
                  fontWeight={`500`}
                  lineHeight={`17px`}
                  letterSpacing={`0.01em`}
                  color={`matador_text.400`}
                >
                  {fractionalData?.extra_info?.issuer}
                </Text>
              </Stack>
            )} */}
              {fractionalData?.partners?.map((el, i) => (
                <Stack key={i}>
                  <Text
                    fontSize={'12px'}
                    fontWeight={`600`}
                    color="text"
                    textTransform="capitalize"
                    lineHeight={`16px`}
                    letterSpacing={`-0.02em`}
                    textAlign={`left`}
                  >
                    {el.stakeholder_name}
                  </Text>
                  <Text
                    fontSize={`12px`}
                    fontWeight={`500`}
                    lineHeight={`17px`}
                    letterSpacing={`0.01em`}
                    color={`matador_form.label`}
                    textTransform={`capitalize`}
                  >
                    {el.stakeholder_type}
                  </Text>
                </Stack>
              ))}
            </HStack>
          )}
        </Stack>

        <VStack align={'stretch'} w="full" spacing={'15px'} py={`20px`}>
          <Flex gap="20px" w="full">
            <Input
              value={fractions}
              onChange={handleFractionInput}
              borderRadius={0}
              bg={`matador_background.100`}
              border="1px solid "
              borderColor={`matador_border_color.100 !important`}
              h="48px"
              type="number"
              placeholder="How many fraction would you like to purchase?"
              flex={`1`}
              fontSize={`12px`}
              color={`matador_text.400`}
              _placeholder={{color: `matador_text.400`}}
            />
            <PaymentAccess
              checkFractions
              content={
                <Button
                  h="48px"
                  p={`13px 20px`}
                  bg={'custom_color.color'}
                  color={`custom_color.contrast`}
                  isDisabled={error || !Boolean(Number(fractions))}
                  onClick={() => setStep('payment')}
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
              <Text fontSize={'16px'} fontWeight={400} color="text">
                Total Price
              </Text>
              <Text fontSize={'16px'} fontWeight={400} color="text">
                {formatToCurrency(fractions * unitData?.price_per_fraction)}
              </Text>
            </Flex>
          )}
        </VStack>
      </Stack>
    </Box>
  );
};

export default PriceContent;
