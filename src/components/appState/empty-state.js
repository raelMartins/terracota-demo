import {Image, Text, VStack} from '@chakra-ui/react';
import React from 'react';
import empty from '../../images/icons/empty-icon.svg';
import emptyLight from '../../images/icons/empty-icon-light.svg';
import {appCurrentTheme} from '../../utils/localStorage';
import {LIGHT} from '../../constants/names';

const EmptyState = ({text, centered = false, height, heading, noHeader, icon, ...rest}) => {
  return (
    <VStack
      minH={`300px`}
      maxH={height || {base: '300px', md: '450px'}}
      borderRadius="5px"
      w="full"
      justify="center"
      alignItems={centered && `center`}
      my={{base: '10px', md: '13px'}}
      mb={{base: '18px', md: '24px'}}
      {...rest}
    >
      <VStack>
        {icon || (
          <Image
            w="auto"
            h={{base: '30px', md: '50px'}}
            src={appCurrentTheme === LIGHT ? empty.src : emptyLight.src}
            alt="notification empty state"
          />
        )}
        {!noHeader && (
          <Text
            className="heading-text-regular"
            mt="10px"
            fontWeight="600"
            fontSize={{base: '16px', md: '20px'}}
            textAlign="center"
            color="text"
            fontFamily={rest.fontFamily}
            {...rest.headerStyle}
          >
            {heading || 'Nothing Found'}
          </Text>
        )}
        <Text
          fontWeight="400"
          color="text"
          fontSize={rest.textSize || {base: '12px', md: '16px'}}
          textAlign="center"
        >
          {text || 'No data yet'}
        </Text>
      </VStack>
    </VStack>
  );
};

export default EmptyState;
