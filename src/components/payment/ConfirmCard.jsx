import React from 'react';
import {
  ModalContent,
  Flex,
  Text,
  Center,
  ModalCloseButton,
  Image,
  DrawerContent,
  DrawerCloseButton,
  Box,
  useToast,
} from '@chakra-ui/react';
import {Button, Spinner} from '../../ui-lib';
import processingLoader from '../../images/processing-transaction.gif';
import successfulLoader from '../../images/successful-transaction.gif';
import isMobile from '../../utils/extras';
import {formatToCurrency} from '../../utils';
import ExistingCard from './ExistingCard';
import {fetchSavedCards} from '@/api/payment';
import {useMutation, useQuery} from 'react-query';
import {makeeDepositToWallet} from '@/api/Wallet';
import openExternalUrl from '@/utils/openExternalLink';

const ConfirmCard = ({
  loading,
  success,
  proceed,
  amountToPay,
  setPaymentStep,
  selectedCard,
  setSelectedCard,
}) => {
  const toast = useToast();

  const {data: savedCards, isLoading} = useQuery(['cardSaved'], fetchSavedCards, {
    onSuccess: res => {
      const results = res?.data?.results;
      if (!results?.length) {
        return proceed();
      }
    },
    onError: err => {
      setPaymentStep('index');
    },
  });

  const card_load_fetch = isLoading || savedCards?.data?.results?.length === 0;

  return (
    <>
      {card_load_fetch ? (
        <Center w="full" minH="300px" h={`100%`}>
          <Spinner noAbsolute />
        </Center>
      ) : success ? (
        <Center mt="20px" w="full" h="fit-content" flexDirection={'column'}>
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
          <Text color="text" opacity={0.8} fontSize={{base: '14px', md: '16px'}} fontWeight="400">
            Your payment has been successfully processed
          </Text>
        </Center>
      ) : loading ? (
        <Center mt="20px" w="full" h="fit-content" flexDirection={'column'}>
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
        <Flex
          w="full"
          h="fit-content"
          direction="column"
          justify={'center'}
          align={'center'}
          gap="20px"
        >
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
            <Text color="text" fontSize={{base: '14px', md: '16px'}} fontWeight={400}>
              You will Pay
            </Text>
            <Text
              color="text"
              fontSize={{base: '28px', md: '33px'}}
              fontWeight={500}
              className="heading-text-regular"
            >
              {formatToCurrency(amountToPay)}
            </Text>
          </Flex>

          <ExistingCard
            proceed={proceed}
            selectedCard={selectedCard}
            savedCards={savedCards?.data?.results}
            setSelectedCard={setSelectedCard}
          />

          <Flex mt="27px" gap="26px" justify="space-between" align="center" w="full">
            <Button
              border="1px solid"
              borderColor="matador_border_color.100 !important"
              color="text"
              bg="matador_background.100"
              h="49px"
              w={{base: '50%', md: '250px'}}
              onClick={() => setPaymentStep('index')}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedCard}
              isDisabled={!selectedCard}
              onClick={proceed}
              w={{base: '50%', md: '250px'}}
              color="custom_color.contrast"
              bg="custom_color.color"
              h="49px"
            >
              Proceed
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default ConfirmCard;
