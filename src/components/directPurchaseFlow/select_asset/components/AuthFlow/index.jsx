import React, {useState} from 'react';
import {Center, Flex, HStack, Image, Modal, ModalContent, ModalOverlay} from '@chakra-ui/react';
import GetStarted from '@/components/auth/sections/getStarted';
import RegisterForm from '@/components/auth/sections/registerForm';
import ThankYou from '@/components/auth/sections/thankYou';
import useGetSession from '@/utils/hooks/getSession';
import {OTPLogin} from '@/components/auth/sections/otpLogin';
import {ResponsivePopup, ResponsivePopupContent} from '@/ui-lib';

export const DirectPurchaseAuthFlow = ({disclosure, nextStep, listing, unit, ...rest}) => {
  const [page, setPage] = useState('otpLogin');
  const [email, setEmail] = useState('');

  // const STOREINFO = useQuery(['storeInfo'], storeDetails);
  // const store_data = STOREINFO.data?.data?.data;

  const {sessionData: store_data} = useGetSession('store_data');

  const handleClose = () => {
    disclosure?.onClose();
    setPage(`otpLogin`);
    setEmail(``);
  };

  const current_auth_page = {
    register: (
      <RegisterForm
        email={email}
        otpLogin
        setEmail={setEmail}
        setPage={setPage}
        onAuthClose={handleClose}
      />
    ),
    thankYou: (
      <ThankYou
        email={email}
        setEmail={setEmail}
        setPage={setPage}
        directLogin
        nextStep={nextStep}
      />
    ),
    otpLogin: (
      <OTPLogin
        email={email}
        setEmail={setEmail}
        directLogin
        nextStep={nextStep}
        setPage={setPage}
        listing={listing}
        unit={unit}
      />
    ),
  }[page];

  return (
    <ResponsivePopup
      isOpen={disclosure?.isOpen}
      isCentered
      placement={`bottom`}
      onClose={handleClose}
    >
      <ResponsivePopupContent
        p={`0px`}
        maxW={`max-content`}
        bg={`matador_background.200`}
        maxH={`80vh`}
        overflow={`auto`}
      >
        <Flex flexDir={`column`} gap={`40px`} align={{base: `center`}} h={`100%`} {...rest}>
          {current_auth_page}
        </Flex>
      </ResponsivePopupContent>
    </ResponsivePopup>
  );
};
