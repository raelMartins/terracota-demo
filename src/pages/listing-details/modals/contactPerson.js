import React, {useEffect, useState} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  VStack,
  Flex,
  Text,
  Box,
  HStack,
  useClipboard,
  Textarea,
  useToast,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  ModalCloseButton,
  Center,
  Stack,
} from '@chakra-ui/react';
import {Button} from '../../../ui-lib';
import {messageContactPerson} from '../../../api/listing';
import {useMutation, useQuery} from 'react-query';
import {RxCross1} from 'react-icons/rx';
import contactPersonImg from '../../../images/icons/contact-person.svg';
import {IoCall} from 'react-icons/io5';
import {getAllContactPersons} from '@/api/listings';

const ContactPersonContent = ({info, screenWidth}) => {
  const ALL_CONTACT_PERSONS_QUERY = useQuery(['allContactPersons', info?.id], () =>
    getAllContactPersons(info?.id)
  );

  const ALL_CONTACT_PERSONS_DATA = ALL_CONTACT_PERSONS_QUERY?.data?.data?.results || [];

  const toast = useToast();
  const [message, setMessage] = useState('');
  // const [selectedNumber, setSelectedNumber] = useState(null);

  const proceedContact = useMutation(messageContactPerson, {
    onSuccess: async res => {
      toast({
        description: 'Message sent successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      contactModal.onClose();
      setMessage('');
    },
    onError: err => {
      toast({
        title: 'An error occured',
        description: `${err?.code} : ${err?.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleContact = () => {
    if (message) proceedContact.mutate({message, project_id: info?.id});
    else
      toast({
        description: `Please enter a message`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
  };

  const handleClick = number => {
    navigator.clipboard.writeText(number);
    screenWidth >= 768
      ? toast({
          title: 'Contact Copied!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      : null;
  };

  const contact_people = !ALL_CONTACT_PERSONS_DATA?.length
    ? info?.contact_persons
    : ALL_CONTACT_PERSONS_DATA;

  return (
    <Box px="30px" py="20px">
      <Flex
        direction="row"
        justify="space-between"
        align={'center'}
        mb={{base: '25px', md: '25px'}}
        className="sub-text-regular"
      >
        <Text color="text" fontSize={'23px'} fontWeight={500} className="heading-text-regular">
          Contact Person
        </Text>
        {/* <CloseIcon 
              color='text'
              cursor='pointer'
              fontSize='17px'
              // onClick={requestModal?.onClose}
            /> */}
      </Flex>

      <VStack align={'stretch'} gap={{base: '16px', md: '24px'}}>
        {contact_people?.map(person => (
          <HStack
            as={'a'}
            href={screenWidth >= 768 ? null : `tel:${person?.phone_number}`}
            onClick={() => handleClick(person?.phone_number)}
            key={person?.id}
            spacing={'10px'}
            cursor="pointer"
            color={'matador_text.100'}
            borderRadius={'5px'}
            bg={`matador_background.100`}
            border={`1px solid`}
            borderColor={`matador_border_color.100`}
            w="full"
            p={{base: '8px 10px', md: '12px 16px'}}
            gap={`10px`}
          >
            <Center
              boxSize={`32px`}
              bg={`matador_background.200`}
              borderRadius={`50%`}
              position={`relative`}
              fontSize={`14px`}
              p={`2px`}
            >
              <IoCall />
            </Center>
            <Stack gap={'0px'}>
              <Text color="text" fontSize={'16px'} fontWeight={600}>
                {person?.name}
              </Text>
              <Text color="matador_form.label" fontSize={'14px'} fontWeight={500}>
                {person?.phone_number}
              </Text>
            </Stack>
          </HStack>
        ))}
      </VStack>
      {/* <Text
        color="text"
        fontSize={{base: '15px', md: '19px'}}
        fontWeight={{base: 500, md: 500}}
        mt={{base: '18px', md: '25px'}}
        mb={{md: '20px'}}
      >
        Make enquiry
      </Text> */}
      {/* <div>
        <Textarea
          color="text"
          autoFocus={false}
          placeholder="Enter your message"
          outline={'none'}
          size="sm"
          border="0.5px solid #747474 !important"
          mt="7px"
          h="90px"
          onChange={e => setMessage(e.target.value)}
        />
      </div> */}

      {/* <Button
        isLoading={proceedContact.isLoading}
        onClick={handleContact}
        w="full"
color="custom_color.contrast"
              bg="custom_color.color"
        mt="30px"
        p="26px"
      >
        <Text fontSize={`16px`} className="sub-text-regular">
          Send Message
        </Text>
      </Button> */}
    </Box>
  );
};
const ContactPerson = ({contactModal, info}) => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth);
    });
  }, []);

  return screenWidth >= 768 ? (
    <Modal autoFocus={false} onClose={contactModal?.onClose} isOpen={contactModal?.isOpen}>
      <ModalOverlay />
      <ModalContent
        bg="card_bg"
        color={`text`}
        maxW="422px"
        minH="200px"
        px="0"
        py="0"
        borderRadius={{base: '10px', md: '2px'}}
        position={`fixed`}
        bottom={`60px`}
        right={`60px`}
      >
        <ModalCloseButton />
        <ContactPersonContent info={info} screenWidth={screenWidth} />
      </ModalContent>
    </Modal>
  ) : (
    <Drawer
      autoFocus={false}
      isCentered
      onClose={contactModal?.onClose}
      isOpen={contactModal?.isOpen}
      placement="bottom"
    >
      <DrawerOverlay />
      <DrawerContent minH="250px" bg="card_bg" color={`text`} px="0" py="0">
        <DrawerCloseButton />
        <ContactPersonContent info={info} screenWidth={screenWidth} />
      </DrawerContent>
    </Drawer>
  );
};

export default ContactPerson;
