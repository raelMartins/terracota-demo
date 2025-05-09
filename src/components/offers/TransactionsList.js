import {Image, VStack, Text, Flex, Box} from '@chakra-ui/react';
import EmptyState from '../appState/empty-state';
import {formatToCurrency} from '../../utils';
import ErrorState from '../appState/error-state';
import {Spinner} from '../../ui-lib';
import {formatDateToString} from '../../utils/formatDate';
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
    if (property?.type == 'WHOLE' && !property?.payment_plan && !property?.co_owners?.length) {
      setAmountToPay(Number(property?.total_unit_price));
    }
    if (property?.type == 'WHOLE' && property?.payment_plan && !property?.co_owners?.length) {
      setAmountToPay(property?.payment_plan?.initial_deposit_in_value);
    }
    setType('payment_plan');
  };

  //using this to automatically open the offer summary if there is only one offer
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
              {(assetData || [])?.map((equity, i) => (
                <Flex
                  key={i}
                  onClick={() => handleManageAssets(equity)}
                  cursor="pointer"
                  w="full"
                  px="24px"
                  bg="background"
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
                      color={'matador_form.label'}
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
