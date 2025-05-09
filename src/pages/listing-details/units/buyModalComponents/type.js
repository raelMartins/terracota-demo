import React, {useEffect} from 'react';
import {
  ModalContent,
  Box,
  ModalBody,
  VStack,
  Image,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Center,
} from '@chakra-ui/react';
import {CloseIcon} from '@chakra-ui/icons';
import stack from '../../../../images/payment-plan-img.svg';
import rhombus from '../../../../images/outright-purchase-img.svg';
import isMobile from '../../../../utils/extras';
import {useRouter} from 'next/router';
import {fetchPaymentPlanDoc} from '../../../../api/listings';
import {useQuery} from 'react-query';

const Type = ({onCloseModal, setFullPayment, setStep, buyModal, fullPayment, unitData}) => {
  const router = useRouter();
  const param = `unit=${router.query?.unit ?? unitData?.id}&purpose=outright`;
  const projectDocQuery = useQuery(['fetchPaymentPlanDoc', param], () =>
    fetchPaymentPlanDoc(param)
  );
  const projectDocument =
    projectDocQuery.data?.data?.results?.[0]?.document_file ||
    projectDocQuery.data?.data?.results?.[0]?.document_url;

  useEffect(() => {
    if (fullPayment) {
      projectDocument ? setStep('terms') : setStep('summary');
    }
  }, [fullPayment]);

  const types = [
    {
      header: 'Outright Payment ',
      subHeader: 'Complete payment with lump-sum payment.',
      onClick: () => {
        projectDocument ? setStep('terms') : setStep('summary');
        setFullPayment(true);
      },
    },
    {
      header: 'Payment plan ',
      subHeader: 'Pay in instalments instead of a lump-sum payment.',
      onClick: () => {
        setStep('plan');
        setFullPayment(false);
      },
    },
  ];

  const mainContent = (
    <>
      <Box px="10px">
        <Flex w="full" justify="space-between" align="center">
          <Text
            color="matador_text.100"
            fontSize={{base: '23px', md: '23px'}}
            mb="7px"
            fontWeight={400}
            className="heading-text-regular"
          >
            How would you like to pay?
          </Text>
          <Center p="8px">
            <CloseIcon
              color="text"
              cursor={'pointer'}
              onClick={buyModal?.onClose}
              fontSize={'15px'}
            />
          </Center>
        </Flex>
        <Flex
          mt={{base: '24px', md: '24px'}}
          gap={{base: '18px', md: '16px'}}
          justify="space-between"
          align="stretch"
          direction={{base: 'column', md: 'row'}}
        >
          {types.map((typeToUse, i) => (
            <Flex
              key={i}
              // _hover={{ bg: '#747474' }}
              onClick={typeToUse.onClick}
              cursor="pointer"
              w="full"
              px={'24px'}
              pb={{base: '24px', md: '40px'}}
              pt={{base: '24px', md: '30px'}}
              gap="16px"
              align={'center'}
              border="1px solid"
              borderRadius="2px"
              borderColor={'matador_border_color.100'}
            >
              <VStack align="stretch" spacing={'8px'}>
                <Text
                  fontSize={'23px'}
                  fontWeight="400"
                  color="text"
                  className="heading-text-regular"
                >
                  {typeToUse.header}
                </Text>
                <Text
                  fontSize={{base: '13px', md: '15px'}}
                  fontWeight="400"
                  color="matador_text.500"
                >
                  {typeToUse.subHeader}
                </Text>
              </VStack>
            </Flex>
          ))}
        </Flex>
      </Box>
    </>
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
            maxW="716px"
            pt={{base: '20px', md: '35px'}}
            pb={{base: '25px', md: '50px'}}
            px={{base: '12px', md: '37px'}}
            // borderTopRadius={{base: '10px', md: '16px'}}
          >
            <DrawerBody px="0">{mainContent}</DrawerBody>
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
            maxW="716px"
            pt={{base: '20px', md: '35px'}}
            pb={{base: '25px', md: '50px'}}
            px={{base: '12px', md: '37px'}}
            borderRadius={0}
          >
            <ModalBody px="0">{mainContent}</ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Type;
