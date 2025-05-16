import {useDropzone} from 'react-dropzone';
import React, {useCallback, useState} from 'react';
import {Stack, Box, useToast, HStack, useTheme, Text} from '@chakra-ui/react';
import {encodeFileToBase64} from '@/utils';
import {useMutation} from 'react-query';
import {feedbackPurchase} from '@/api/navbarMenu';
import ThreeDots from '../loaders/ThreeDots';

const UploadIcon = ({boxSize = `33px`}) => {
  const theme = useTheme();
  const colors = theme?.colors;
  return (
    <Box width={boxSize} height={boxSize}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 33 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2.6875"
          y="2.57422"
          width="28.125"
          height="28.125"
          rx="14.0625"
          fill={colors?.matador_background?.[`100`]}
        />
        <rect
          x="2.6875"
          y="2.57422"
          width="28.125"
          height="28.125"
          rx="14.0625"
          stroke={colors?.matador_background?.[`200`]}
          strokeWidth="4.21875"
        />
        <g clipPath="url(#clip0_4359_6254)">
          <path
            d="M14.4063 18.9805L16.75 16.6367M16.75 16.6367L19.0938 18.9805M16.75 16.6367V21.9102M21.4375 19.4157C22.1532 18.8246 22.6094 17.9304 22.6094 16.9297C22.6094 15.1499 21.1665 13.707 19.3867 13.707C19.2587 13.707 19.1389 13.6402 19.0739 13.5299C18.3098 12.2333 16.8991 11.3633 15.2852 11.3633C12.8581 11.3633 10.8906 13.3308 10.8906 15.7578C10.8906 16.9684 11.3801 18.0647 12.172 18.8595"
            stroke={colors?.matador_form?.label}
            strokeWidth="1.17188"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4359_6254">
            <rect
              width="14.0625"
              height="14.0625"
              fill={colors?.text}
              transform="translate(9.71875 9.60547)"
            />
          </clipPath>
        </defs>
      </svg>
    </Box>
  );
};

export const UploadPurchaseReceipt = ({equityID, handleSuccess = () => {}, ...restProps}) => {
  const toast = useToast();
  const [receipt, setReceipt] = useState(false);

  const receipt_mutation = useMutation(formData => feedbackPurchase(formData, equityID), {
    onSuccess: async res => {
      setReceipt(true);
      handleSuccess();
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

  const uploadReceipt = async file => {
    receipt_mutation.mutate({
      feedback: `Receipt Succesfully Uploaded`,
      error: '',
      rating: 5,
      image: file[0]?.image.replace('data:', '').replace(/^.+,/, ''),
    });
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
            uploadReceipt([Object.assign({image: res}, {preview: URL.createObjectURL(file)})]);
          })
          .catch(err => {
            return err;
          })
      );
    }, []),
  });

  return (
    <>
      <HStack
        cursor={`pointer`}
        gap={`4px`}
        borderRadius={`5px`}
        border={`1px solid`}
        borderColor={`matador_border_color.100`}
        bgColor={`matador_background.100`}
        p={`20px`}
        justify={`center`}
        fontWeight={`500`}
        {...getRootProps({className: 'dropzone'})}
        {...restProps}
      >
        {receipt_mutation?.isLoading ? (
          <ThreeDots boxSize={{base: `12px`, lg: `15px`}} />
        ) : receipt ? (
          <Text
            color={`custom_color.color_pop`}
            textAlign={`center`}
            fontSize={`16px`}
            lineHeight={`135%`}
            letterSpacing={`0%`}
          >
            Receipt Uploaded
          </Text>
        ) : (
          <>
            <UploadIcon />
            <Text
              color={`custom_color.color_pop`}
              textAlign={`center`}
              fontSize={`16px`}
              lineHeight={`135%`}
              letterSpacing={`0%`}
            >
              Click to upload payment receipt
            </Text>
          </>
        )}
        <input {...getInputProps()} />
      </HStack>
    </>
  );
};
