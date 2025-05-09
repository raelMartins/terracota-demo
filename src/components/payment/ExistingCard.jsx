import {Flex, HStack, Image, Text, VStack, Box, Center} from '@chakra-ui/react';
import {Button} from '../../ui-lib/ui-lib.components';
import cardImg from '../../images/icons/card.svg';
import {CheckIcon} from '@chakra-ui/icons';
import {BiPlus} from 'react-icons/bi';
import EmptyState from '../appState/empty-state';

const ExistingCard = ({savedCards, selectedCard, setSelectedCard, proceed}) => {
  return (
    <Box w="full" h="fit-content">
      <Text color={`text`} mt={{base: '12px', md: '16px'}}>
        Select Card
      </Text>
      <VStack w="full" spacing="10px" mt="6px" align={'stretch'}>
        <Box mb={{base: '16px', md: '40px'}}>
          {savedCards?.length ? (
            <VStack
              spacing={{base: '6px', md: '10px'}}
              align={'stretch'}
              overflowY="auto"
              maxH={'35vh'}
            >
              {savedCards?.map(card => (
                <Flex
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  cursor="pointer"
                  border={'1px solid'}
                  borderColor={
                    selectedCard?.id === card.id ? 'custom_color.color' : 'matador_border_color.100'
                  }
                  bg={'custom_color.background'}
                  align={'flex-start'}
                  _hover={{border: '1px solid', borderColor: 'custom_color.color'}}
                  direction={'row'}
                  px="14px"
                  py="16px"
                  borderRadius={'2px'}
                  justify="space-between"
                >
                  <HStack spacing={'14px'} align={'flex-start'}>
                    <Image alt="next_image" src={cardImg.src} />
                    <VStack align={'stretch'} spacing={0}>
                      <Text
                        fontSize={{base: '14px', md: '18px'}}
                        fontWeight={{base: '400', md: '500'}}
                        color="text"
                      >
                        {card?.bank}
                      </Text>
                      <Text
                        fontSize={{base: '14px', md: '18px'}}
                        fontWeight={{base: '400', md: '500'}}
                      >
                        **** ****{card?.last4}
                      </Text>
                    </VStack>
                  </HStack>
                  <Center
                    w="16px"
                    h="16px"
                    borderRadius={'full'}
                    border="1px solid"
                    borderColor={'custom_color.color'}
                    bg={selectedCard?.id === card.id ? 'custom_color.color' : 'white'}
                  >
                    <CheckIcon color={'white'} fontSize={'10px'} />
                  </Center>
                </Flex>
              ))}
            </VStack>
          ) : (
            <EmptyState
              icon={<Image w="auto" h="50px" opacity={0.5} src={cardImg.src} />}
              noHeader
              text={'No card has been added yet'}
              height={{base: '50px', md: '50px'}}
              maxH={{base: '50px', md: '50px'}}
              minH={{base: '50px', md: '50px'}}
            />
          )}
        </Box>
        <Button
          alignSelf="flex-end"
          h="48px"
          border="1px solid !important"
          borderColor="custom_color.color"
          leftIcon={<BiPlus size={20} />}
          onClick={proceed}
          w="145px"
          bg="transparent"
          color="custom_color.color"
        >
          Add Card
        </Button>
      </VStack>
    </Box>
  );
};

export default ExistingCard;
