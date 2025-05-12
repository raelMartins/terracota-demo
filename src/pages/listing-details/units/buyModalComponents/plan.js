import React, {useEffect, useRef, useState} from 'react';
import {
  ModalContent,
  Flex,
  Box,
  Text,
  VStack,
  Center,
  Modal,
  ModalOverlay,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import {ArrowBackIcon, ArrowForwardIcon, CloseIcon} from '@chakra-ui/icons';
import {formatToCurrency} from '../../../../utils';
import Carousel from 'react-elastic-carousel';
import {CustomizableButton, Spinner} from '../../../../ui-lib';
import isMobile from '../../../../utils/extras';
import {useRouter} from 'next/router';
import {useQuery} from 'react-query';
import {fetchPaymentPlanDoc} from '../../../../api/listings';

const Plan = ({
  PAYMENT_PLAN_DATA,
  planLoading,
  onCloseModal,
  setSelectedPlan,
  selectedPlan,
  setStep,
  buyModal,
}) => {
  const [activePlan, setActivePlan] = useState(selectedPlan || null);
  const carouselRef = useRef();
  const param = `plan=${activePlan?.id}&purpose=paymentplan`;
  const projectDocQuery = useQuery(['fetchPaymentPlanDoc', param], () =>
    fetchPaymentPlanDoc(param)
  );

  const projectDocument =
    projectDocQuery.data?.data?.results?.[0]?.document_file ||
    projectDocQuery.data?.data?.results?.[0]?.document_url;

  const handlePlanSelect = async item => {
    setActivePlan(item);
    setSelectedPlan(item);
    await projectDocQuery.refetch();
  };

  useEffect(() => {
    if (PAYMENT_PLAN_DATA?.length === 1) {
      handlePlanSelect(PAYMENT_PLAN_DATA[0]);
    }
  }, [PAYMENT_PLAN_DATA]);

  useEffect(() => {
    if (activePlan && projectDocument && !projectDocQuery?.isLoading) {
      projectDocument ? setStep('terms') : setStep(`summary`);
    }
  }, [activePlan, projectDocument, projectDocQuery]);

  function splitArrayIntoChunks(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array?.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  const chunkedArray = PAYMENT_PLAN_DATA ? splitArrayIntoChunks(PAYMENT_PLAN_DATA, 2) : [];

  const mainContent = (
    <Box w="full">
      <Flex direction="row" justify="space-between" align={'center'} mb="15px">
        <Text
          fontSize={{base: '23px', md: '25px'}}
          fontWeight={400}
          color="text"
          className="heading-text-regular"
        >
          Payment Plans
        </Text>
        <CloseIcon
          fontWeight={600}
          alignSelf={'flex-start'}
          fontSize={'13px'}
          style={{color: '#667085', cursor: 'pointer'}}
          onClick={buyModal?.onClose}
        />
      </Flex>
      <Box minH={`300px`}>
        {planLoading || projectDocQuery?.isLoading ? (
          <Center minH={`300px`}>
            <Spinner noAbsolute />
          </Center>
        ) : (
          <Carousel
            ref={carouselRef}
            // breakPoints={breakPoint}
            pagination={false}
            // verticalMode
            // isRTL
            showArrows={false}
          >
            {chunkedArray?.map((itemChunkArray, i) => (
              <VStack align={'stretch'} px="0" w="96%" key={i}>
                {itemChunkArray.map((item, i) => (
                  <Box
                    key={i}
                    w="full"
                    h={{base: '170px', md: '180px'}}
                    my={{base: '4px', md: '8px'}}
                  >
                    <VStack
                      bg="matador_background.100"
                      px="12px"
                      align={'stretch'}
                      gap={'12px'}
                      border={'2px solid'}
                      cursor="pointer"
                      borderColor={'matador_border_color.100'}
                      key={i}
                      w="full"
                      h="full"
                      onClick={() => {
                        setSelectedPlan(item);
                        projectDocument ? setStep('terms') : setStep('summary');
                      }}
                      py="24px"
                    >
                      <Text
                        className="heading-text-regular"
                        textAlign={'center'}
                        color="text"
                        fontWeight={400}
                        fontSize={{base: '28px', md: '28px'}}
                      >
                        {item?.payment_period_in_months} Month
                        {item?.payment_period_in_months == 1 ? `` : `s`}
                      </Text>
                      <Box
                        borderBottom={'1px solid'}
                        borderColor={`matador_border_color.100 !important`}
                      />
                      <HStack justify={'space-between'} align={'center'}>
                        <Flex direction={'column'} w="32%" align={'flex-start'}>
                          <Text color="matador_form.label" fontWeight={500} fontSize={'13px'}>
                            Purchase Price
                          </Text>
                          <Text color="text" fontWeight={600} fontSize={'11px'}>
                            {formatToCurrency(item?.purchase_price)}
                          </Text>
                        </Flex>
                        <Flex direction={'column'} w="32%" align={'flex-start'}>
                          <Text color="matador_form.label" fontWeight={500} fontSize={'13px'}>
                            Initial Deposit
                          </Text>
                          <Text color="text" fontWeight={600} fontSize={'11px'}>
                            {formatToCurrency(item?.initial_deposit_in_value)}
                          </Text>
                        </Flex>
                        {item?.plan_type === 'manual' && item?.payment_frequency !== 'flexible' ? (
                          <Flex direction={'column'} w="32%" align={'flex-start'}>
                            <Text color="matador_form.label" fontWeight={500} fontSize={'13px'}>
                              {item?.payment_frequency
                                ? item?.payment_frequency?.charAt(0).toUpperCase() +
                                  item?.payment_frequency?.slice(1) +
                                  ' Payment'
                                : 'Periodic Payment'}
                            </Text>
                            <Text color="text" fontWeight={600} fontSize={'11px'}>
                              {formatToCurrency(item?.periodic_payment)}
                            </Text>
                          </Flex>
                        ) : (
                          <Box w="30%" />
                        )}
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            ))}
          </Carousel>
        )}
      </Box>

      {PAYMENT_PLAN_DATA?.length > 2 && (
        <HStack spacing={'15px'} justify={'flex-end'} mt="12px">
          <Center
            cursor={'pointer'}
            onClick={() => carouselRef.current?.slidePrev()}
            h="36px"
            w="36px"
            borderRadius={'full'}
            border="1px solid"
            borderColor={'matador_border_color.100'}
            bg="transparent"
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
            bg="transparent"
          >
            <ArrowForwardIcon color="text" fontWeight={700} />
          </Center>
        </HStack>
      )}
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
            maxW={'998px'}
            px={{base: '18px', md: '35px'}}
            minH="383px"
            py={{base: '24px', md: '42px'}}
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
            maxW={'477px'}
            px={{base: '18px', md: '24px'}}
            h="fit-content"
            py={{base: '24px', md: '28px'}}
            borderRadius={0}
          >
            {mainContent}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Plan;
