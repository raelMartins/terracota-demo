import React, {useEffect, useState} from 'react';
import {Box, Flex, Text, useTheme, useToast, VStack} from '@chakra-ui/react';
import {motion} from 'framer-motion';
import {useMutation} from 'react-query';
import {toggleWatchlistApi} from '../../api/watchlist';
import {formatToCurrency} from '../../utils';
import {useRouter} from 'next/router';
import Image from 'next/image';

export const ListingCard = ({data, refetch, is_id_watchlisted, ...rest}) => {
  const router = useRouter();
  const toast = useToast();

  const theme = useTheme();

  const handle_card_click = () => {
    // if (LoggedinUser) {
    router.push(`/listing-details/${data?.id}`);
    // } else {
    //   router.push(`/listing/${data?.id}`);
    // }
  };

  return (
    <Box
      shadow={'sm'}
      as={motion.div}
      maxWidth={'597.45px'}
      cursor={'pointer'}
      whileTap={{scale: 0.98}}
      whileHover={{scale: 1.01}}
      aspectRatio={{base: `1 / 1`, lg: '397  / 490'}}
      bg="card_bg"
      mx={'auto'}
      maxH={{base: '350px', lg: `490px`}}
      h={`100%`}
      w="full"
      borderRadius={'5px'}
      position={'relative'}
      onClick={handle_card_click}
      {...rest}
    >
      <Image src={data?.photos?.[0]?.photo} alt={`image`} fill style={{objectFit: `cover`}} />
      {/* <Box bg="black" opacity={0.7} position={'absolute'} h="full" w="full" zIndex={0} /> */}

      <Flex position={'absolute'} top="20px" right="20px" align={'center'} gap="12px" zIndex={1}>
        {data?.is_watchlist || is_id_watchlisted ? (
          <Box px="16px" py="8px" borderRadius={'4px'} bg="#D6D6D6" h={`max-content`}>
            <Text className="heading-text-regular" fontSize={'12px'} color="#191919">
              ADDED TO WATCHLIST
            </Text>
          </Box>
        ) : // ) : data?.is_sold_out ? (
        //   <Box px="16px" py="8px" borderRadius={'4px'} bg="#D6D6D6" h={`max-content`}>
        //     <Text className="heading-text-regular" fontSize={'12px'} color="#191919">
        //       SOLD OUT
        //     </Text>
        //   </Box>
        data?.fraction_is_available ? (
          <Box px="16px" py="8px" borderRadius={'4px'} bg="custom_color.color" h={`max-content`}>
            <Text className="heading-text-regular" fontSize={'12px'} color="custom_color.contrast">
              FRACTIONAL
            </Text>
          </Box>
        ) : null}
      </Flex>

      <VStack
        bottom="0px"
        position={'absolute'}
        px={{base: '12px', lg: '24px'}}
        pb={`30px`}
        pt={`10px`}
        py={`30px`}
        align={'stretch'}
        justify={`flex-end`}
        gap={'8px'}
        w="full"
        zIndex={1}
        // bg={`rgba(0,0,0,0.5)`}
        minH={`260px`}
        // background={`linear-gradient(179.72deg, rgba(0, 0, 0, 0.05) 33.02%, #000000 86.38%)`}
        background={`linear-gradient(180deg, rgba(0, 0, 0, 0) 33.02%, rgba(0, 0, 0, 0.80) 86.38%)`}
      >
        <Flex w="full" justify={'space-between'} align={'center'}>
          <Text
            color="white"
            className="heading-text-regular"
            fontWeight={400}
            fontSize={{base: '18px', lg: '24px'}}
            lineHeight={`100%`}
          >
            {data?.name}
          </Text>
        </Flex>
        {/* {!data?.is_sold_out && data?.display_price ? ( */}
        {data?.display_price ? (
          <Text
            color={
              theme?.colors?.custom_color?.contrast !== '#191919'
                ? `custom_color.contrast`
                : 'custom_color.color'
            }
            fontWeight={data?.display_price ? 400 : 600}
            fontSize={{base: '16px', lg: '20px'}}
            className="sub-text-regular"
            lineHeight={`100%`}
          >
            {data?.is_sold_out
              ? `Sold Out`
              : data?.display_price
              ? `From ${formatToCurrency(data?.starting_from)}`
              : 'Contact for Price'}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
};
