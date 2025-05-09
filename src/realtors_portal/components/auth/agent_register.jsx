import React, {useState} from 'react';
import {Center, Flex, HStack, Image, Text, VStack} from '@chakra-ui/react';
import GetStarted from './sections/getStarted';
import SuccessLink from './sections/successLink';

import PendingApproval from './sections/pendingApproval';
import {getLocalStorageData} from '../../../constants/routes';

const AgentRegister = ({onAuthClose, screen, ...rest}) => {
  const [page, setPage] = useState(screen || 'getStarted');
  const [email, setEmail] = useState('');

  const companyImage = getLocalStorageData('companyImage');

  return (
    <Flex
      w="full"
      h="full"
      justify={'flex-end'}
      px={{base: '1rem', md: `170px`}}
      py={`20px`}
      pt={{base: `40px`, md: `20px`}}
      align={{base: `flex-start`, md: 'center'}}
      className="montserrat-regular"
      zIndex={2}
    >
      <Flex
        flexDir={`column`}
        w={`100%`}
        gap={`40px`}
        align={{base: `center`, md: 'flex-end'}}
        h={`100%`}
      >
        <HStack
          gap={{base: '16px', md: '9px'}}
          display={{base: `flex`}}
          justify={`center`}
          position={{md: 'absolute'}}
          top={{md: '48px'}}
          left={{md: '48px'}}
          cursor={`pointer`}
          p={{base: `17px`, md: `0px`}}
        >
          <Center maxW="177px" h="48px" maxH="48px" minWidth="48px" position={`relative`}>
            {companyImage && (
              <Image
                src={companyImage}
                alt={'Company Image'}
                w="100%"
                height="100%"
                minWidth={`100%`}
                minHeight={`100%`}
              />
            )}
          </Center>
          <VStack alignItems={'flex-start'}></VStack>
        </HStack>
        {page === 'getStarted' && (
          <GetStarted setEmail={setEmail} setPage={setPage} onAuthClose={onAuthClose} />
        )}
        {page === 'successLink' && (
          <SuccessLink email={email} setEmail={setEmail} setPage={setPage} />
        )}
        {page === 'pendingApproval' && <PendingApproval />}
      </Flex>
    </Flex>
  );
};

export default AgentRegister;
