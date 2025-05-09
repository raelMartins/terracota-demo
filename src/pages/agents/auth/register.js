import {LayoutView} from '/src/components/page_layout';
import {Box, Center, Flex, Text} from '@chakra-ui/react';
import {RegisterAgentForm} from '/src/realtors_portal/components/auth/sections/RegisterAgentForm';
import {useEffect, useState} from 'react';
import useLocalStorage from '/src/realtors_portal/utils/Hook/useLocalStorage';
import {AuthLayout} from '/src/components/page_layout/AuthLayout';
import {OvalLoader} from '/src/realtors_portal/components/loaders/AnimatedLoader';
import {useRouter} from 'next/router';
import ServiceDowntime from '../../service_downtime';
import {declinceAppAccessDueToPayment, store_name} from '../../../constants/routes';

export default function RegisterRealtorPage() {
  const [requestSent, setRequestSent] = useState(false);
  const router = useRouter();
  const storeName = store_name();

  const [objOfkeyValues] = useLocalStorage(['temp_register_email']);

  const email = objOfkeyValues?.temp_register_email;
  const sendRequest = () => {
    setRequestSent(true);
    localStorage.removeItem('temp_register_email');
  };

  useEffect(() => {
    const email_in_process = localStorage.getItem('temp_register_email');
    if (!email_in_process && !requestSent) {
      router.push('/agents/auth/login');
    }
  }, []);

  return declinceAppAccessDueToPayment?.includes(storeName) ? (
    <ServiceDowntime />
  ) : requestSent ? (
    <AuthLayout agent authPage screen={`pendingApproval`} />
  ) : !email ? (
    <Center h="100vh" w="full">
      <OvalLoader />
    </Center>
  ) : (
    <LayoutView noPadding noNavbar>
      <Box w="full" h={{base: `135px`, lg: '30vh'}} bgPosition={'center'} position={'relative'}>
        <Flex
          position={'absolute'}
          h={'full'}
          w="full"
          px="100px"
          py="40px"
          direction={'column'}
          zIndex={20}
          align={'center'}
          justify={'center'}
        >
          <Text
            className="heading-text-regular"
            fontSize={{base: `23px`, lg: '40px'}}
            pb={{base: `0px`, lg: '32px'}}
            px={`20px`}
            color="custom_color.color"
            borderBottom={'2.688px solid'}
            borderColor={'custom_color.color'}
            w={{base: 'max-width', lg: '403.188px'}}
            textAlign={'center'}
          >
            Realtors Portal
          </Text>
        </Flex>
      </Box>
      <Box w="full" px={{base: '20px', lg: '80px'}} py={{base: '20px'}} pb={{md: `0px`}}>
        <RegisterAgentForm email={email} sendRequest={sendRequest} />
      </Box>
    </LayoutView>
  );
}
