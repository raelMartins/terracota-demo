import {useState} from 'react';
import TransactionsList from './TransactionsList';
import SummaryDrawer from './Summary';
import PaymwntDrawer from './payment';
import Breakdown from './Breakdown';
import {RxCross1} from 'react-icons/rx';
import {
  DrawerContent,
  Flex,
  Box,
  Text,
  Drawer,
  DrawerOverlay,
  HStack,
  Icon,
  DrawerHeader,
} from '@chakra-ui/react';
import {BsArrowLeft} from 'react-icons/bs';
import isMobile from '../../utils/extras';
import {ChevronLeftIcon, CloseIcon} from '@chakra-ui/icons';
import {PaymentFlowContent} from '../payment/PaymentFlowContent';

const PendingTransactions = ({assetData, drawer, isError, isLoading}) => {
  const [type, setType] = useState('list');
  const [asset, setAsset] = useState(null);
  const [amountToPay, setAmountToPay] = useState('');

  const customScrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '4px',
      borderRadius: '16px',
    },
    '&::-webkit-scrollbar-track': {
      borderRadius: '16px',
      WebkitBoxShadow: 'inset 0 0 6px rgba(255, 255, 255, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      // outline: "1px solid slategrey", // You can include this line if needed
    },
  };

  const handleClose = () => {
    setType('list');
    setAsset(null);
    setAmountToPay('');
  };

  return (
    <Drawer
      onCloseComplete={handleClose}
      blockScrollOnMount
      scrollBehavior="inside"
      onClose={drawer?.onClose}
      isOpen={drawer?.isOpen}
      placement={isMobile ? 'bottom' : 'right'}
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: 'unset', md: '24px !important'}}
        right={{base: 'unset', md: '24px !important'}}
        w="full"
        bg="matador_background.200"
        px="0"
        position={'relative'}
        maxW={{base: '100vw', md: '450px'}}
      >
        <DrawerHeader
          px={{base: '14px', md: '18px'}}
          py={{base: '18px', md: '26px'}}
          // position={'absolute'}
          // top="0"
          // right={0}
          w="full"
          zIndex={200}
          borderBottom={`1px solid`}
          borderColor={`matador_border_color.100 !important`}
        >
          <Flex w="full" h="20px" justify={'space-between'} align={'center'}>
            {type === 'list' ? (
              <Text
                color="text"
                fontSize={'23px'}
                fontWeight={400}
                className="heading-text-regular"
              >
                Offers
              </Text>
            ) : type === 'payment_plan' ? (
              <HStack align={'center'}>
                {assetData?.length === 1 ? null : (
                  <ChevronLeftIcon
                    cursor={'pointer'}
                    onClick={() => setType('list')}
                    fontSize={'35px'}
                    color={'text'}
                  />
                )}
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Summary
                </Text>
              </HStack>
            ) : type === 'breakdown' ? (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  onClick={() => setType('payment_plan')}
                  fontSize={'35px'}
                  color={'text'}
                />
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Payment Breakdown
                </Text>
              </HStack>
            ) : (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  onClick={() => setType('payment_plan')}
                  fontSize={'35px'}
                  color={'text'}
                />
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Payment
                </Text>
              </HStack>
            )}
            <CloseIcon
              cursor={'pointer'}
              fontSize={'14px'}
              color="text"
              onClick={drawer?.onClose}
            />
          </Flex>
        </DrawerHeader>

        {/* <Box pt={{base: '60px', md: '75px'}} w="full" h={'fit-content'} overflowY="auto"> */}
        <Flex
          flexDir={`column`}
          w="full"
          maxH={'75vh'}
          minH={'50vh'}
          // overflowY={`auto`}
          px={{base: '18px', md: '24px'}}
          pt={`10px`}
          pb={`30px`}
        >
          {' '}
          {type === 'list' ? (
            <TransactionsList
              assetData={assetData}
              drawer={drawer}
              isError={isError}
              isLoading={isLoading}
              type={type}
              setType={setType}
              asset={asset}
              setAsset={setAsset}
              customScrollbarStyles={customScrollbarStyles}
              setAmountToPay={setAmountToPay}
              amountToPay={amountToPay}
            />
          ) : type === 'payment_plan' ? (
            <SummaryDrawer
              assetData={assetData}
              drawer={drawer}
              isError={isError}
              isLoading={isLoading}
              type={type}
              setType={setType}
              asset={asset}
              setAsset={setAsset}
              customScrollbarStyles={customScrollbarStyles}
              setAmountToPay={setAmountToPay}
              amountToPay={amountToPay}
            />
          ) : type === 'breakdown' ? (
            <Breakdown
              assetData={assetData}
              drawer={drawer}
              isError={isError}
              isLoading={isLoading}
              type={type}
              setType={setType}
              asset={asset}
              setAsset={setAsset}
              customScrollbarStyles={customScrollbarStyles}
              setAmountToPay={setAmountToPay}
              amountToPay={amountToPay}
            />
          ) : (
            <PaymentFlowContent
              paymentType={`deposit`}
              amountToPay={amountToPay}
              modal={drawer}
              paymentDetails={{
                amount_to_pay: Number(amountToPay),
                equity_id: asset?.id,
                is_coown: false,
                pending: true,
              }}
              asset_id={asset?.project?.id}
            />
          )}
        </Flex>
        {/* </Box> */}
      </DrawerContent>
    </Drawer>
  );
};

export default PendingTransactions;
