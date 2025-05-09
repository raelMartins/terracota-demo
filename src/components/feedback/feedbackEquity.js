import {useState} from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Flex,
  Text,
  Box,
  Image,
  Center,
  Textarea,
  HStack,
  useToast,
} from '@chakra-ui/react';
import processingLoader from '../../images/processing-transaction.gif';
import {CloseIcon} from '@chakra-ui/icons';
import {feedbackEquity, getfeedbackHistory} from '../../api/navbarMenu';
import {Button} from '../../ui-lib';
import {useMutation, useQuery} from 'react-query';
import FeedbackHistory from './feedbackHistory';
import {scrollBarStyles} from '../common/ScrollBarStyles';
import {BsArrowLeft} from 'react-icons/bs';

import {reactions} from './feedback';

const FeedbackEquity = ({feedModal, equity, refetch}) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [screen, setScreen] = useState('');
  const toast = useToast();
  const feedbackQuery = useQuery(['feedbackhistory', equity?.id], () =>
    getfeedbackHistory(equity?.id)
  );
  const feedbackData = feedbackQuery?.data?.data?.message;

  const submitFeedback = useMutation(formData => feedbackEquity(formData, equity?.id), {
    onSuccess: async res => {
      await feedbackQuery.refetch();
      await refetch();
      toast({
        title: `Thank you`,
        description: 'We appreciate your feedback',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      setMessage('');
      setRating(0);
      feedModal.onClose();
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
      type: 'inspection',
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
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: 'unset', md: '24px !important'}}
        right={{base: 'unset', md: '24px !important'}}
        w="full"
        minH="20vh"
        h={'fit-content'}
        p="16px"
        maxW={'450px'}
        maxH={'530px'}
        bg="matador_background.200"
        px="0"
      >
        <Box>
          <Box
            py="10px"
            px={{base: '15px', md: '25px'}}
            borderBottom="1px solid"
            borderColor={`matador_border_color.100`}
          >
            {screen === 'history' ? (
              <Flex direction="row" justify="space-between" align={'center'}>
                <HStack spacing={'15px'}>
                  <BsArrowLeft
                    style={{cursor: 'pointer'}}
                    onClick={() => setScreen('')}
                    size={25}
                  />
                  <Text
                    color="text"
                    fontSize={{base: '18px', md: '20px'}}
                    fontWeight={{base: 500, md: 600}}
                    className="heading-text-regular"
                  >
                    Feedback History
                  </Text>
                </HStack>
                <CloseIcon
                  color="red"
                  cursor="pointer"
                  fontSize="17px"
                  onClick={feedModal?.onClose}
                  mt="10px !important"
                />
              </Flex>
            ) : (
              <Flex direction="row" justify="space-between" align={'flex-start'}>
                <Text
                  className="heading-text-regular"
                  color="text"
                  fontSize={'24px'}
                  fontWeight={500}
                >
                  Inspection Feedback
                </Text>
                <HStack gap="5px">
                  {/* {feedbackData?.length && (
                    <Center
                      w="36px"
                      h="36px"
                      borderRadius={'8px'}
                      border={'0.672px solid'}
                      borderColor={'text'}
                    >
                      <Icon
                        as={MdHistory}
                        color="text"
                        fontSize={'20px'}
                        cursor="pointer"
                        onClick={() => setScreen('history')}
                      />
                    </Center>
                  )} */}
                  <CloseIcon
                    color="text"
                    cursor="pointer"
                    fontSize="14px"
                    onClick={feedModal?.onClose}
                    mt={{md: 2}}
                  />
                </HStack>
              </Flex>
            )}
          </Box>
          {screen === 'history' ? (
            <FeedbackHistory setScreen={setScreen} feedbacks={feedbackData} />
          ) : (
            <Box overflowY="auto" css={scrollBarStyles}>
              {/* {submitFeedback.isSuccess ? (
                <Center
                  px="30px"
                  mt="20px"
                  w="full"
                  h="400px"
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
                    mt="50px"
                  >
                    OK
                  </Button>
                </Center>
              ) :  */}
              {submitFeedback.isLoading ? (
                <Center mt="20px" w="full" h="400px" flexDirection={'column'}>
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
                  <Box>
                    <Text
                      color="text"
                      fontSize={{base: '13px', md: '16px'}}
                      fontWeight={300}
                      letterSpacing="0.52px"
                      pt="25px"
                    >
                      Rate your{' '}
                      <Text as="span" color="text" fontWeight={600}>
                        {equity?.project?.name}
                      </Text>{' '}
                      inspection
                    </Text>

                    <Flex gap="12px" mt="17px" w={`100%`} justify={`space-between`}>
                      {reactions.map((reaction, index) => (
                        <>
                          {rating === index + 1 ? (
                            <Center
                              onClick={() => setRating(index + 1)}
                              cursor={'pointer'}
                              // bg="#3D3D3D"
                              bg="matador_background.100"
                              // bg="transparent"
                              w="58px"
                              h="48px"
                              alignItems={'center'}
                              justifyContent={'center'}
                              key={reaction.text}
                              gap="auto"
                              flexDirection={'column'}
                              border={'1px solid'}
                              borderColor="custom_color.color"
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
                                color="custom_color.color"
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
                              borderColor={`matador_border_color.100`}
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
                      fontSize={{base: '13px', md: '16px'}}
                      fontWeight={300}
                      mb="10px"
                      mt="29px"
                      letterSpacing="0.52px"
                    >
                      Tell us more about your experience (Optional)
                    </Text>
                    <Textarea
                      color="text"
                      onChange={e => setMessage(e.target.value)}
                      value={message}
                      resize="none"
                      border="1px solid !important"
                      bg="matador_background.100"
                      borderColor="matador_border_color.100 !important"
                      borderRadius={'2px'}
                      w="full"
                      h="134px"
                      boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                    />

                    <Flex justify={'flex-end'} align={'center'} w="full">
                      <Button
                        fontWeight="500"
                        h="48px"
                        isDisabled={!rating}
                        loading={submitFeedback.isLoading}
                        onClick={handleSubmit}
                        w="full"
                        align="right"
                        color="custom_color.contrast"
                        bg="custom_color.color"
                        mt="30px"
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

export default FeedbackEquity;
