import React, {useState} from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Flex,
  Text,
  Box,
  Image,
  Center,
  Textarea,
  HStack,
  useToast,
  Icon,
  useMediaQuery,
} from '@chakra-ui/react';
import processingLoader from '../images/processing-transaction.gif';
import successfulLoader from '../images/successful-transaction.gif';
import {CloseIcon} from '@chakra-ui/icons';
import {feedbackPurchase, getfeedbackHistory} from '../api/navbarMenu';
import {Button} from '/src/ui-lib';
import {useMutation, useQuery} from 'react-query';
import {RiStarFill} from 'react-icons/ri';
import {MdHistory} from 'react-icons/md';
import FeedbackHistory from './feedback/feedbackHistory';
import {BsArrowLeft} from 'react-icons/bs';
import {scrollBarStyles} from './common/ScrollBarStyles';
import {reactions} from './feedback/feedback';

const PurchaseFeedback = ({feedModal, equity}) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [screen, setScreen] = useState('');

  const toast = useToast();
  const feedbackQuery = useQuery(['feedbackhistory', equity?.id], () =>
    getfeedbackHistory(equity?.id)
  );
  const feedbackData = feedbackQuery?.data?.data?.message;

  const [isMobile] = useMediaQuery('(max-width:700px)');

  const submitFeedback = useMutation(formData => feedbackPurchase(formData, equity?.id), {
    onSuccess: async res => {
      await feedbackQuery.refetch();
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

  const handleSubmit = () => {
    if (!isValid)
      return toast({
        description: `Please leave a comment`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    const body = {
      feedback: message,
      rating: rating.toFixed(1),
    };
    return submitFeedback.mutate(body);
  };

  const handleResetModal = () => {
    setMessage('');
    setRating(0);
    submitFeedback.reset();
    feedModal.onClose();
  };

  const isValid = !!message.trim();

  return (
    <Drawer
      autoFocus={false}
      isCentered
      onCloseComplete={handleResetModal}
      blockScrollOnMount={true}
      onClose={feedModal?.onClose}
      isOpen={feedModal?.isOpen}
      placement={isMobile ? 'bottom' : 'right'}
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: '0', md: '24px !important'}}
        right={{base: '0', md: '24px !important'}}
        w="full"
        maxW={{base: '100vw', md: '475px'}}
        maxH={{base: '450px', md: '475px'}}
        bg={'card_bg'}
        boxShadow={{base: 'none', md: 'md'}}
      >
        <Box py="20px">
          <Box px="25px" borderBottom={`1px solid`} borderColor={`matador_border_color.100`}>
            {screen === 'history' ? (
              <Flex direction="row" justify="space-between" align={'center'}>
                <HStack spacing={'10px'}>
                  <Icon
                    color="text"
                    as={BsArrowLeft}
                    style={{cursor: 'pointer'}}
                    onClick={() => setScreen('')}
                    fontSize={'25px'}
                  />
                  <Text
                    color="text"
                    fontSize={{base: '18px', md: '20px'}}
                    fontWeight={{base: 500, md: 600}}
                  >
                    Feedback History
                  </Text>
                </HStack>
                <CloseIcon
                  color="text"
                  cursor="pointer"
                  fontSize="17px"
                  onClick={feedModal?.onClose}
                />
              </Flex>
            ) : (
              <Flex direction="row" justify="space-between" align={'flex-start'}>
                <Text
                  className="heading-text-regular"
                  color="text"
                  fontSize={'25px'}
                  fontWeight={500}
                >
                  Feedback
                </Text>
                <HStack gap="5px">
                  <CloseIcon
                    color="text"
                    cursor="pointer"
                    fontSize="17px"
                    onClick={feedModal?.onClose}
                    mt={2}
                  />
                </HStack>
              </Flex>
            )}
          </Box>

          {screen === 'history' ? (
            <FeedbackHistory setScreen={setScreen} feedbacks={feedbackData} />
          ) : (
            <Box overflowY="auto" css={scrollBarStyles}>
              {submitFeedback.isSuccess ? (
                <Center
                  px="30px"
                  mt="20px"
                  w="full"
                  h="full"
                  flexDirection={'column'}
                  textAlign={'center'}
                >
                  <Image alt="success" w="150px" h="150px" src={successfulLoader.src} mx="auto" />
                  <Text
                    color="text"
                    fontWeight={500}
                    fontSize={'28px'}
                    my="25px"
                    className="heading-text-regular"
                  >
                    Thank you
                  </Text>
                  <Text color="text" fontSize={'16px'} fontWeight="400">
                    {' '}
                    We appreciate your feedback
                  </Text>
                  <Button
                    fontWeight="500"
                    disabled={submitFeedback.isLoading}
                    loading={submitFeedback.isLoading}
                    onClick={handleResetModal}
                    w="full"
                    align="right"
                    color="custom_color.contrast"
                    bg="custom_color.color"
                    mt="30px"
                  >
                    OK
                  </Button>
                </Center>
              ) : submitFeedback.isLoading ? (
                <Center mt="20px" w="full" h="full" flexDirection={'column'}>
                  <Image alt="success" w="150px" h="150px" src={processingLoader.src} mx="auto" />
                  <Text
                    color="text"
                    fontWeight={500}
                    fontSize={'28px'}
                    my="25px"
                    className="heading-text-regular"
                  >
                    Sending feedback
                  </Text>
                  <Text color="text" fontSize={'16px'} fontWeight="400">
                    Wait a moment
                  </Text>
                </Center>
              ) : (
                <Box px={{base: '12px', md: '25px'}}>
                  <Box p={{base: '12px', md: '5px'}}>
                    <Flex justify={'space-between'} mt="17px">
                      {reactions.map((reaction, index) => (
                        <>
                          {rating === index + 1 ? (
                            <Center
                              onClick={() => setRating(index + 1)}
                              cursor={'pointer'}
                              // bg="#3D3D3D"
                              bg="matador_background.100 "
                              w="58px"
                              h="48px"
                              alignItems={'center'}
                              justifyContent={'center'}
                              key={reaction.text}
                              gap="auto"
                              flexDirection={'column'}
                              border={'1px solid '}
                              borderColor={'custom_color.color'}
                            >
                              {reaction.iconSelect ? (
                                reaction.iconSelect
                              ) : (
                                <Image alt="reaction" w="24px" h="24px" src={reaction.imgSelect} />
                              )}
                              <Text
                                fontSize={'10px'}
                                fontWeight={400}
                                //  color={'#fff'}
                                color={'custom_color.color'}
                              >
                                {reaction.text}
                              </Text>
                            </Center>
                          ) : (
                            <Center
                              onClick={() => setRating(index + 1)}
                              cursor={'pointer'}
                              bg="matador_background.100"
                              w="58px"
                              h="48px"
                              alignItems={'center'}
                              justifyContent={'center'}
                              key={reaction.text}
                              gap="auto"
                              flexDirection={'column'}
                              border={'1px solid'}
                              borderColor={'matador_border_color.100'}
                            >
                              {reaction.icon ? (
                                reaction.icon
                              ) : (
                                <Image alt="reaction" w="24px" h="24px" src={reaction.img} />
                              )}
                              <Text fontSize={'10px'} fontWeight={400} color={'matador_form.label'}>
                                {reaction.text}
                              </Text>
                            </Center>
                          )}
                        </>
                      ))}
                    </Flex>

                    <Text
                      color="text"
                      fontSize={{base: '12px', md: '14px'}}
                      fontWeight={500}
                      mb="10px"
                      mt="29px"
                    >
                      Drop a comment
                    </Text>
                    <Textarea
                      color={'text'}
                      onChange={e => setMessage(e.target.value)}
                      value={message}
                      resize="none"
                      border="0.3px solid "
                      borderColor="matador_border_color.100"
                      borderRadius={'0'}
                      w="full"
                      bg={`matador_background.100`}
                      h="105px"
                      _focus={{
                        outlineColor: 'matador_text.400',
                        outline: '.3px solid ',
                      }}
                    />
                    <Flex justify={'flex-end'} align={'center'} w="full">
                      <Button
                        fontWeight="500"
                        isDisabled={!message}
                        loading={submitFeedback.isLoading}
                        onClick={handleSubmit}
                        w="full"
                        align="right"
                        color="custom_color.contrast"
                        bg="custom_color.color"
                        mt="75px"
                        h="45px"
                        fontSize="14px"
                        // rounded="5px"
                      >
                        Submit
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default PurchaseFeedback;
