import {useDropzone} from 'react-dropzone';
import React, {useCallback} from 'react';
import {
  Flex,
  Stack,
  Box,
  Center,
  useToast,
  Spinner,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';
import Camera from '../../../images/icons/camera.svg';
import {encodeFileToBase64} from '../../../utils';
import {getSettingsData, updateSettings} from '@/api/Settings';
import {useMutation, useQuery} from 'react-query';
import fallbackSrc from '@/images/avatar.svg';
import Image from 'next/image';

export const UploadProfilePicture = ({showCamera = true, ...restProps}) => {
  const toast = useToast();
  const disclosure = useDisclosure();

  const SETTINGS_INFO = useQuery(
    ['user_data'],

    () => getSettingsData({profile: true})
  );

  const User_Data = SETTINGS_INFO?.data?.data?.data;

  const mutation_avatar = useMutation(formData => updateSettings(formData), {
    onSuccess: async res => {
      toast({
        title: 'Profile Photo Updated Successfully!',
        status: 'success',
        duration: 8000,
        isClosable: true,
        position: 'top-right',
      });
      return SETTINGS_INFO?.refetch();
    },
    onError: res => {
      return toast({
        title: res?.message === 'Network Error' ? 'Network Error' : 'Oops something went wrong',
        description: `${
          res?.response?.data?.message ??
          res?.response?.message ??
          res?.message ??
          'Something went wrong, we are working on resolving it.'
        }`,
        status: 'error',
        duration: 8000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const onAvatarChange = async file => {
    mutation_avatar.mutate({
      profile_avatar: true,
      avatar: file[0]?.image.replace('data:', '').replace(/^.+,/, ''),
    });
    return SETTINGS_INFO.refetch();
  };

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    onDrop: useCallback(acceptedFiles => {
      acceptedFiles.forEach(file =>
        encodeFileToBase64(file)
          .then(res => {
            onAvatarChange([Object.assign({image: res}, {preview: URL.createObjectURL(file)})]);
          })
          .catch(err => {
            return err;
          })
      );
    }, []),
  });

  return (
    <>
      <Stack
        align="center"
        direction="row"
        as="div"
        justify={{base: 'center', md: 'start'}}
        {...restProps}
      >
        <Flex align={'start'}>
          <Center bg={{base: `matador_background.200`}} borderRadius="full" p={`4px`}>
            <Center
              boxSize={{base: '48px', lg: `128px`}}
              minWidth={{base: '48px', lg: `128px`}}
              borderRadius="full"
              overflow="hidden"
              position={`relative`}
            >
              <Image
                src={
                  mutation_avatar.isLoading ? fallbackSrc.src : User_Data?.avatar || fallbackSrc.src
                }
                cursor="pointer"
                alt=""
                fill
                style={{objectFit: `cover`}}
                onClick={disclosure?.onOpen}
              />
              <Flex
                position={`absolute`}
                left={`0px`}
                top={`0px`}
                right={`0px`}
                bottom={`0px`}
                bg={`rgba(200,200, 200, 0.8)`}
                alignItems={`center`}
                justifyContent={`center`}
                zIndex={mutation_avatar.isLoading ? `1` : `-1`}
                transition={`.3s`}
                opacity={mutation_avatar.isLoading ? `1` : `0`}
              >
                <Spinner color="#000" />
              </Flex>
            </Center>
          </Center>
          {!showCamera || mutation_avatar.isLoading ? null : (
            <Center
              boxSize={{base: `16px`, lg: `46px`}}
              borderRadius={`50%`}
              position={`relative`}
              ml={{base: `-10px`, lg: '-30px'}}
              mt={{base: `30px`, lg: '60px'}}
              cursor={`pointer`}
              overflow={`hidden`}
              {...getRootProps({className: 'dropzone'})}
            >
              <Image src={Camera.src} alt="" fill style={{objectFit: `cover`}} />
              <input {...getInputProps()} />
            </Center>
          )}
        </Flex>
      </Stack>
      <Modal isOpen={disclosure?.isOpen} isCentered onClose={disclosure?.onClose}>
        <ModalOverlay />
        <ModalContent boxShadow={`none`} bg={`transparent`} w={`max-content`} maxH={`80vh`}>
          <Center boxSize={'500px'} position={`relative`}>
            <Image
              src={
                mutation_avatar.isLoading ? fallbackSrc.src : User_Data?.avatar || fallbackSrc.src
              }
              cursor="pointer"
              alt=""
              fill
              style={{objectFit: `contain`}}
            />
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};
