import {storeDetails} from '@/api/auth';
import {useState} from 'react';
import {useQuery} from 'react-query';
import BankAccountModal from './BankAccountModal';
import ConfirmCard from './ConfirmCard';
import {Box, Center, Flex, HStack, Image, Tag, Text, VStack} from '@chakra-ui/react';
import {AssetPaymentWithBankSVG, DebitCardSVG, WalletCardSVG} from '@/components/assets/svgs';
import {formatToCurrency} from '@/utils';
import {ArrowBackIcon, CloseIcon} from '@chakra-ui/icons';
import {Button} from '@/ui-lib';
import {useAssetPayment} from '@/ui-lib/ui-lib.hooks';
import processingLoader from '@/images/processing-transaction.gif';
import check_web from '@/images/done_green_check.gif';
import {PaymentAccess} from './PaymentAccess';

export const PaymentFlowContent = ({
  paymentType,
  amountToPay,
  modal,
  paymentDetails,
  purchaseType = `regular`,
  handleClose = () => {},
  unitData,
  asset_id,
  showTitle,
  onSelectBankTransfer,
  onSelectInstantBankTransfer,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [bankTransferType, setBankTransferType] = useState(`regular`);

  const {
    handleBankTransfer,
    handlePayFromWallet,
    handlePaywithCard,
    authUrl,
    isLoading,
    paymentStep,
    setPaymentStep,
    trasferDetails,
    isAboveLimit,
    paymentMutation,
    depositMutation,
    handleEndTransaction,
  } = useAssetPayment({
    modal,
    amountToPay,
    paymentType,
    paymentDetails,
    auth_code: selectedCard?.authorization_code,
    asset_id: asset_id || unitData?.project?.id,
  });

  // guidelines for how payment methods are handled depending
  // on where they are to be used
  const purchaseTypeGuidelines = {
    regular: {
      showChargesTag: false,
      showConfirmationSpeedTag: false,
      available_payment_methods: [`wallet`, `card`, `bankTransfer`],
    },
    direct_purchase: {
      showChargesTag: false,
      showConfirmationSpeedTag: true,
      available_payment_methods: [`card`, `bankTransfer`, `instantBankTransfer`],
    },
  };

  const guidelines = purchaseTypeGuidelines[purchaseType] || purchaseTypeGuidelines?.regular;

  const handlePaymentFlowClose = () => {
    setPaymentStep('index');
    handleEndTransaction();
    setSelectedCard(null);
    setBankTransferType('regular');
    handleClose();
  };

  //functions to handle each payment method
  const click_wallet = () => {
    handlePayFromWallet();
  };

  const click_card = () => {
    setPaymentStep('confirmCard');
  };

  const click_bank_payment = () => {
    setBankTransferType(`regular`);
    onSelectBankTransfer ? onSelectBankTransfer() : null;
    handleBankTransfer();
  };

  const click_instant_bank_payment = () => {
    setBankTransferType(`instant`);
    onSelectInstantBankTransfer ? onSelectInstantBankTransfer() : null;
    handleBankTransfer();
  };

  const payment_methods = [
    {
      icon: <WalletCardSVG mt="5px" />,
      type: `wallet`,
      title: `Wallet`,
      desciption: `Make payment from your wallet`,
      tag: `instant`,
      charges: false,
      onClick: click_wallet,
      hide: !guidelines?.available_payment_methods?.includes(`wallet`),
    },
    {
      icon: <DebitCardSVG mt={`5px`} />,
      type: `card`,
      title: `Debit/Credit Card`,
      desciption: `Use a debit card to complete your payment`,
      tag: `instant`,
      charges: true,
      onClick: click_card,
      hide: isAboveLimit || !guidelines?.available_payment_methods?.includes(`card`),
    },

    {
      icon: <AssetPaymentWithBankSVG />,
      type: `instantBankTransfer`,
      title: `Instant Bank Transfer`,
      desciption: `Transfer payment to a designated account`,
      tag: `instant`,
      charges: true,
      onClick: click_instant_bank_payment,
      hide: !guidelines?.available_payment_methods?.includes(`instantBankTransfer`),
    },
    {
      icon: <AssetPaymentWithBankSVG />,
      type: `bankTransfer`,
      title: `Bank Transfer`,
      desciption: `Transfer payment to a designated account`,
      tag: `24h confirmation`,
      charges: true,
      onClick: click_bank_payment,
      hide: !guidelines?.available_payment_methods?.includes(`bankTransfer`),
    },
  ];

  const innerContent = (
    <>
      {paymentMutation.isSuccess || depositMutation.isSuccess ? (
        <Center mt="20px" w="full" h="full" flexDirection={'column'} textAlign={'center'}>
          <Image alt="loader" w="150px" h="150px" src={check_web.src} />
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
          <Text color="text" opacity={0.8} fontSize={{base: '14px', md: '16px'}} fontWeight="400">
            Your payment has been successfully processed
          </Text>
          <Button
            borderRadius={'2px'}
            onClick={handlePaymentFlowClose}
            color="custom_color.contrast"
            w={'full'}
            maxW={'100%'}
            bg="custom_color.color"
            h="49px"
            mt="40px"
            _hover={{opacity: `1`}}
            _active={{opacity: `1`}}
          >
            Finish
          </Button>
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
          <Text color="text" opacity={0.8} fontSize={{base: '14px', md: '16px'}} fontWeight="400">
            Wait a moment
          </Text>
        </Center>
      ) : (
        <Box w="full">
          <Flex
            h="135px"
            mt="12px"
            bg="matador_background.100"
            border="1px solid"
            borderColor={'matador_border_color.100'}
            direction="column"
            w="full"
            align={'center'}
            justify={'center'}
          >
            <Text color="text" fontWeight={400} fontSize={{base: '16px', md: '16px'}}>
              You will Pay
            </Text>
            <Text color="matador_text.500" fontWeight={600} fontSize={{base: '28px', md: '34px'}}>
              {formatToCurrency(amountToPay)}
            </Text>
          </Flex>

          <Text
            color="text"
            mt={{base: '24px', md: '24px'}}
            fontSize={{base: '14px', md: '16px'}}
            fontWeight={500}
            opacity={0.7}
          >
            Select payment method
          </Text>

          <VStack mt={{base: '10px', md: '14px'}} spacing={'16px'}>
            {payment_methods?.map((method, i) => {
              return method?.hide ? null : (
                <PaymentAccess
                  checkWallet={method?.type?.toLowerCase()?.includes(`wallet`)}
                  checkPayment={method?.type?.toLowerCase()?.includes(`bank`) ? false : true}
                  key={method?.type}
                  content={
                    <Flex
                      bg="matador_background.100"
                      border="1px solid"
                      borderColor={'matador_border_color.100'}
                      p="16px"
                      cursor={'pointer'}
                      onClick={method?.onClick}
                      w="full"
                      pt="15px"
                      pb="21px"
                      gap="17px"
                    >
                      {method?.icon}
                      <Flex direction={'column'} gap="6px">
                        <HStack spacing="10px" flexWrap={`wrap`}>
                          <Text fontWeight={500} fontSize={'16px'} color="matador_text.100">
                            {method?.title}
                          </Text>
                          {method?.tag && guidelines?.showConfirmationSpeedTag ? (
                            <Tag
                              bg={`custom_color.opacity_pop._20`}
                              borderRadius={`full`}
                              fontSize={`11px`}
                              color={`custom_color.color_pop`}
                              p={`4px 8px`}
                              lineHeight={`140%`}
                              letterSpacing={`0%`}
                            >
                              {method?.tag}
                            </Tag>
                          ) : null}
                        </HStack>
                        <Text fontWeight={500} color="matador_form.label" fontSize={'13px'}>
                          {method?.desciption}{' '}
                        </Text>
                      </Flex>
                    </Flex>
                  }
                />
              );
            })}
          </VStack>
        </Box>
      )}
    </>
  );

  return (
    <>
      {paymentStep === 'index' ? (
        <>
          {showTitle && (
            <Flex direction="row" justify="space-between" align={'center'} mb="10px">
              <Text
                color="text"
                fontSize={{base: '23px', md: '28px'}}
                fontWeight={400}
                className="heading-text-regular"
              >
                Payment Method
              </Text>
              <CloseIcon
                color="text"
                style={{cursor: 'pointer'}}
                size="20"
                onClick={modal?.onClose}
              />
            </Flex>
          )}
          {innerContent}
        </>
      ) : paymentStep === 'bankDetails' ? (
        <>
          {showTitle && (
            <Flex mb="24px" justify={'space-between'} align={'center'}>
              <HStack
                spacing="12px"
                onClick={() => {
                  setPaymentStep('index');
                  handleEndTransaction();
                }}
                cursor="pointer"
              >
                <ArrowBackIcon fontSize={'25px'} cursor="pointer" color="text" />
                <Text
                  color="text"
                  fontSize={{base: '23px', md: '28px'}}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Bank Transfer
                </Text>
              </HStack>
              <CloseIcon
                color="text"
                style={{cursor: 'pointer'}}
                size={20}
                onClick={() => {
                  setPaymentStep('index');
                  handleEndTransaction();
                }}
              />
            </Flex>
          )}
          <BankAccountModal
            handleEndTransaction={handleEndTransaction}
            authUrl={authUrl}
            amount={amountToPay}
            paymentType={paymentType}
            loading={isLoading}
            success={paymentMutation.isSuccess || depositMutation.isSuccess}
            trasferDetails={trasferDetails}
            setPaymentStep={setPaymentStep}
            purchaseType={purchaseType}
            bankTransferType={bankTransferType}
            asset_id={asset_id || unitData?.project?.id}
            handleClose={
              purchaseType === `direct_purchase`
                ? handlePaymentFlowClose
                : modal
                ? modal?.onClose
                : () => {}
            }
          />
        </>
      ) : paymentStep === 'confirmCard' ? (
        <ConfirmCard
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          amountToPay={amountToPay}
          loading={isLoading}
          success={paymentMutation.isSuccess || depositMutation.isSuccess}
          proceed={handlePaywithCard}
          setPaymentStep={setPaymentStep}
        />
      ) : null}
    </>
  );
};
