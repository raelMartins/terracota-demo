import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {Box, Center, useToast} from '@chakra-ui/react';
import {verifyMagicToken} from '../../api/auth';
import {useQuery} from 'react-query';
import {Spinner} from '../../ui-lib';
import RegisterPage from '../../components/auth/register_page';
import {deleteCookies, setSession} from '../../utils/sessionmanagers';
import {declinceAppAccessDueToPayment, storeName} from '../../constants/routes';

const Login = () => {
  const toast = useToast();
  const [err, setError] = useState(null);
  const router = useRouter();
  const {magic} = router.query;

  const magicQuery = useQuery(['verifyMagicToken', magic], () => verifyMagicToken({token: magic}), {
    onSuccess: res => {
      if (res?.data?.valid === 'true' || res?.data?.valid === true) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const {
          first_name,
          last_name,
          id,
          customer_ref,
          middle_name,
          user,
          date_of_birth,
          email,
          avatar,
        } = res?.data?.user;

        // include required user info
        const obj = {
          avatar,
          first_name,
          middle_name,
          last_name,
          id,
          email,
          date_of_birth,

          customer_ref,
          user: {id: user.id},
        };
        setSession(obj, 'loggedIn', expires);
        setSession(res?.data?.user_tokens?.token, 'token', expires);
        declinceAppAccessDueToPayment?.includes(storeName)
          ? location.assign('/service_downtime')
          : location.assign('/');
      } else {
        // toast({
        //   title: 'Login Error',
        //   description:
        //     res?.data?.message ||
        //     `There is a problem logging you in, but we are actively working to resolve it. Please try again later`,
        //   status: 'error',
        //   duration: 5000,
        //   isClosable: true,
        //   position: 'top-right',
        // });
        deleteCookies(['token', 'loggedIn']);

        // setError(res?.data?.message);
        setTimeout(() => location.assign('/'), 3000);
      }
    },
    onError: err => {
      // setError(err?.response?.data?.message || 'Opps, Something went wrong !');
      // toast({
      //   title: 'Oops',
      //   description: `There is a problem logging you in, but we are actively working to resolve it.`,
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true,
      //   position: 'top-right',
      // });
      deleteCookies(['token', 'loggedIn']);
      setTimeout(() => location.assign('/'), 3000);
    },
    enabled: Boolean(magic),
  });

  return (
    <Box w="full" h="full">
      {magic && (
        <Box h={'100vh'} bg={`matador_background.100`}>
          <Center h="full" w="full">
            <Spinner />
          </Center>
        </Box>
      )}
    </Box>
  );
};

export default Login;

export async function getServerSideProps(context) {
  const {query} = context;

  if (!query.magic) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      query: query.magic,
    },
  };
}
