import {checkIfSFH} from '@/utils/misc';
import {Box, Heading, Skeleton, Text, VStack} from '@chakra-ui/react';
import React from 'react';

const AssetHeader = ({bgImg, listingName, unitName, info, ...rest}) => {
  const is_detached = checkIfSFH(info);

  return (
    <Skeleton w="full" isLoaded={bgImg}>
      <VStack
        w="full"
        position="relative"
        minH={{base: '100%', lg: '152px'}}
        // bgImage={`${bgImg}`}
        justify={{base: 'center'}}
        align={{base: 'center'}}
        spacing={{base: '13.38', xl: '11px'}}
        px={{base: `24px`}}
        {...rest}
      >
        {/* <Box position="absolute" left="0" w="full" h="full" bg="rgba(0,0,0,0.3)" /> */}
        {/* <Text
          as="header"
          fontSize="40px"
          position="relative"
          zIndex={1}
          fontWeight="400"
          // color="#ffffff"
          color="custom_color.color_pop"
          textAlign="center"
          lineHeight="28px"
          className="heading-text-regular"
        >
          {listingName}
        </Text>
        <Text
          fontSize={{md: '16px', base: '14px'}}
          fontWeight="400"
          // color="#ffffff"
          color="custom_color.color_pop"
          position="relative"
          zIndex={1}
          textAlign="center"
          lineHeight={{md: '22px', base: '20px'}}
        >
          {unitName}
        </Text> */}
        <Text
          className="heading-text-regular"
          fontSize={{base: `15px`, lg: '40px'}}
          py={{base: `20px`}}
          px={{base: `0px`, lg: `40px`}}
          color={{base: `text`, lg: 'custom_color.color_pop'}}
          borderBottom={{base: `1px solid`, lg: '2.688px solid'}}
          // borderColor={`#ffffff`}
          borderColor={{base: `matador_border_color.100`, lg: `custom_color.color_pop`}}
          w={{base: '100%', lg: 'max-content'}}
          maxW={{base: `800px`}}
          textAlign={{base: `left`, lg: 'center'}}
          textTransform={{base: `uppercase`, lg: `capitalize`}}
          fontWeight={{base: `600`, lg: `400`}}
          lineHeight={`140%`}
        >
          {is_detached ? `${listingName}` : `${unitName}, ${listingName}`}
        </Text>
      </VStack>
    </Skeleton>
  );
};

export default AssetHeader;
