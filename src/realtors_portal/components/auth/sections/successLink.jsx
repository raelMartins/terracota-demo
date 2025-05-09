import React from 'react';
import {Flex, Image, Text, useToast, Box, Stack, Center} from '@chakra-ui/react';
import check_web from '/src/images/done_green_check.gif';
import {useMutation} from 'react-query';
import {AttemptLogin, agentLogin} from '/src/realtors_portal/api/auth';
import {STORENAMEFROMDOMAIN} from '/src/constants/routes';

const SuccessLink = ({setPage, email, ...rest}) => {
  const toast = useToast();

  const storeName = STORENAMEFROMDOMAIN;

  const {mutate} = useMutation(formData => agentLogin(formData), {
    onSuccess: res => {
      if (
        res?.response?.data?.action === 'signup' ||
        res?.response?.data?.action === 'not_customer'
      ) {
        toast({
          title: `hmm...`,
          description: `${res?.response?.data?.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        // return router.push(`register`);
      } else if (res?.data?.action == 'login') {
        return toast({
          title: `A link was sent to ${email}`,
          description: 'please check your Email',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else if (res?.message === 'Network Error') {
        return toast({
          title: `${res?.message}`,
          description: 'please check your network connection',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    onError: err => {
      toast({
        title: 'An error occured',
        description: `${err?.response?.message ?? err?.message ?? err?.code ?? 'An error occured'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleResend = () => {
    mutate({
      email: email,
      store_name: storeName,
    });
  };

  return (
    <Box
      bg="card_bg"
      minH={'327px'}
      maxW="440px"
      w={`100%`}
      px={{base: `26.5px`, md: '40px'}}
      py={{base: `32px`, md: '24px'}}
      borderRadius={'2px'}
      boxShadow="0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)"
      {...rest}
    >
      <Flex
        w="full"
        h="full"
        direction="column"
        justify={'center'}
        align="center"
        textAlign={'center'}
        gap={{base: `24px`, md: `12px`}}
      >
        <Center h={{base: `100px`, md: `150px`}} w={{base: `100px`, md: `150px`}}>
          {/* <Image alt="next_image" src={{base: check.src, md: check_web.src}} /> */}
          <Image alt="next_image" src={check_web.src} />
        </Center>
        <Stack gap={`7px`}>
          <Text
            color="text"
            textAlign={'center'}
            fontWeight={600}
            fontSize={{base: `23px`, md: '28px'}}
            className="gilda-display-regular"
          >
            Link sent successfully
          </Text>
          <Text
            textAlign={'center'}
            fontSize={'13px'}
            mt="0px !important"
            fontWeight={`500`}
            color="matador_text.300"
            lineHeight={`135%`}
          >
            A link has been sent to
            {/* your email address */}
            <Text as="span" color="custom_color.color">
              {' '}
              {email}.{' '}
            </Text>
            {/* Please check your inbox to confirm the link. */}
            please check your email and click the link to confirm your email address
          </Text>
        </Stack>
        <Text
          fontSize={'13px'}
          fontWeight={`500`}
          color="matador_text.300"
          lineHeight={`135%`}
          mt={{md: `6px`}}
        >
          Didn’t get any mail?{' '}
          <Text as="span" color="custom_color.color" cursor="pointer" onClick={handleResend}>
            {' '}
            Resend link{' '}
          </Text>
        </Text>
      </Flex>
    </Box>
  );
};

export default SuccessLink;
