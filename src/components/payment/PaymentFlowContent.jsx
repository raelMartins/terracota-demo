import {storeDetails} from '@/api/auth';
import {useState} from 'react';
import {useQuery} from 'react-query';
import BankAccountModal from './BankAccountModal';
import ConfirmCard from './ConfirmCard';
import {Box, Center, Flex, HStack, Image, Text, VStack} from '@chakra-ui/react';
import {AssetPaymentWithBankSVG, DebitCardSVG, WalletCardSVG} from '../assets/svgs';
import {formatToCurrency} from '@/utils';
import {ArrowBackIcon, CloseIcon} from '@chakra-ui/icons';
import {Button} from '@/ui-lib';
import {useAssetPayment} from '@/ui-lib/ui-lib.hooks';
import processingLoader from '../../images/processing-transaction.gif';
import check_web from '../../images/done_green_check.gif';
import {PaymentAccess} from './PaymentAccess';

export const PaymentFlowContent = ({
  paymentType,
  amountToPay,
  modal,
  paymentDetails,
  handleClose = () => {},
  unitData,
  asset_id,
  showTitle,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);

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

  const handlePaymentFlowClose = () => {
    setPaymentStep('index');
    handleEndTransaction();
    setSelectedCard(null);
    handleClose();
  };
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
            <PaymentAccess
              checkWallet
              content={
                <Flex
                  bg="matador_background.100"
                  border="1px solid"
                  borderColor={'matador_border_color.100'}
                  p="16px"
                  cursor={'pointer'}
                  onClick={handlePayFromWallet}
                  w="full"
                  pt="15px"
                  pb="21px"
                  gap="17px"
                >
                  <WalletCardSVG mt="5px" />
                  <Flex direction={'column'} gap="6px">
                    <HStack spacing="10px">
                      <Text fontWeight={500} fontSize={'16px'} color="matador_text.100">
                        Wallet
                      </Text>
                    </HStack>
                    <Text fontWeight={500} color="matador_form.label" fontSize={'13px'}>
                      Make payment from your wallet
                    </Text>
                  </Flex>
                </Flex>
              }
            />

            {!isAboveLimit && (
              <Flex
                bg="matador_background.100"
                border="1px solid"
                borderColor={'matador_border_color.100'}
                p="16px"
                cursor={isAboveLimit ? 'not-allowed' : 'pointer'}
                onClick={() => setPaymentStep('confirmCard')}
                w="full"
                pt="15px"
                pb="21px"
                gap="17px"
              >
                <DebitCardSVG mt={`5px`} />

                <Flex direction={'column'} gap="6px">
                  <HStack spacing="10px" flexWrap={`wrap`}>
                    <Text fontWeight={500} fontSize={'16px'} color="matador_text.100">
                      Debit/Credit Card
                    </Text>
                  </HStack>

                  <Text fontWeight={500} color="matador_form.label" fontSize={'13px'}>
                    Use a debit card to complete your payment
                  </Text>
                </Flex>
              </Flex>
            )}

            <Flex
              bg="matador_background.100"
              border="1px solid"
              borderColor={'matador_border_color.100'}
              p="16px"
              cursor={'pointer'}
              onClick={handleBankTransfer}
              w="full"
              pt="15px"
              pb="21px"
              gap="17px"
            >
              <AssetPaymentWithBankSVG />

              <Flex direction={'column'} gap="6px">
                <HStack spacing="10px" flexWrap={`wrap`}>
                  <Text fontWeight={500} fontSize={'16px'} color="matador_text.100">
                    Bank Transfer
                  </Text>
                </HStack>
                <Text fontWeight={500} color="matador_form.label" fontSize={'13px'}>
                  Transfer payment to a designated account
                </Text>
              </Flex>
            </Flex>
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
            modal={modal}
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
