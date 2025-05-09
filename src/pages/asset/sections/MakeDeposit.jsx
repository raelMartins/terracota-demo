import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Icon,
  Modal,
  ModalContent,
  ModalOverlay,
  useMediaQuery,
} from '@chakra-ui/react';

import React, {useState} from 'react';
import {
  Flex,
  HStack,
  Image,
  Text,
  VStack,
  Box,
  Center,
  useToast,
  useClipboard,
  ModalCloseButton,
} from '@chakra-ui/react';
import {Button, CustomizableButton, FormInput} from '../../../ui-lib/ui-lib.components';
import depositIcon from '../../../images/icons/wallet-card.svg';
import bank from '../../../images/icons/payment-with-bank.svg';
import wallet from '../../../images/icons/debit-card.svg';
import {CheckIcon, CopyIcon} from '@chakra-ui/icons';
import {useAssetPayment} from '../../../ui-lib/ui-lib.hooks';
import processingLoader from '../../../images/processing-transaction.gif';
import successfulLoader from '../../../images/successful-transaction.gif';
import {calculateFee} from '../../../utils/calculateFee';
// import isMobile from '../../../utils/extras';
import {BsExclamationCircle} from 'react-icons/bs';
import {DebitCardSVG, PaymentWithBankSVG, WalletCardSVG} from '../../../components/assets/svgs';
import {handleTransferNote} from '../../../utils/transferNote';
import {storeDetails} from '../../../api/auth';
import {useQuery} from 'react-query';
import {FallBackBankTransfer} from '@/components/payment/FallBackBankTransfer';
import {MY_COUNTRY} from '@/constants/country';
import {PaymentAccess} from '@/components/payment/PaymentAccess';

const MakeDepositModal = ({depositModal, refetch, info}) => {
  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;
  const wallet_features = store_data?.wallet_features;
  const gateway_disabled = store_data?.gateway_disabled;
  const toast = useToast();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [step, setStep] = useState('method');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const amountToPay = amount?.replaceAll(',', '');

  const paymentDetails = {
    equity_id: info && info?.id,
    amount_to_pay: amountToPay,
    is_coown: false,
    pending: false,
  };

  const paymentType = 'deposit';

  const {
    handleBankTransfer,
    handlePayFromWallet,
    handlePaywithCard,
    authUrl,
    setAuthUrl,
    isLoading,
    setLoading,
    paymentStep,
    setPaymentStep,
    trasferDetails,
    setTransferDetails,
    formattedAmount,
    isAboveLimit,
    paymentMutation,
    depositMutation,
    handleEndTransaction,
  } = useAssetPayment({
    paymentType,
    refetch,
    amountToPay,
    modal: depositModal,
    paymentDetails,
    asset_id: info?.project?.id,
  });

  console.log({info});

  const [isMobile] = useMediaQuery('(max-width: 700px)');

  const {hasCopied, onCopy} = useClipboard(trasferDetails?.account_number ?? '');

  const showToast = () => {
    return toast({
      title: 'Account Number Copied!',
      status: 'info',
      duration: 1500,
      isClosable: true,
      position: 'top-right',
    });
    // return (
    //   <CopyIcon onClick={onCopy} fontSize={'25'} color="custom_color.color" cursor="pointer" h={8} w={8} />
    // );
  };

  const handleCopy = () => {
    onCopy();
    return toast({
      title: 'Account Number Copied!',
      status: 'info',
      duration: 1500,
      isClosable: true,
      position: 'top-right',
    });
  };
  const methods = [
    {
      id: '1',
      title: 'Debit Card',
      desc: 'NGN3,000,000 deposit limit',
      icon: <WalletCardSVG />,
      img: depositIcon.src,
      hide: gateway_disabled,
    },
    {
      id: '2',
      title: 'Wallet',
      desc: 'Make payment from your wallet',
      icon: <DebitCardSVG />,
      img: wallet.src,
      hide: !wallet_features,
    },
    {
      id: '3',
      title: 'Bank Transfer',
      desc: 'Transfer into designated account',
      icon: <PaymentWithBankSVG />,
      img: bank.src,
    },
  ];

  const handleSelect = el => {
    setSelectedMethod(el);
    const method = el || selectedMethod;
    if (!amount) return setAmountError('Enter an amount to proceed');
    if (method?.id === '1') {
      setStep('card');
      setSelectedMethod(null);
    } else if (method?.id === '2') {
      setStep('wallet');
      setSelectedMethod(null);
    } else if (method?.id === '3') {
      handleBankTransfer();
      setStep('bank');
      setSelectedMethod(null);
    } else {
      toast({
        title: 'Select a payment method',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleInput = e => {
    const formatNumber = parseInt(e.target.value.replace(/,/g, '')).toLocaleString();
    setAmountError('');
    if (formatNumber !== 'NaN') {
      setAmount(formatNumber);
    } else {
      setAmount('');
    }
  };

  const success = paymentMutation.isSuccess || depositMutation.isSuccess;

  const mainContent = (
    <Box>
      <ModalCloseButton
        color="text"
        top={{base: '12px', md: '25px'}}
        right={{base: '15px', md: '30px'}}
        fontSize={{base: '15px', md: '20px'}}
        onClick={depositModal?.onClose}
      />

      {step === 'method' && (
        <>
          <Text
            mb={{base: '25px', md: '40px'}}
            color="text"
            fontSize={{base: ' 21.445px', md: '25px'}}
            fontWeight={{base: 400, md: 500}}
            className="heading-text-semibold"
          >
            Make a Deposit
          </Text>
          <FormInput
            leftAddon={
              <Text color="text" fontSize={'20px'}>
                {MY_COUNTRY?.symbol}
              </Text>
            }
            label="Amount to deposit"
            onChange={handleInput}
            value={amount}
            error={amountError}
          />

          <Text
            color="text"
            mt="16px"
            fontSize={{base: '13px', md: '16px'}}
            fontWeight={{base: 400, md: 400}}
          >
            Select Payment Method
          </Text>
          <VStack spacing="6px" mt="16px" align={'stretch'}>
            {methods.map(method =>
              method?.hide ? (
                <></>
              ) : (
                <PaymentAccess
                  checkWallet={method?.title?.toLowerCase()?.includes(`wallet`)}
                  checkPayment={method?.title?.toLowerCase()?.includes(`wallet`)}
                  key={method.id}
                  content={
                    <Flex
                      key={method.id}
                      cursor="pointer"
                      // onClick={() => setSelectedMethod(method)}
                      onClick={() => handleSelect(method)}
                      border={selectedMethod?.id === method.id ? '1px solid' : '1px solid'}
                      borderColor={
                        selectedMethod?.id === method.id
                          ? 'custom_color.color'
                          : 'matador_border_color.100 !important'
                      }
                      _hover={{
                        border: '1px solid',
                        borderColor:
                          selectedMethod?.id === method.id
                            ? `custom_color.color`
                            : 'text !important',
                      }}
                      direction={'row'}
                      px="14px"
                      py="16px"
                      justify="space-between"
                      bg={`matador_background.100`}
                    >
                      <HStack spacing={'14px'}>
                        {/* <Image alt="next_image" src={method.img} /> */}
                        {method.icon}
                        <VStack align={'stretch'} spacing={0}>
                          <HStack spacing="10px" flexWrap={`wrap`}>
                            <Text
                              color="text"
                              fontSize={{base: '13px', md: '16px'}}
                              fontWeight={{base: 500, md: 500}}
                              className="heading-text-regular"
                            >
                              {method.title}
                            </Text>
                          </HStack>
                          <Text
                            color="text"
                            fontSize={{base: '13px', md: '16px'}}
                            fontWeight={{base: 400, md: 400}}
                          >
                            {method.desc}
                          </Text>
                        </VStack>
                      </HStack>

                      <Center
                        w="16px"
                        h="16px"
                        borderRadius={'full'}
                        border="1px solid"
                        borderColor={'matador_border_color.100'}
                      >
                        {selectedMethod?.id === method.id && (
                          <CheckIcon color={'text'} fontSize={'10px'} />
                        )}
                      </Center>
                    </Flex>
                  }
                />
              )
            )}
          </VStack>
          {/* <Button onClick={handleSelect} w="full" color="custom_color.contrast"
              bg="custom_color.color" mt="40px">
            Proceed
          </Button> */}
        </>
      )}

      {step === 'card' && (
        <Box my="30px">
          {success ? (
            <Center mt="20px" w="full" h="full" flexDirection={'column'} textAlign={'center'}>
              <Image alt="loader" w="150px" h="150px" src={successfulLoader.src} />
              <Text
                color="text"
                textAlign={'center'}
                fontWeight={{base: 600, md: 400}}
                className="heading-text-regular"
                fontSize={'28px'}
                my={{base: '12px', md: '25px'}}
              >
                Transaction Successful
              </Text>
              <Text
                color="text"
                opacity={0.8}
                fontSize={{base: '14px', md: '16px'}}
                fontWeight="400"
              >
                Your payment has been successfully processed
              </Text>
            </Center>
          ) : isLoading ? (
            <Center mt="20px" w="full" h="full" flexDirection={'column'} textAlign={'center'}>
              <Image alt="loader" w="150px" h="150px" src={processingLoader.src} />
              <Text
                color="text"
                textAlign={'center'}
                fontWeight={{base: 600, md: 400}}
                className="heading-text-regular"
                fontSize={'28px'}
                my={{base: '12px', md: '25px'}}
              >
                Processing payment
              </Text>
              <Text
                color="text"
                opacity={0.8}
                fontSize={{base: '14px', md: '16px'}}
                fontWeight="400"
              >
                Wait a moment
              </Text>
            </Center>
          ) : (
            <Flex
              w="full"
              h="full"
              direction="column"
              justify={'center'}
              align={'center'}
              gap="20px"
            >
              <Text
                color="text"
                fontWeight={500}
                fontSize={{base: '18px', md: '28px'}}
                className="heading-text-semibold"
                lineHeight={{base: '24px', md: '36px'}}
              >
                Continue with card
              </Text>
              <Text
                color="text"
                textAlign={'center'}
                fontWeight={400}
                fontSize={{base: '13px', md: '16px'}}
                lineHeight={{base: '18px', md: '25px'}}
              >
                In order to finish the payment process, you will be charged through your
                debit/credit card.
              </Text>
              <Flex mt="27px" gap="26px" justify="space-between" align="center" w="full">
                <CustomizableButton
                  border="1px solid"
                  color="text"
                  borderColor="matador_border_color.100"
                  bg="matador_background.100"
                  h="49px"
                  w={{base: '50%', md: '250px'}}
                  onClick={() => setStep('method')}
                >
                  Cancel
                </CustomizableButton>
                <Button
                  onClick={handlePaywithCard}
                  color="custom_color.contrast"
                  w={{base: '50%', md: '250px'}}
                  bg="custom_color.color"
                  h="49px"
                >
                  Proceed
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}

      {step === 'wallet' && (
        <Box my="30px">
          {success ? (
            <Center mt="20px" w="full" h="full" flexDirection={'column'} textAlign={'center'}>
              <Image alt="loader" w="150px" h="150px" src={successfulLoader.src} />
              <Text
                color="text"
                textAlign={'center'}
                fontWeight={{base: 600, md: 400}}
                className="heading-text-regular"
                fontSize={'28px'}
                my={{base: '12px', md: '25px'}}
              >
                Transaction Successful
              </Text>
              <Text
                color="text"
                opacity={0.8}
                fontSize={{base: '14px', md: '16px'}}
                fontWeight="400"
              >
                Your payment has been successfully processed
              </Text>
            </Center>
          ) : isLoading ? (
            <Center mt="20px" w="full" h="full" flexDirection={'column'} textAlign={'center'}>
              <Image alt="loader" w="150px" h="150px" src={processingLoader.src} />
              <Text
                color="text"
                textAlign={'center'}
                fontWeight={{base: 600, md: 400}}
                className="heading-text-regular"
                fontSize={'28px'}
                my={{base: '12px', md: '25px'}}
              >
                Processing payment
              </Text>
              <Text
                color="text"
                opacity={0.8}
                fontSize={{base: '14px', md: '16px'}}
                fontWeight="400"
              >
                Wait a moment
              </Text>
            </Center>
          ) : (
            <Flex
              w="full"
              h="full"
              direction="column"
              justify={'center'}
              align={'center'}
              gap="20px"
            >
              <Text
                color="text"
                fontWeight={500}
                fontSize={{base: '18px', md: '28px'}}
                className="heading-text-semibold"
                lineHeight={{base: '24px', md: '36px'}}
              >
                Continue with your wallet
              </Text>
              <Text
                color="text"
                textAlign={'center'}
                fontWeight={400}
                fontSize={{base: '13px', md: '16px'}}
                lineHeight={{base: '18px', md: '25px'}}
              >
                In order to finish the payment process, you will be charged through your wallet.
              </Text>
              <Flex mt="27px" gap="26px" justify="space-between" align="center" w="full">
                <CustomizableButton
                  border="1px solid"
                  color="text"
                  borderColor="matador_border_color.100"
                  bg="matador_background.100"
                  h="49px"
                  w={{base: '50%', md: '250px'}}
                  onClick={() => setStep('method')}
                >
                  Cancel
                </CustomizableButton>
                <Button
                  onClick={handlePayFromWallet}
                  color="custom_color.contrast"
                  w={{base: '50%', md: '250px'}}
                  bg="custom_color.color"
                  h="49px"
                >
                  Proceed
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}

      {step === 'bank' && (
        <>
          {isLoading ? (
            <Center mt="20px" w="full" h="full" flexDirection={'column'}>
              <Image alt="loader" w="150px" h="150px" src={processingLoader.src} />
              <Text
                color="text"
                textAlign={'center'}
                fontWeight={{base: 600, md: 400}}
                className="heading-text-regular"
                fontSize={'28px'}
                my={{base: '12px', md: '25px'}}
              >
                Fetching bank details
              </Text>
              <Text
                color="text"
                opacity={0.8}
                fontSize={{base: '14px', md: '16px'}}
                fontWeight="400"
              >
                Wait a moment
              </Text>
            </Center>
          ) : trasferDetails?.length ? (
            <FallBackBankTransfer accounts={trasferDetails} amount={amountToPay} pt={`30px`} />
          ) : (
            <Box w="full" color="text">
              <Flex mb="24px" direction="row" justify="space-between" align={'center'}>
                <Text
                  className="heading-text-regular"
                  fontSize={{base: '20px', md: '28px'}}
                  fontWeight={400}
                >
                  Bank Transfer
                </Text>
              </Flex>

              <Flex
                my="12px"
                h="130px"
                w="full"
                color="text"
                border="1px solid"
                borderColor={'matador_border_color.100 !important'}
                bg="matador_background.100"
                align={'center'}
                justify={'center'}
                direction="column"
              >
                <Text color="text" fontSize={{base: '14px', md: '18px'}} fontWeight={400}>
                  You will Pay
                </Text>
                <Text
                  color="matador_text.500"
                  fontSize={{base: '28px', md: '34px'}}
                  fontWeight={500}
                >
                  {calculateFee(amount)}
                </Text>
              </Flex>

              <Flex
                w="full"
                color="text"
                direction={'column'}
                my="22px"
                minH="260px"
                fontSize={'14px'}
                fontWeight={400}
                justify={'space-between'}
                align="stretch"
                gap="23px"
              >
                <Box>
                  <Text
                    color="text"
                    fontSize={{base: '12px', md: '13px'}}
                    fontWeight={500}
                    textAlign={'center'}
                    mb="12px"
                  >
                    {
                      'Kindly proceed with the payment to the provided account number , and please be aware that there is a fee associated with transfer.'
                    }
                  </Text>
                </Box>
                <Box>
                  <Flex
                    w="80%"
                    mx="auto"
                    bg="matador_background.100"
                    color={`text`}
                    border={`1px solid`}
                    borderColor={`matador_border_color.100`}
                    p="10px 35px"
                    justify={'space-between'}
                    align={'center'}
                  >
                    <Box w="25px" />
                    <Box textAlign={'center'}>
                      <Text fontSize={{base: '12px', md: '13px'}} fontWeight={500}>
                        {trasferDetails?.account_bank_name}
                      </Text>
                      <Text
                        fontSize={{base: '20px', md: '25px'}}
                        fontWeight={400}
                        className="heading-text-regular"
                      >
                        {trasferDetails?.account_number}
                      </Text>
                    </Box>
                    <CopyIcon
                      onClick={handleCopy}
                      fontSize={'25'}
                      color={hasCopied ? 'custom_color.color' : 'text'}
                      cursor="pointer"
                      h={8}
                      w={8}
                    />
                  </Flex>
                </Box>

                <Text
                  color="text"
                  fontSize={{base: '12px', md: '13px'}}
                  fontWeight={500}
                  textAlign={'center'}
                >
                  {trasferDetails?.account_name}
                </Text>
                <Flex gap="5px" w="full">
                  <Icon mt="2px" color="text" as={BsExclamationCircle} fontSize={'13px'} />
                  <Text
                    fontSize={{base: '12px', md: '11px'}}
                    fontWeight={400}
                    color="matador_text.500"
                  >
                    While most transfers are processed almost immediately, please note that it may
                    take longer in some cases. Be rest assured that we will notify you via email as
                    soon as the transfer is complete.
                  </Text>
                </Flex>
              </Flex>
              <Button
                onClick={depositModal.onClose}
                color="custom_color.contrast"
                w="full"
                bg="custom_color.color"
                h="49px"
              >
                Done
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          onCloseComplete={() => {
            setAmount('');
            handleEndTransaction();
            setStep('method');
            setSelectedMethod(null);
          }}
          px="45px"
          mx="auto"
          minH="fit-content"
          minW={{base: '90%', lg: '276px'}}
          isOpen={depositModal?.isOpen}
          onClose={depositModal?.onClose}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent maxW="479px" minH="322px" bg="card_bg" p={{base: '20px', md: '30px'}}>
            {mainContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          onCloseComplete={() => {
            setAmount('');
            handleEndTransaction();
            setStep('method');
            setSelectedMethod(null);
          }}
          px="45px"
          mx="auto"
          minH="fit-content"
          minW={{base: '90%', lg: '276px'}}
          isOpen={depositModal?.isOpen}
          onClose={depositModal?.onClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            bg="card_bg"
            maxW="479px"
            minH="322px"
            p={{base: '20px', md: '30px'}}
            borderRadius={{base: '8px', md: '0px'}}
            position={`fixed`}
            top={`80px`}
            right={`80px`}
          >
            {mainContent}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
export default MakeDepositModal;
