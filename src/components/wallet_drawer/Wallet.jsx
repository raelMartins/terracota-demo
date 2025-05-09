import React, {useState} from 'react';
import {Drawer, DrawerOverlay, DrawerContent, useMediaQuery, Stack} from '@chakra-ui/react';
// import {Footer} from '../../page_layout/footer';
import MobileWalletHeader from './mobile_w_header';
import WalletContent from './wallet_content';
import DepositWallet from './deposit';
import WithdrawalWallet from './withdrawal';
import {Footer} from '../page_layout/footer';

export const Wallet = ({isWalOpen, onWalClose, avatar, onDrawerOpen}) => {
  const [page, setPage] = useState('wallet');
  const [step, setStep] = useState('method');
  const [isNotMobile] = useMediaQuery('(min-width: 768px)');
  return (
    <Drawer
      onCloseComplete={() => setPage('wallet')}
      blockScrollOnMount={true}
      isOpen={isWalOpen}
      onClose={onWalClose}
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent
        display={`flex`}
        flexDir={`column`}
        maxW={{base: 'full', lg: '400px'}}
        p="0"
        bg="matador_background.200"
        top={{base: 0, lg: '24px !important'}}
        right={{base: '0', lg: '24px !important'}}
        w="full"
        h={'full'}
        maxH={{base: '100vh', lg: page === 'withdrawal' ? '700px' : '625px'}}
        overflow={`auto`}
        color={`text`}
      >
        <MobileWalletHeader
          onDrawerClose={onWalClose}
          step={step}
          setPage={setPage}
          setStep={setStep}
          activePage={page}
          onDrawerOpen={onDrawerOpen}
        />
        <Stack flex={`1`} overflowY={`auto`}>
          {page === 'wallet' && (
            <WalletContent avatar={avatar} setPage={setPage} onWalClose={onWalClose} />
          )}
          {page === 'deposit' && (
            <DepositWallet
              step={step}
              setStep={setStep}
              setPage={setPage}
              onWalClose={onWalClose}
            />
          )}
          {page === 'withdrawal' && <WithdrawalWallet setPage={setPage} onWalClose={onWalClose} />}
        </Stack>
        {!isNotMobile && <Footer />}
      </DrawerContent>
    </Drawer>
  );
};

export default Wallet;
