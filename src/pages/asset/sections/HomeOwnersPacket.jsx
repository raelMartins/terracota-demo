import React, {useRef} from 'react';
import {Spinner} from '../../../ui-lib/ui-lib.components';
import {
  AbsoluteCenter,
  Box,
  Flex,
  Image,
  TabList,
  Tabs,
  Stack,
  Text,
  VStack,
  HStack,
  Tab,
  TabIndicator,
  TabPanel,
  TabPanels,
  Input,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Center,
  useMediaQuery,
  Link,
} from '@chakra-ui/react';
import warning_icon from '/src/images/icons/warning-alert.svg';
import {fetchInvestorPackets, sendInvestorPackets} from '../../../api/payment';
import {useMutation, useQuery} from 'react-query';
import {formatDateToString} from '../../../utils/formatDate';
import {encodeFileToBase64} from '../../../utils';
import {toastForError} from '../../../utils/toastForErrors';
import EmptyState from '../../../components/appState/empty-state';
import {IoCloudUploadOutline} from 'react-icons/io5';

export const HomeOwnersPacket = ({equityId, modal}) => {
  const HOME__OWNERS__PACKETS = useQuery(['fetchInvestorPackets', equityId], () =>
    fetchInvestorPackets(equityId)
  );

  const [isMobile] = useMediaQuery('(max-width: 700px)');
  const inputRef = useRef(null);
  const toast = useToast();
  const packetData = HOME__OWNERS__PACKETS?.data?.data;

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

  const {mutate, isLoading} = useMutation(formData => sendInvestorPackets(equityId, formData), {
    onSuccess: async res => {
      await HOME__OWNERS__PACKETS.refetch();
      toast({
        description: `Packet Uploaded successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      inputRef.current.value = '';
    },
    onError: err => {
      inputRef.current.value = '';
      toastForError(err, true, toast);
    },
  });

  const handleUpload = e => {
    let based = [];
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      encodeFileToBase64(files[i]).then(filed => {
        const body = {
          packet: filed.replace('data:', '').replace(/^.+,/, ''),
          packet_name: files[i]?.name,
        };
        based.push(body);
        if (files.length === based.length) {
          return mutate(based);
        }
      });
    }
  };

  const ReceivedPacket = () => {
    return (
      <>
        {packetData?.received?.length ? (
          <VStack
            // mt="20px"
            align={'stretch'}
            mx="auto"
            w="full"
            spacing="12px"
            overflowY={'auto'}
          >
            {packetData?.received?.map((item, index) => (
              <Flex
                as={Link}
                href={item?.packet}
                target="_blank"
                key={index}
                _hover={{textDecoration: 'none'}}
                align={'center'}
                w="full"
                p={'16px'}
                border="1px solid"
                borderColor="matador_border_color.100 !important"
                bg={`matador_background.100`}
                gap="12px"
              >
                {/* <Image
                  alt="next_image"
                  src={appCurrentTheme === LIGHT ? homeOwner.src : homeOwnerLight.src}
                /> */}
                <VStack align={'flex-start'} spacing="0">
                  <Text className="heading-text-regular" color="text" fontWeight={500}>
                    {/* Purchase Agreement */}
                    {item?.packet_name || `Terms of Agreement`}
                  </Text>
                  <Text color="text" fontSize={'12px'} fontWeight={400}>
                    {item?.added_at ? `Uploaded: ${formatDateToString(item?.added_at)}` : 'n/a'}
                  </Text>
                </VStack>
              </Flex>
            ))}
          </VStack>
        ) : (
          <EmptyState
            icon
            text="No home owner's packet has been uploaded yet"
            textSize={12}
            headerStyle={{textTransform: 'uppercase', fontWeight: 700, fontSize: '14px'}}
            height={{base: '200px', md: '300px'}}
          />
        )}
      </>
    );
  };

  const SentPacket = () => {
    return (
      <>
        {packetData?.sent?.length ? (
          <VStack
            // mt="20px"
            align={'stretch'}
            mx="auto"
            w="full"
            overflowY="auto"
          >
            {packetData?.sent?.map((item, index) => (
              <Flex
                key={index}
                align={'center'}
                w="full"
                p={'16px'}
                border="1px solid"
                borderColor="matador_border_color.100 !important"
                bg={`matador_background.100`}
                gap="12px"
              >
                {/* <Image
                  alt="next_image"
                  src={appCurrentTheme === LIGHT ? homeOwner.src : homeOwnerLight.src}
                /> */}
                <VStack align={'flex-start'} spacing="0">
                  <Text className="heading-text-regular" color="text" fontWeight={500}>
                    {/* Purchase Agreement */}
                    {item?.packet_name || `Terms of Agreement`}
                  </Text>
                  <Text color="text" fontSize={'12px'} fontWeight={400}>
                    {item?.added_at ? `Uploaded: ${formatDateToString(item?.added_at)}` : 'n/a'}
                  </Text>
                </VStack>
              </Flex>
            ))}
          </VStack>
        ) : (
          // <EmptyState text="No sent packet yet" />
          <EmptyState
            icon
            text="No home owner's packet has been uploaded yet"
            textSize={12}
            headerStyle={{textTransform: 'uppercase', fontWeight: 700, fontSize: '14px'}}
            height={{base: '200px', md: '300px'}}
          />
        )}
      </>
    );
  };

  const packetTabs = [
    {
      tablist: 'Received',
      component: <ReceivedPacket />,
    },
    {
      tablist: 'Sent',
      component: <SentPacket />,
    },
  ];

  const mainContent = (
    <Stack minH={`600px`}>
      {HOME__OWNERS__PACKETS?.isLoading ? (
        <Center minH={`300px`}>
          <AbsoluteCenter>
            <Spinner />
          </AbsoluteCenter>
        </Center>
      ) : HOME__OWNERS__PACKETS?.isError ? (
        <Center>
          <Stack mb="40px" align="center" spacing={'14px'} direction={'column'} w="full" h="full">
            <Image boxSize="68px" src={warning_icon.src} alt="" />
            <Text fontWeight="600" fontSize="28px" lineHeight="36px" color="text">
              {`No Documents found`}
            </Text>
            <Text
              textAlign="center"
              fontWeight="400"
              fontSize="16px"
              lineHeight="20px"
              color="text"
            >
              {`There was a problem retrieving the document. Please try again.`}
            </Text>
          </Stack>
        </Center>
      ) : (
        <Stack flex={`1`}>
          <Flex
            align={'flex-start'}
            justify={'space-between'}
            w="full"
            px="10px"
            py={`16px`}
            borderBottom={`2px solid`}
            borderColor={`matador_border_color.100`}
          >
            <VStack align={'stretch'} justify="center">
              <Text
                className="heading-text-regular"
                color="text"
                fontSize={'24px'}
                fontWeight={500}
              >
                Owner&apos;s Packet
              </Text>
            </VStack>
            <DrawerCloseButton position="initial" onClick={modal.onClose} />
          </Flex>

          <Box flex={`1`}>
            <Tabs isFitted variant="enclosed" align="center" isLazy>
              <TabList
                bg="transparent"
                boxShadow="none"
                fontWeight="600"
                fontSize="18px"
                lineHeight="23px"
                color="text"
                maxW="100%"
                px="20px"
                py="0px"
                mt="30px"
                justifyContent={'space-between'}
                borderBottom={`1px solid`}
                borderColor={`matador_border_color.100 !important`}
              >
                {packetTabs.map((item, index) => (
                  <Tab
                    key={index}
                    wordBreak="keep-all"
                    pb="10px"
                    color="text"
                    _focusVisible={{
                      boxShadow: 'none',
                    }}
                    fontWeight={400}
                    border="none"
                    maxW="85px"
                    _selected={{color: 'text', border: 'none', fontWeight: '500'}}
                  >
                    {item.tablist}
                  </Tab>
                ))}
              </TabList>
              <TabIndicator mt="-2px" height="4px" bg="text" borderRadius="27px" />
              <TabPanels h={`450px`} overflow="auto">
                {packetTabs.map((item, index) => (
                  <TabPanel key={index} px="0px" py="18px">
                    {item.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
          <HStack
            py="10px"
            h="45px"
            bg="custom_color.color"
            color={`custom_color.contrast`}
            mx="auto"
            // borderRadius="4px"
            position="relative"
            w="full"
            align="center"
            cursor="pointer"
            justify="center"
            spacing="8px"
          >
            <Input
              type="file"
              w="full"
              opacity="0"
              bg="red"
              h="full"
              position="absolute"
              ref={inputRef}
              onChange={handleUpload}
              top="0"
              cursor="pointer"
              left="0"
              accept=".pdf"
              multiple
              isDisabled={isLoading}
              _disabled={{bg: 'transparent', opacity: '0'}}
            />
            <IoCloudUploadOutline fontSize={`20px`} />

            <Text fontSize="14.429px" fontWeight="400">
              {isLoading ? 'Uploading...' : 'Upload'}
            </Text>
          </HStack>
        </Stack>
      )}
    </Stack>
  );

  return (
    <Drawer
      placement={isMobile ? 'bottom' : 'right'}
      autoFocus={false}
      color="text"
      isOpen={modal?.isOpen}
      onClose={modal?.onClose}
    >
      <DrawerOverlay />
      <DrawerContent
        top={{base: 'unset !important', lg: '24px !important'}}
        right={{base: '0', md: '24px !important'}}
        bottom={{base: '0', md: 'unset !important'}}
        w="full"
        // h={'full'}
        p="16px"
        maxW={{base: '100vw', md: '400px'}}
        maxH={'720px'}
        overflowY={`auto`}
        bg={'card_bg'}
        color={`text`}
        boxShadow={{base: 'none', md: 'md'}}
      >
        {mainContent}
      </DrawerContent>
    </Drawer>
  );
};

export default HomeOwnersPacket;
