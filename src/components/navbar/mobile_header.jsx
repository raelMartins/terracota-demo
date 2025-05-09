import React from 'react';
import {Flex, Text, Icon} from '@chakra-ui/react';
import {ChevronLeftIcon} from '@chakra-ui/icons';
import {BiMenu} from 'react-icons/bi';

export const MobileHeader = ({activePage, onDrawerOpen, onDrawerClose, ...rest}) => {
  return (
    <Flex
      display={{base: 'flex', md: 'none'}}
      mb="10px"
      px={'48px'}
      w="full"
      bg={'card_bg'}
      justify={'space-between'}
      align={'center'}
      p="20px"
      direction={'row'}
      {...rest}
    >
      <Flex align={'center'} gap="10px" justify={'center'}>
        <ChevronLeftIcon
          cursor={'pointer'}
          onClick={onDrawerClose}
          fontSize={'30px'}
          color={'text'}
        />
        <Text fontSize={'20px'} fontWeight={500} color="text" className="heading-text-regular">
          {activePage}
        </Text>
      </Flex>
      <Icon as={BiMenu} color="text" onClick={onDrawerOpen} fontSize={'30px'} />
    </Flex>
  );
};

export default MobileHeader;
