import React, {useState} from 'react';
import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
  useToast,
  Spinner as ChakraSpinner,
  Center,
  useMediaQuery,
  Stack,
} from '@chakra-ui/react';
import {themeStyles} from '../../../theme';
import {Button, Spinner} from '../../../ui-lib';
import {RemoveBankAccount} from '../../../api/Settings';
import {useMutation, useQuery} from 'react-query';
import {makeeDepositToWallet} from '../../../api/Wallet';
import debitCard from '../../../images/icons/debit-card.svg';
import EmptyState from '../../../components/appState/empty-state';
import {storeName} from '../../../constants/routes';
import {fetchSavedCards} from '../../../api/payment';
import cardEmptyState from '../../../images/icons/card-empty-state.svg';
import openExternalUrl from '../../../utils/openExternalLink';
import plusIcon from '../../../images/icons/plus-icon.svg';
import {DebitCardSVG} from '../../../components/assets/svgs';
import {IoMdAdd} from 'react-icons/io';
import {IoAdd} from 'react-icons/io5';

const Payments = () => {
  const toast = useToast();
  const {data, isLoading: fetchingCard, refetch} = useQuery(['cardSaved'], fetchSavedCards);

  const {mutate: removeCardMutate, isLoading: removingCard} = useMutation(
    values => RemoveBankAccount(values),
    {
      onSuccess: async res => {
        toast({
          description: `Account removed successfully`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        await refetch();
      },
      onError: err => {
        toast({
          title: err?.message === 'Network Error' ? 'Network Error' : 'Oops something went wrong',
          description: `${err?.response?.data?.message ?? 'please check your network connection'}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    }
  );
  const MAKE_DEPOSITS_MUTATION = useMutation(formData => makeeDepositToWallet(formData), {
    onSuccess: res => {
      const link = res?.data?.data?.data?.link;
      if (link) {
        openExternalUrl(link, '_blank');
      }
    },
    onError: err => {
      toast({
        title: 'Oops...',
        description: `${
          err?.response?.data?.message ??
          err?.response?.message ??
          err?.response?.data[0] ??
          'Something went wrong'
        }`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleRemove = id => {
    removeCardMutate(id);
  };

  const handleMakeDeposits = () => {
    const body = {
      amount: 50,
      channel: 'card',
      store: storeName,
    };
    MAKE_DEPOSITS_MUTATION.mutate(body);
  };

  const [isNotMobile] = useMediaQuery('(min-width: 768px)');
  return (
    <Stack
      py={{base: '18px', md: '32px'}}
      borderRadius={'2px'}
      mt="30px"
      px={{base: '15px', md: '48px'}}
      border="1px solid"
      borderColor={`matador_border_color.100`}
      boxShadow={
        isNotMobile
          ? '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)'
          : 'none'
      }
      flex={1}
    >
      <Text
        className="heading-text-regular"
        color="text"
        textTransform={'uppercase'}
        fontSize={{base: '16px', md: '23px'}}
        fontWeight={{base: '500', md: '500'}}
      >
        Payment Methods
      </Text>

      {fetchingCard ? (
        <Center w="full" h="30vh">
          <Spinner noAbsolute />
        </Center>
      ) : (
        <VStack spacing="6px" align={'stretch'} mt="24px">
          {data?.data?.results?.length ? (
            <>
              {data?.data?.results.map((card, index) => (
                <Flex
                  key={card?.id}
                  direction={'row'}
                  px="14px"
                  py="16px"
                  cursor="pointer"
                  justify="space-between"
                  bg={`matador_background.200`}
                  border="0.3px solid"
                  borderColor={`matador_border_color.100`}
                  borderRadius={{base: '4px', md: '2px'}}
                  align="center"
                >
                  <HStack spacing={'14px'}>
                    {/* <Image alt="next_image" src={debitCard.src} /> */}
                    <DebitCardSVG />
                    <VStack align={'stretch'} spacing={0}>
                      <Text {...themeStyles.textStyles.sl5} fontWeight={500} color="text">
                        {card?.bank}
                      </Text>
                      <Text {...themeStyles.textStyles.sl5} letterSpacing="-0.13px" color="text">
                        **** ****{card?.last4}
                      </Text>
                    </VStack>
                  </HStack>
                  <Text
                    cursor={'pointer'}
                    onClick={() => handleRemove(card.id)}
                    color={'#D92626'}
                    textDecoration={'underline'}
                    _disabled={removingCard}
                    h="max-content"
                    pr={3}
                  >
                    {removingCard ? <ChakraSpinner /> : 'Remove'}
                  </Text>
                </Flex>
              ))}
              <Flex
                w="full"
                direction={'row'}
                mt={{base: '60px !important', md: '24px !important'}}
                justify={'flex-end'}
                align={'end'}
              >
                <Button
                  onClick={handleMakeDeposits}
                  fontWeight="500"
                  leftIcon={<IoAdd fontSize={`20px`} />}
                  mx="auto"
                  borderRadius={{base: '4px', md: '0px'}}
                  color="custom_color.contrast"
                  bg="custom_color.color"
                  w={{base: 'full', md: '275px'}}
                  fontSize={16}
                  h="48px"
                  rounded={0}
                >
                  {MAKE_DEPOSITS_MUTATION?.isLoading ? <ChakraSpinner /> : 'Add Card'}
                </Button>
              </Flex>
            </>
          ) : (
            <Center w="full" flexDirection={'column'} mt="24px">
              <EmptyState
                icon={<Image src={cardEmptyState.src} boxSize={{base: '80px', lg: '120px'}} />}
                text={'No payment method added yet'}
                heading={'  '}
                height="150px"
              />
              <Button
                onClick={handleMakeDeposits}
                fontWeight="500"
                color="custom_color.contrast"
                leftIcon={<IoMdAdd fontSize={`20px`} />}
                mx="auto"
                borderRadius={{base: '4px', md: '0px'}}
                bg="custom_color.color"
                w={{base: 'full', md: '275px'}}
                fontSize={16}
                h="48px"
                rounded={0}
              >
                {MAKE_DEPOSITS_MUTATION?.isLoading ? <ChakraSpinner /> : 'Add Card'}
              </Button>
            </Center>
          )}
        </VStack>
      )}
    </Stack>
  );
};

export default Payments;
