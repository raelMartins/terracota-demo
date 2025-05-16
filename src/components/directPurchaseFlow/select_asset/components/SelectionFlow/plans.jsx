import {useEffect, useRef} from 'react';
import {Flex, Box, Text, VStack, Center, HStack, Stack, Divider} from '@chakra-ui/react';
import {ArrowBackIcon, ArrowForwardIcon, CloseIcon} from '@chakra-ui/icons';
import {formatToCurrency} from '@/utils';
import Carousel from 'react-elastic-carousel';
import {capitalizeString, splitArrayIntoChunks} from '@/utils/misc';
import ThreeDots from '@/components/loaders/ThreeDots';

export const SelectionFlowPlans = ({
  plans,
  planLoading,
  setSelectedPlan,
  setFullPayment,
  setTab,
  disclosure,
  backScreen,
}) => {
  const carouselRef = useRef();

  const outright_object = {
    title: `Outright`,
    outright: true,
    purchase_price: plans?.[0]?.bundle?.price,
  };

  const chunkedArray = plans ? splitArrayIntoChunks([outright_object, ...plans], 3) : [];

  const handleSelect = item => {
    if (item?.outright) {
      setFullPayment(true);
      setSelectedPlan(null);
    } else {
      setFullPayment(false);
      setSelectedPlan(item);
    }
    setTab('summary');
  };

  useEffect(() => {
    if (plans && !plans?.[0]?.id) {
      setTab('summary');
      setFullPayment(true);
      setSelectedPlan(null);
    }
  }, [plans]);

  return (
    <Stack gap={`12px`} w="full" minH={`400px`}>
      <Flex direction="row" justify="space-between" align={'center'} px={`8px`}>
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
          How would you like to pay?
        </Text>
        <CloseIcon
          fontWeight={600}
          alignSelf={'flex-start'}
          fontSize={'13px'}
          style={{color: '#667085', cursor: 'pointer'}}
          onClick={disclosure?.onClose}
        />
      </Flex>
      {planLoading || (plans && !plans?.[0]?.id) ? (
        <Center h={`300px`}>
          <ThreeDots boxSize={{base: '10px', md: '14px'}} circular />
        </Center>
      ) : (
        <Carousel ref={carouselRef} pagination={false} showArrows={false}>
          {chunkedArray?.map((itemChunkArray, i) => (
            <Stack gap={{base: '4px', md: '8px'}} px="0" w="100%" key={i}>
              {itemChunkArray.map((item, i) => (
                <VStack
                  key={i}
                  minH={{base: '100px'}}
                  p={{base: `24px 12px`}}
                  bg="matador_background.100"
                  gap={'8px'}
                  border={'2px solid'}
                  cursor="pointer"
                  borderColor={'matador_border_color.100'}
                  w="full"
                  onClick={() => handleSelect(item)}
                >
                  <Text
                    className="heading-text-regular"
                    textAlign={'center'}
                    color="text"
                    fontWeight={400}
                    fontSize={{base: '23px'}}
                    lineHeight={`140%`}
                    letterSpacing={`0%`}
                    textAliign={`center`}
                  >
                    {item?.title || `${item?.payment_period_in_months} Months`}
                  </Text>
                  <Divider
                    borderColor={`matador_border_color.100 !important`}
                    margin={`0px !important`}
                  />
                  <HStack justify={'center'} gap={`20px`} flexWrap={`wrap`}>
                    {item?.initial_deposit_in_value && (
                      <VStack flex={`1`}>
                        <Text
                          color="matador_form.label"
                          fontWeight={400}
                          fontSize={'13px'}
                          lineHeight={`135%`}
                          letterSpacing={`4%`}
                          minW={`max-content`}
                        >
                          Initial Deposit
                        </Text>
                        <Text
                          fontWeight={`600`}
                          fontSize={`11px`}
                          lineHeight={`140%`}
                          letterSpacing={`0%`}
                          minW={`max-content`}
                        >
                          {formatToCurrency(item?.initial_deposit_in_value)}
                        </Text>
                      </VStack>
                    )}
                    {item?.plan_type === 'manual' && item?.payment_frequency !== 'flexible' ? (
                      <VStack flex={`1`}>
                        <Text
                          color="matador_form.label"
                          fontWeight={400}
                          fontSize={'13px'}
                          lineHeight={`135%`}
                          letterSpacing={`4%`}
                          minW={`max-content`}
                        >
                          {capitalizeString(
                            item?.payment_frequency
                              ? `${item?.payment_frequency}  Payment`
                              : 'Periodic Payment'
                          )}
                        </Text>
                        <Text
                          fontWeight={`600`}
                          fontSize={`11px`}
                          lineHeight={`140%`}
                          letterSpacing={`0%`}
                          minW={`max-content`}
                        >
                          {formatToCurrency(item?.periodic_payment)}
                        </Text>
                      </VStack>
                    ) : null}
                    <VStack flex={`1`} gap={`8px`}>
                      <Text
                        color="matador_form.label"
                        fontWeight={400}
                        fontSize={'13px'}
                        lineHeight={`135%`}
                        letterSpacing={`4%`}
                        minW={`max-content`}
                      >
                        Purchase Price
                      </Text>
                      <Text
                        fontWeight={`600`}
                        fontSize={`11px`}
                        lineHeight={`140%`}
                        letterSpacing={`0%`}
                        minW={`max-content`}
                      >
                        {formatToCurrency(item?.purchase_price)}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              ))}
            </Stack>
          ))}
        </Carousel>
      )}

      {plans?.length > 2 && (
        <HStack spacing={'15px'} justify={'flex-end'} px={`8px`}>
          <Center
            cursor={'pointer'}
            onClick={() => carouselRef.current?.slidePrev()}
            h="36px"
            w="36px"
            borderRadius={'full'}
            border="1px solid"
            borderColor={'matador_border_color.100'}
            bg="matador_background.100"
          >
            <ArrowBackIcon color="text" fontWeight={700} />
          </Center>

          <Center
            cursor={'pointer'}
            onClick={() => carouselRef.current?.slideNext()}
            h="36px"
            w="36px"
            borderRadius={'full'}
            border="1px solid"
            borderColor={'matador_border_color.100'}
            bg="matador_background.100"
          >
            <ArrowForwardIcon color="text" fontWeight={700} />
          </Center>
        </HStack>
      )}
    </Stack>
  );
};
