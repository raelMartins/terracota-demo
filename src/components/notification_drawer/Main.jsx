import {Space} from './Space';
import React from 'react';
import {Stack, useMediaQuery, VStack} from '@chakra-ui/react';
import {useQuery} from 'react-query';
import {Spinner} from '../../ui-lib';
import NotificationList from './NotificationList';
import {fetchNotifs, fetchSpace} from '../../api/FetchNotif';
import {Flex, DrawerCloseButton, Text, Box} from '@chakra-ui/react';
import MobileHeader from '../navbar/mobile_header';
import {Footer} from '../page_layout/footer';
import {CloseIcon} from '@chakra-ui/icons';

export const Main = ({onNotClose, onDrawerOpen, setRequestInfo, setType, isSpace, setIsSpace}) => {
  const {data, isLoading: notificationLoading, refetch} = useQuery(['notifs'], fetchNotifs);
  const {data: spaceData, isLoading: spaceLoading} = useQuery(['spaces'], fetchSpace);
  const [isMobile] = useMediaQuery('(max-width: 767px)');
  const dateOrTimeAgo = (ts, data) => {
    const d = new Date(); // Gets the current time
    const nowTs = Math.floor(d.getTime() / 1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
    const seconds = nowTs - Math.floor(new Date(ts).getTime() / 1000);

    // more that two days
    if (seconds >= 2 * 24 * 3600) {
      let datee = '';
      data
        ? (datee = data)
        : (datee = `${new Date(ts).getDate().toString().padStart(2, '0')}/${(
            new Date(ts).getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}/${new Date(ts).getFullYear().toString()}`);
      return datee;
    }
    // a day
    if (seconds > 24 * 3600) {
      return 'Yesterday';
    }

    if (seconds > 3600) {
      const h = seconds / 3600;
      return `${Math.floor(h)} hour${h > 1 ? 's' : ''} ago`;
    }

    if (seconds > 60) {
      const m = seconds / 60;
      return `${Math.floor(m)} minute${m > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Box display={`flex`} flexDir={`column`} w="full" h={`100%`}>
      <DrawerCloseButton display={{base: 'none', md: 'flex'}} />
      <MobileHeader
        onDrawerClose={onNotClose}
        activePage={isSpace ? 'Space' : 'Notification'}
        onDrawerOpen={onDrawerOpen}
        mb={0}
        pb={0}
      />
      {/*<Flex
        direction={'row'}
        w="full"
        borderBottom={'1px solid'}
        borderColor={`matador_border_color.100`}
        mb="20px"
        mt={{base: '20px', md: '50px'}}
        justify={'space-around'}
        className="heading-text-regular"
      >
        <Text
          pb="8px"
          fontWeight={500}
          w="110px"
          textAlign={'center'}
          fontSize={'16px'}
          // color={'#101828'}
          color={'matador_text.400'}
          borderBottom={!isSpace && '2px solid'}
          borderColor={`matador_border_color.100`}
          opacity={isSpace ? 0.5 : 1}
          cursor={'pointer'}
          onClick={() => setIsSpace(false)}
        >
          Notifications
        </Text>
        <Text
          pb="8px"
          fontWeight={500}
          w="110px"
          textAlign={'center'}
          fontSize={'16px'}
          // color={'#101828'}
          color={'matador_text.400'}
          borderBottom={isSpace && '2px solid '}
          borderColor={`matador_border_color.100`}
          opacity={!isSpace ? 0.5 : 1}
          cursor={'pointer'}
          onClick={() => setIsSpace(true)}
        >
          Space
        </Text>
      </Flex>*/}

      <Flex
        p={{base: '10px'}}
        w="full"
        justify={'space-between'}
        align={'center'}
        borderBottom={`1px solid`}
        borderColor={`matador_border_color.100`}
        display={{base: `none`, md: `flex`}}
      >
        <Text
          fontSize={'25px'}
          fontWeight={400}
          className="heading-text-regular"
          color={'matador_text.100'}
        >
          Notifications
        </Text>
        {/* 
        <CloseIcon
          alignSelf={'flex-start'}
          cursor="pointer"
          fontSize={14}
          color={'text'}
          onClick={onNotClose}
          mt={{md: 2}}
        /> */}
      </Flex>
      <Stack py={{base: `16px`, md: `0px`}} gap={'4px'} stretch overflowY="auto">
        {isSpace ? (
          <>
            {spaceLoading ? (
              <Spinner />
            ) : (
              <Space
                setType={setType}
                setRequestInfo={setRequestInfo}
                dateOrTimeAgo={dateOrTimeAgo}
                spaceData={spaceData}
              />
            )}
          </>
        ) : (
          <>
            {notificationLoading ? (
              <Spinner />
            ) : (
              <NotificationList dateOrTimeAgo={dateOrTimeAgo} data={data} />
            )}
          </>
        )}
      </Stack>
      {/* {isMobile && <Footer />} */}
    </Box>
  );
};

export default Main;
