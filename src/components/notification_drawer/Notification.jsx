import React, {useState} from 'react';
import {useMediaQuery} from '@chakra-ui/react';
import {Drawer, DrawerOverlay, DrawerContent} from '@chakra-ui/react';
// import Main from './main';
import {useMutation, useQuery} from 'react-query';
import {fetchListOfCoowners, respondToCoOwnersRequest} from '/src/api/co_owners';

import Main from './Main';
import CoOwnSummary from './CoOwnSummary';
import InviteesReaction from './InviteesReaction';
import CoOwnersList from './CoOwnersList';
import InviteRejection from './InviteesRejection';
import Breakdown from './Breakdown';
import MobileHeader from '../navbar/mobile_header';
import {Footer} from '../page_layout/footer';
import useGetSession from '../../utils/hooks/getSession';

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

export const Notification = ({isNotOpen, onNotClose, onDrawerOpen}) => {
  const [type, setType] = useState('notification');
  const [requestInfo, setRequestInfo] = useState(null);
  const [isSpace, setIsSpace] = useState(false);
  const asset = requestInfo?.coownership_request?.equity;
  const [isNotMobile] = useMediaQuery('(min-width: 768px)');
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const {data, isLoading: coOwnerLoading} = useQuery(
    ['coowners', asset?.id],
    () => fetchListOfCoowners(asset?.id),
    {enabled: !!asset?.id}
  );
  const coowners = data?.data?.data ?? [];
  const isTheHost = coowners?.length
    ? coowners.find(item => item?.host?.id == LoggedinUser?.user?.id)
    : null;
  const theHost = coowners?.length
    ? coowners.find(item => item?.host?.id === item?.invitee?.id)
    : null;
  const coownerInfo = coowners?.length
    ? coowners.find(item => item?.invitee?.id == LoggedinUser?.user?.id)
    : null;

  const mutation = useMutation(data => respondToCoOwnersRequest(data, coownerInfo?.id), {
    onSuccess: async res => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: err => {},
  });

  const handleAccept = () => {
    const acceptInvitePayload = {
      action: 'accept',
      space_id: requestInfo?.id,
    };

    mutation.mutate(acceptInvitePayload);
  };

  const handleReject = message => {
    const rejectionPayload = {
      action: 'decline',
      space_id: requestInfo?.id,
      decline_reason: message,
    };

    mutation.mutate(rejectionPayload);
  };

  const handleCloseModal = () => {
    setType('notification');
    setRequestInfo(null);
    setIsSpace(false);
    mutation.reset();
  };

  return (
    <Drawer
      autoFocus={false}
      scrollBehavior="inside"
      isOpen={isNotOpen}
      onClose={onNotClose}
      onCloseComplete={handleCloseModal}
      blockScrollOnMount={true}
      placement="right"
    >
      {/* {isNotMobile && <DrawerOverlay />} */}
      <DrawerOverlay />
      <DrawerContent
        maxW={{base: 'full', md: '400px'}}
        bg={'card_bg'}
        top={{base: 'unset !important', md: '32px !important'}}
        bottom={{base: '0', md: 'unset'}}
        right={{base: '0', md: '24px !important'}}
        w="full"
        h={`100%`}
        maxH={{md: '720px'}}
        overflow={`auto`}
        boxShadow={{base: 'none', md: 'lg'}}
        color={`text`}
      >
        {type === 'notification' ? (
          <Main
            isSpace={isSpace}
            setIsSpace={setIsSpace}
            setType={setType}
            setRequestInfo={setRequestInfo}
            onNotClose={onNotClose}
            onDrawerOpen={onDrawerOpen}
          />
        ) : type === 'summary' ? (
          <CoOwnSummary
            asset={asset}
            setType={setType}
            onNotClose={onNotClose}
            customScrollbarStyles={customScrollbarStyles}
          />
        ) : type === 'breakdown' ? (
          <Breakdown
            asset={asset}
            setType={setType}
            onNotClose={onNotClose}
            customScrollbarStyles={customScrollbarStyles}
          />
        ) : type === 'inviteesReaction' ? (
          <InviteesReaction
            handleAccept={handleAccept}
            mutation={mutation}
            requestInfo={requestInfo}
            setType={setType}
            onNotClose={onNotClose}
            coOwnerLoading={coOwnerLoading}
            coowners={coowners}
            isTheHost={isTheHost}
            customScrollbarStyles={customScrollbarStyles}
          />
        ) : type === 'coOwnersList' ? (
          <CoOwnersList
            theHost={theHost}
            asset={asset}
            setType={setType}
            onNotClose={onNotClose}
            coOwnerLoading={coOwnerLoading}
            coowners={coowners}
            isTheHost={isTheHost}
            customScrollbarStyles={customScrollbarStyles}
          />
        ) : type === 'inviteRejection' ? (
          <InviteRejection
            handleReject={handleReject}
            mutation={mutation}
            theHost={theHost}
            asset={asset}
            setType={setType}
            onNotClose={onNotClose}
            coOwnerLoading={coOwnerLoading}
            isTheHost={isTheHost}
            customScrollbarStyles={customScrollbarStyles}
          />
        ) : null}

        {!isNotMobile && <Footer marginTop={`auto`} />}
      </DrawerContent>
    </Drawer>
  );
};

export default Notification;
