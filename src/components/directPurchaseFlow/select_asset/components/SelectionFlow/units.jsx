import {useEffect, useRef} from 'react';
import {Flex, Box, Text, VStack, Center, HStack, Stack, Divider} from '@chakra-ui/react';
import {ArrowBackIcon, ArrowForwardIcon, CloseIcon} from '@chakra-ui/icons';
import {formatToCurrency} from '@/utils';
import Carousel from 'react-elastic-carousel';
import {splitArrayIntoChunks} from '@/utils/misc';
import ThreeDots from '@/components/loaders/ThreeDots';
import Image from 'next/image';

export const SelectionFlowUnits = ({units, unitsLoading, setSelectedUnit, setTab, disclosure}) => {
  const carouselRef = useRef();

  const chunkedArray = units ? splitArrayIntoChunks([...units], 3) : [];

  const handleSelect = item => {
    setSelectedUnit(item);
    setTab('plans');
  };

  useEffect(() => {
    if (units && units?.length <= 1) {
      handleSelect(units?.[0]);
    }
  }, [units]);

  return (
    <Stack gap={`12px`} w="full" minH={`400px`}>
      <Flex direction="row" justify="space-between" align={'center'} px={`8px`}>
        <Text
          fontSize={{base: '23px', md: '25px'}}
          fontWeight={400}
          color="text"
          className="heading-text-regular"
        >
          Select Unit
        </Text>
        <CloseIcon
          fontWeight={600}
          alignSelf={'flex-start'}
          fontSize={'13px'}
          style={{color: '#667085', cursor: 'pointer'}}
          onClick={disclosure?.onClose}
        />
      </Flex>
      {unitsLoading ? (
        <Center h={`300px`}>
          <ThreeDots boxSize={{base: '10px', md: '14px'}} circular />
        </Center>
      ) : (
        <Carousel ref={carouselRef} pagination={false} showArrows={false}>
          {chunkedArray?.map((itemChunkArray, i) => (
            <Stack gap={{base: '4px', md: '8px'}} px="0" w="100%" key={i}>
              {itemChunkArray.map((unit, i) => (
                <Flex
                  key={unit?.id}
                  p={`16px 12px`}
                  gap={`16px`}
                  align={`center`}
                  border={`1px solid`}
                  bg={`matador_background.100`}
                  borderColor={`matador_border_color.100`}
                  onClick={() => handleSelect(unit)}
                  cursor={`pointer`}
                >
                  <Center
                    h={{base: '50px', md: '80px'}}
                    w={{base: '50px', md: '80px'}}
                    minH={{base: '50px', md: '80px'}}
                    minW={{base: '50px', md: '80px'}}
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
                  <VStack alignItems={'flex-start'} gap={`4px`} fontWeight={`400`}>
                    <Text
                      color="matador_text.100"
                      className="sub-text-regular"
                      fontSize="20px"
                      lineHeight={`120%`}
                      letterSpacing={`0%`}
                    >
                      {unit?.unit_title}
                    </Text>
                    <Text
                      color="matador_text.400"
                      className="sub-text-regular"
                      fontSize="14px"
                      lineHeight={`140%`}
                      letterSpacing={`1%`}
                    >
                      {unit?.is_sold_out || unit?.quantity <= 0
                        ? `SOLD OUT`
                        : unit?.display_price
                        ? formatToCurrency(unit?.price)
                        : 'Contact for Price'}
                    </Text>
                  </VStack>
                </Flex>
              ))}
            </Stack>
          ))}
        </Carousel>
      )}

      {units?.length > 3 && (
        <HStack spacing={'15px'} justify={'flex-end'} px={`8px`}>
          <Center
            cursor={'pointer'}
            onClick={() => carouselRef.current?.slidePrev()}
            h="36px"
            w="36px"
            borderRadius={'full'}
            border="1px solid"
            borderColor={'matador_border_color.100'}
            bg="matador_background.100"
          >
            <ArrowBackIcon color="text" fontWeight={700} />
          </Center>

          <Center
            cursor={'pointer'}
            onClick={() => carouselRef.current?.slideNext()}
            h="36px"
            w="36px"
            borderRadius={'full'}
            border="1px solid"
            borderColor={'matador_border_color.100'}
            bg="matador_background.100"
          >
            <ArrowForwardIcon color="text" fontWeight={700} />
          </Center>
        </HStack>
      )}
    </Stack>
  );
};
