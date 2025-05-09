import {useDropzone} from 'react-dropzone';
import React, {useCallback} from 'react';
import {Image, Flex, Stack, Box, Center} from '@chakra-ui/react';
import fallbackSrc from '../../../images/avatar.jpeg';
import Camera from '../../../images/icons/camera.svg';
import {encodeFileToBase64} from '../../../utils';
import {Spinner} from '../Spinner';

export const UploadProfilePicture = ({
  files,
  setFiles,
  profileFallback,
  containerStyle,
  isLoading,
  isAvatarLoading,
  avatar,
  numOfFiles,
  ...restProps
}) => {
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: numOfFiles || '',
    onDrop: useCallback(acceptedFiles => {
      acceptedFiles.forEach(file =>
        encodeFileToBase64(file)
          .then(res => {
            setFiles([Object.assign({image: res}, {preview: URL.createObjectURL(file)})]);
          })
          .catch(err => {
            return err;
          })
      );
    }, []),
  });

  return (
    <section>
      <Stack
        align="center"
        direction="row"
        as="div"
        justify={{base: 'center', md: 'start'}}
        {...restProps}
      >
        {isAvatarLoading ? (
          <Spinner noAbsolute />
        ) : (
          <Flex align={'start'} {...getRootProps({className: 'dropzone'})}>
            <Center bg={{base: `matador_background.200`}} borderRadius="full" p={`4px`}>
              <Center
                height={'128px'}
                width={'128px'}
                minWidth={`128px`}
                borderRadius="full"
                overflow="hidden"
              >
                <Image
                  src={avatar ?? (profileFallback?.src || fallbackSrc.src)}
                  objectFit="cover"
                  cursor="pointer"
                  alt=""
                  minW={`100%`}
                  minH={`100%`}
                />
              </Center>
            </Center>
            <Box ml={'-30px'} mt={'60px'} cursor={`pointer`}>
              <Image borderRadius="full" src={Camera.src} height={'46px'} width={'46px'} alt="" />
            </Box>
          </Flex>
        )}
        <input {...getInputProps()} />
      </Stack>
    </section>
  );
};
