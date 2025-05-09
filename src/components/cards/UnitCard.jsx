import {Box, Center, Flex, Hide, Show, Text, VStack} from '@chakra-ui/react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {formatToCurrency} from '../../utils';
import {motion} from 'framer-motion';

export const UnitCard = ({unit, projectID, sold_out}) => {
  const router = useRouter();

  const handle_click = () => {
    router.push({
      pathname: `/listing-details/units/${unit?.id}`,
      query: {projectId: projectID},
    });
  };

  const unit_sold_out = unit?.is_sold_out || unit?.quantity <= 0 || sold_out;
  return (
    <>
      <Show below="md">
        <Flex
          key={unit?.id}
          p={`16px 12px`}
          gap={`12px`}
          border={`1px solid`}
          bg={`card_bg`}
          borderColor={`matador_border_color.100`}
          onClick={handle_click}
        >
          <Center
            h={{base: '60px', md: '100px'}}
            w={{base: '60px', md: '100px'}}
            minH={{base: '60px', md: '100px'}}
            minW={{base: '60px', md: '100px'}}
            borderRadius={`2px`}
            position="relative"
            overflow={`hidden`}
          >
            <Image
              src={unit?.photos?.[0]?.photo || '/'}
              alt="image"
              fill
              style={{objectFit: `cover`}}
            />
          </Center>
          <VStack alignItems={'flex-start'}>
            <Text
              color="matador_text.100"
              className="sub-text-regular"
              fontSize="16px"
              fontWeight={`500`}
              lineHeight={`140%`}
              letterSpacing={`0.16px`}
            >
              {unit?.unit_title}
            </Text>
            <Text
              color="matador_text.400"
              className="sub-text-regular"
              fontSize="13px"
              fontWeight={`500`}
              lineHeight={`135%`}
              letterSpacing={`0.5px`}
            >
              {unit_sold_out
                ? `SOLD OUT`
                : unit?.display_price
                ? formatToCurrency(unit?.price)
                : 'Contact for Price'}
            </Text>
          </VStack>
        </Flex>
      </Show>
      <Hide below="md">
        <Box
          shadow={'sm'}
          as={motion.div}
          maxWidth={'597.45px'}
          cursor={'pointer'}
          whileTap={{scale: 0.98}}
          whileHover={{scale: 1.01}}
          aspectRatio={{base: `1 / 1`, lg: '397  / 540'}}
          bg="card_bg"
          mx={'auto'}
          maxH={{base: '350px', lg: `540px`}}
          h={`100%`}
          w="full"
          borderRadius={'5px'}
          position={'relative'}
          onClick={handle_click}
        >
          {/* <Box
            bg="black"
            opacity={0.5}
            position={'absolute'}
            top={`0px`}
            left={`0px`}
            h="full"
            w="full"
            zIndex={1}
          /> */}
          <Image
            src={unit?.photos?.[0]?.photo}
            alt={`image`}
            fill
            style={{objectFit: `cover`}}
            // placeholder="blur"
          />

          <Flex
            position={'absolute'}
            top="20px"
            right="20px"
            align={'center'}
            gap="12px"
            zIndex={`1`}
          >
            {/* {unit_sold_out ? (
              <Box px="16px" py="8px" borderRadius={'4px'} bg="#D6D6D6" h={`max-content`}>
                <Text className="heading-text-regular" fontSize={'12px'} color="#191919">
                  SOLD OUT
                </Text>
              </Box>
            ) : null} */}
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
            background={`linear-gradient(180deg, rgba(0, 0, 0, 0) 33.02%, rgba(0, 0, 0, .8) 86.38%)`}
          >
            <Text
              color="white"
              lineHeight={`100%`}
              className="heading-text-regular"
              fontWeight={400}
              fontSize={'20px'}
            >
              {unit?.unit_title}
            </Text>
            {/* {!unit?.display_price || unit_sold_out ? ( */}
            {!unit?.display_price ? (
              <></>
            ) : (
              <Text
                color={`custom_color.color`}
                // color={
                //   theme?.colors?.custom_color?.contrast !== '#191919'
                //     ? `custom_color.contrast`
                //     : 'custom_color.color'
                // }
                fontWeight={400}
                fontSize={'16px'}
                lineHeight={`100%`}
                className="sub-text-regular"
              >
                {unit_sold_out
                  ? `Sold Out`
                  : unit?.display_price
                  ? formatToCurrency(unit?.price)
                  : 'Contact for Price'}
              </Text>
            )}
          </VStack>
        </Box>
      </Hide>
    </>
  );
};
