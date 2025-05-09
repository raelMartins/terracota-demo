import React, {useState} from 'react';
import {Box, Center, Flex, HStack, Image, Text, VStack} from '@chakra-ui/react';
import GetStarted from './sections/getStarted';
import SuccessLink from './sections/successLink';
import RegisterForm from './sections/registerForm';
import ThankYou from './sections/thankYou';
import {storeDetails} from '../../api/auth';
import {useQuery} from 'react-query';
import {useEffect} from 'react';
import {RiBuilding4Fill} from 'react-icons/ri';

const Register = ({onAuthClose, set_auth_engaged, authPage, ...rest}) => {
  const [page, setPage] = useState('getStarted');
  const [email, setEmail] = useState('');

  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;

  useEffect(() => {
    if (page === `getStarted`) {
      set_auth_engaged(false);
    } else {
      set_auth_engaged(true);
    }
  }, [page]);

  return (
    <Flex
      w="full"
      h="full"
      justify={'flex-end'}
      px={{base: '1rem', md: `170px`}}
      py={`20px`}
      pt={{base: `40px`, md: `20px`}}
      align={{base: `flex-start`, md: 'center'}}
      className="sub-text-regular"
      zIndex={2}
    >
      <Flex
        flexDir={`column`}
        w={{base: `100%`}}
        gap={`40px`}
        align={{base: `center`, md: authPage ? `flex-end` : `center`}}
        h={`100%`}
        {...rest}
      >
        <HStack
          gap={{base: '16px', md: '9px'}}
          display={authPage ? `flex` : {base: page === `getStarted` ? `none` : `flex`, lg: `none`}}
          justify={`center`}
          position={{md: 'absolute'}}
          top={{md: '48px'}}
          left={{md: '48px'}}
          cursor={`pointer`}
          p={{base: `17px`, md: `0px`}}
        >
          <Center maxW="177px" h="48px" minW={`max-content`} position={`relative`}>
            {store_data?.company_image && (
              <Image src={store_data?.company_image} alt={'Company Image'} w="auto" height="100%" />
            )}
          </Center>
        </HStack>
        {page === 'getStarted' && (
          <GetStarted setEmail={setEmail} setPage={setPage} onAuthClose={onAuthClose} />
        )}
        {page === 'successLink' && (
          <SuccessLink email={email} setEmail={setEmail} setPage={setPage} />
        )}
        {page === 'register' && (
          <RegisterForm
            email={email}
            setEmail={setEmail}
            setPage={setPage}
            onAuthClose={onAuthClose}
          />
        )}
        {page === 'thankYou' && (
          <ThankYou email={email} setEmail={setEmail} setPage={setPage} onAuthClose={onAuthClose} />
        )}
      </Flex>
    </Flex>
  );
};

export default Register;
