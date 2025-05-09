import React, {useState} from 'react';
import {Flex, HStack, Image, Text, VStack, Box, Center, Stack, useTheme} from '@chakra-ui/react';
import withdrawalIcon from '../../images/withdrawal-transaction.svg';
import withdrawalIconLight from '../../images/withdrawal-transaction-light.svg';
import {Button, CustomizableButton, Spinner} from '../../ui-lib/ui-lib.components';
import {useQuery, useQueryClient} from 'react-query';
import {fetchStoreWalletTxns, fetchWalletCurrentBalance} from '../../api/Wallet';
import {formatDateToString} from '../../utils/formatDate';
import {formatToCurrency} from '../../utils';
import {appCurrentTheme} from '../../utils/localStorage';
import {LIGHT} from '../../constants/names';
import {CloseIcon} from '@chakra-ui/icons';
import {IoEyeOffOutline, IoEyeOutline} from 'react-icons/io5';
import EmptyState from '../appState/empty-state';
import {scrollBarStyles} from '../common/ScrollBarStyles';
import ErrorState from '../appState/error-state';
import useGetSession from '../../utils/hooks/getSession';
import {PaymentAccess} from '../payment/PaymentAccess';

export const WalletContent = ({setPage, onWalClose, avatar}) => {
  const {sessionData: loggedinUser} = useGetSession('loggedIn');

  const theme = useTheme();
  const WALLET__ACCOUNT_BALANCE = useQuery(
    ['fetchWalletCurrentBalance'],
    fetchWalletCurrentBalance,
    {refetchInterval: 2 * 60 * 1000}
  );
  const Account_balance = WALLET__ACCOUNT_BALANCE?.data?.data?.data?.naira_balance;
  const WALLET__TXNS = useQuery(['fetchStoreWalletTxns'], fetchStoreWalletTxns, {
    refetchInterval: 2 * 60 * 1000,
  });
  const [showPrice, setShowPrice] = useState(false);
  const [isRefetching, setIsrefetching] = useState(false);
  const queryClient = useQueryClient();
  let TIME_OF_DAY = '';

  const handleRefresh = async () => {
    setIsrefetching(true);
    await queryClient.invalidateQueries(['fetchWalletCurrentBalance']); // Invalidate the 'myData' query

    await WALLET__ACCOUNT_BALANCE.refetch();
    setIsrefetching(false);
  };

  let time = new Date().getHours();

  // if (time >= 5 && time < 12) {
  if (time >= 0 && time < 12) {
    TIME_OF_DAY = 'morning';
  } else if (time >= 12 && time < 17) {
    TIME_OF_DAY = 'afternoon';
    // } else if (time >= 17 || time < 5) {
  } else if (time >= 17) {
    TIME_OF_DAY = 'evening';
  }

  return (
    <Stack
      px={{base: 0}}
      pb="20px"
      bg="card_bg"
      // minH={'fit-content'}
      overflowY="hidden"
      // css={scrollBarStyles}
    >
      <Center
        flexDirection="column"
        bg="background"
        w="full"
        h="300px"
        px="25px"
        pt="32px"
        pb="39px"
        gap="24px"
        border={'none'}
      >
        <Flex align="center" w="full" justify={'space-between'}>
          <HStack gap="4px">
            <Text
              fontWeight={400}
              fontSize={{base: 16, lg: 19}}
              letterSpacing="0.2px"
              className="heading-text-regular"
              textTransform={`capitalize`}
            >
              Good {TIME_OF_DAY}, {loggedinUser?.first_name}
            </Text>
          </HStack>
          <CloseIcon
            fontWeight={'200'}
            fontSize={'12px'}
            cursor="pointer"
            display={{base: 'none', lg: 'flex'}}
            onClick={onWalClose}
          />
        </Flex>
        <HStack align="center" spacing={'10px'}>
          <Box className="heading-text-regular">
            <Text
              textAlign={'center'}
              fontSize={'14px'}
              fontWeight={500}
              color="text"
              letterSpacing="0.52px"
            >
              Current Balance
            </Text>
            <HStack spacing="16px">
              {showPrice ? (
                <Text
                  color="text"
                  fontSize={{base: '40px', lg: '32px'}}
                  fontWeight={'600'}
                  noOfLines={1}
                >
                  {Account_balance ? formatToCurrency(Account_balance) : '0.00'}
                </Text>
              ) : (
                <Text
                  color="text"
                  fontSize={{base: '40px', lg: '32px'}}
                  fontWeight={'600'}
                  noOfLines={1}
                  pt={4}
                >
                  ******
                </Text>
              )}
              <Box cursor="pointer" onClick={() => setShowPrice(!showPrice)} fontSize={22}>
                {showPrice ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </Box>
            </HStack>
          </Box>
        </HStack>
        <HStack justify={{base: 'center', lg: 'space-between'}} align={'center'} w="full">
          <PaymentAccess
            content={
              <Button
                w={'172px'}
                h={'49px'}
                color="custom_color.contrast"
                bg="custom_color.color"
                fontSize="16px"
                fontWeight={{base: 500, lg: 400}}
                onClick={() => setPage('deposit')}
                gap="8px"
              >
                <Text fontSize={{base: '16px', lg: '18px'}}> Deposit</Text>
              </Button>
            }
          />
          <PaymentAccess
            checkWithdrawal
            content={
              <Button
                w={'172px'}
                h={'49px'}
                fontSize="16px"
                fontWeight={{base: 500, lg: 400}}
                onClick={() => setPage('withdrawal')}
                border="1px solid"
                borderColor="custom_color.color !important"
                color="custom_color.color"
                bg="custom_color.background"
                gap="8px"
              >
                <Text fontSize={{base: '16px', lg: '18px'}}>Withdraw</Text>
              </Button>
            }
          />
        </HStack>
      </Center>
      <Stack
        px={{base: '12px', lg: '24px'}}
        pt={{base: 0, lg: 2}}
        bg="card_bg"
        w="full"
        alignSelf={'end'}
        justifySelf={'end'}
        overflowY="auto"
        flex={`1`}
      >
        <Box>
          <Text
            fontSize={{base: 16, lg: 20}}
            letterSpacing="0.16px"
            mt="10px"
            className="heading-text-regular"
          >
            Transaction History
          </Text>
          <VStack spacing={{base: '6px', lg: '10px'}} align="stretch" mt="14px">
            {WALLET__TXNS?.isLoading ? (
              <Center height={{base: `300px`, md: `200px`}} w="full">
                <Spinner noAbsolute />
              </Center>
            ) : WALLET__TXNS?.isError ? (
              <ErrorState height={{base: `300px`, md: `150px`}} imageSize={`100px`} />
            ) : (
              <>
                {WALLET__TXNS?.data?.data?.message?.length > 0 ? (
                  <>
                    {WALLET__TXNS?.data?.data?.message.map((item, i) => {
                      let type = item.direction;
                      return (
                        <Flex
                          direction="row"
                          justify={'space-between'}
                          align="center"
                          key={item?.id}
                          py="12px"
                        >
                          <HStack spacing="14px">
                            <Flex
                              justify="center"
                              align="center"
                              w="34px"
                              h="34px"
                              borderRadius={'full'}
                            >
                              <Image
                                alt="next_image"
                                transform={type === 'credit' ? 'rotate(180deg)' : ''}
                                src={
                                  appCurrentTheme === LIGHT
                                    ? withdrawalIcon.src
                                    : withdrawalIconLight.src
                                }
                              />
                            </Flex>
                            <VStack align="stretch" spacing="3px" direction={'column'}>
                              <Text
                                color="text"
                                fontSize={'14px'}
                                fontWeight={{base: 600, lg: 700}}
                              >
                                {type == 'debit'
                                  ? 'Withdrawal'
                                  : type == 'credit'
                                  ? 'Deposit'
                                  : null}
                              </Text>
                              <Text color="text" fontSize={11} fontWeight={400} opacity={0.6}>
                                {item?.successful_at && formatDateToString(item?.successful_at)}
                              </Text>
                            </VStack>
                          </HStack>

                          <VStack align="flex-end" spacing="3px" direction={'column'}>
                            <Text
                              color="text"
                              fontSize={{base: '12px', lg: '14px'}}
                              fontWeight={{base: '600', lg: '700'}}
                            >
                              {type == 'debit' ? '-' : type == 'credit' ? '+' : null}{' '}
                              {formatToCurrency(item?.amount) || '0'}
                            </Text>
                            <Text
                              color="text"
                              fontSize={{base: '10px', lg: '11px'}}
                              fontWeight={400}
                              opacity={0.6}
                            >
                              {formatToCurrency(item?.balance_before_transaction) || '0'}
                            </Text>
                          </VStack>
                        </Flex>
                      );
                    })}
                  </>
                ) : (
                  <EmptyState
                    icon
                    fontFamily="Euclid Circular B"
                    height={'150px'}
                    minH={'150px'}
                    text={'No transactions yet'}
                    textSize={16}
                    headerStyle={{fontSize: 18, fontWeight: 700}}
                  />
                )}
              </>
            )}
          </VStack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default WalletContent;
