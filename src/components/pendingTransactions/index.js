import {useState} from 'react';
import TransactionsList from './TransactionsList';
import SummaryDrawer from './Summary';
import PaymentDrawer from './payment';
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
import isMobile from '../../utils/extras';
import Breakdown from './Breakdown';
import CoOwnSummary from './CoOwnSummary';
import CoOwnersList from './CoOwnersList';
import {useQuery} from 'react-query';
import {fetchListOfCoowners} from '../../api/co_owners';

import {ChevronLeftIcon, CloseIcon} from '@chakra-ui/icons';
import useGetSession from '../../utils/hooks/getSession';
import {PaymentFlowContent} from '../payment/PaymentFlowContent';

const PendingTransactions = ({assetData, drawer, isError, isLoading}) => {
  const [type, setType] = useState('list');
  const [asset, setAsset] = useState(null);
  const [amount, setAmountToPay] = useState('');
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const {data, isLoading: coOwnerLoading} = useQuery(
    ['coowners', asset?.id],
    () => fetchListOfCoowners(asset?.id),
    {enabled: !!asset?.id}
  );

  const coowners = data?.data?.data ?? [];
  const theHost = coowners?.length
    ? coowners.find(item => item?.host?.id === item?.invitee?.id)
    : null;
  const isTheHost = coowners?.length
    ? coowners.find(item => item?.host?.id == LoggedinUser?.user?.id)
    : null;

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

  const handleBackFromBreakdown = () => {
    if (asset?.co_owners?.length) setType('coOwn');
    else setType('summary');
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
          // w="full"
          // zIndex={200}
          borderBottom={`1px solid`}
          borderColor={`matador_border_color.100`}
        >
          <Flex w="full" h="20px" justify={'space-between'} align={'center'}>
            {type === 'list' ? (
              <Text
                color="text"
                fontSize={'23px'}
                fontWeight={400}
                className="heading-text-regular"
              >
                Pending Transaction
              </Text>
            ) : type === 'breakdown' ? (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  onClick={handleBackFromBreakdown}
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
            ) : type === 'coOwnersList' ? (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  onClick={() => setType('coOwn')}
                  fontSize={'35px'}
                  color={'text'}
                />
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Co-owners {asset?.offer_started ? '(payment)' : '(acceptance)'}
                </Text>
              </HStack>
            ) : type === 'summary' || type === 'coOwn' ? (
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
            ) : (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  // onClick={() => setType('list')}
                  onClick={() => setType('summary')}
                  fontSize={'35px'}
                  color={'text'}
                />
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Payment Method
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
              amount={amount}
              coowners={coowners}
              coOwnerLoading={coOwnerLoading}
            />
          ) : type === 'summary' ? (
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
              amount={amount}
              coowners={coowners}
              coOwnerLoading={coOwnerLoading}
            />
          ) : type === 'coOwn' ? (
            <CoOwnSummary
              isTheHost={isTheHost}
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
              amount={amount}
              coowners={coowners}
              coOwnerLoading={coOwnerLoading}
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
              amountToPay={amount}
              coowners={coowners}
              coOwnerLoading={coOwnerLoading}
            />
          ) : type === 'coOwnersList' ? (
            <CoOwnersList
              theHost={theHost}
              isTheHost={isTheHost}
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
              amountToPay={amount}
              coowners={coowners}
              coOwnerLoading={coOwnerLoading}
            />
          ) : (
            <PaymentFlowContent
              paymentType={`deposit`}
              amountToPay={amount}
              modal={drawer}
              paymentDetails={{
                amount_to_pay: Number(amount),
                equity_id: asset?.id,
                is_coown: false,
                pending: true,
              }}
              asset_id={asset?.project?.id}
            />
          )}
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

export default PendingTransactions;
