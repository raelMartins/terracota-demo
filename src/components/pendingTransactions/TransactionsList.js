import {Image, VStack, Text, Flex, Box} from '@chakra-ui/react';
import {Spinner} from '../../ui-lib';
import {formatDateToString} from '../../utils/formatDate';
import ErrorState from '../appState/error-state';
import EmptyState from '../appState/empty-state';
import {useEffect} from 'react';

const TransactionsList = ({
  assetData,
  drawer,
  isError,
  isLoading,
  setType,
  customScrollbarStyles,
  setAsset,
  setAmountToPay,
}) => {
  const handleManageAssets = property => {
    setAsset(property);

    // pure outright purchase
    if (property?.type == 'WHOLE' && !property?.payment_plan && !property?.co_owners?.length) {
      setAmountToPay(Number(property?.total_unit_price));
      setType('summary');
    }
    // pure payment plan
    if (property?.type == 'WHOLE' && property?.payment_plan && !property?.co_owners?.length) {
      setAmountToPay(property?.payment_plan?.initial_deposit_in_value);
      setType('summary');
    }
    // co-ownership
    if (property?.co_owners?.length) {
      // co-ownership with outright
      if (property?.type == 'WHOLE' && !property?.payment_plan) {
        // setAmountToPay(Number(property?.total_unit_price))
        setType('coOwn');
      }
      // co-ownership with payment plan
      if (property?.type == 'WHOLE' && property?.payment_plan) {
        // setAmountToPay(property?.payment_plan?.initial_deposit_in_value)
        setType('coOwn');
      }
    }
    // property?.type == 'FRACTIONAL' && router.push(`/asset/fractional/${property?.id}?status=${paymentStatus}`);
  };

  //using this to automatically open the pending transaction summary if there is only one offer
  useEffect(() => {
    if (assetData?.length === 1) {
      handleManageAssets(assetData?.[0]);
    }
  }, [assetData]);

  return (
    <Box h={'fit-content'} overflowY="auto" __css={customScrollbarStyles}>
      {isLoading ? (
        <VStack w="80vw">
          <Spinner />
        </VStack>
      ) : isError ? (
        <ErrorState />
      ) : (
        <>
          {assetData?.length > 0 ? (
            <VStack align="stretch" spacing={'12px'}>
              {(assetData || [])?.map((equity, idx) => (
                <Flex
                  key={idx}
                  onClick={() => handleManageAssets(equity)}
                  cursor="pointer"
                  w="full"
                  px="24px"
                  bg="matador_background.100"
                  py="16px"
                  gap="12px"
                  align={'center'}
                  border="1px solid"
                  borderRadius="4px"
                  borderColor={'matador_border_color.100'}
                  position={'relative'}
                >
                  <Box position={'absolute'} p="2.316px 4.631px" bg="tag_bg" top={0} right={0}>
                    <Text
                      fontSize={'10px'}
                      fontWeight={400}
                      color={'text'}
                    >{`Expiration Date: ${formatDateToString(equity?.offer_expires)}`}</Text>
                  </Box>
                  <Image
                    h="60px"
                    w="60px"
                    borderRadius={'5px'}
                    alt="next_image"
                    src={equity?.project?.photos[0]?.photo}
                  />
                  <VStack align="stretch" spacing={'8px'} maxW="330px">
                    <Text fontSize={'15px'} fontWeight="500" color="text">
                      {equity?.project?.name}
                    </Text>
                    <Text fontSize={'12px'} fontWeight="500" color="text">
                      {equity?.unit?.unit_title}
                    </Text>
                  </VStack>
                </Flex>
              ))}
            </VStack>
          ) : (
            <EmptyState text={`No pending transactions yet`} />
          )}
        </>
      )}
    </Box>
  );
};

export default TransactionsList;
