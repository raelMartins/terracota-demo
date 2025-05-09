import React from 'react';
import {Morph} from '../../../../../ui-lib/ui-lib.components/morph';
import {HStack, Image, Stack, Text, useMediaQuery} from '@chakra-ui/react';
import drawerArrow from '/src/images/icons/drawerArrow.svg';
import homeGif from '/src/images/animated_icons/home.gif';
import {Button} from '../../../../../ui-lib';
import {LIGHT} from '../../../../../constants/names';
import {appCurrentTheme} from '../../../../../utils/localStorage';

const ConfirmSelection = ({handleScreen, mutation, allocationVal, handleSubmitAllocation}) => {
  const [isBelowMd] = useMediaQuery('(max-width: 913px)');

  const Morphed = Morph[isBelowMd ? 'drawer' : 'modal'];

  return (
    <>
      <HStack
        p={{base: '22px 17px 22px 16px', md: '32px 32px 0px'}}
        w="full"
        justify={{md: 'end', base: 'space-between'}}
      >
        <HStack
          role="button"
          onClick={handleScreen('select allocation')}
          display={{md: 'none', base: 'flex'}}
          spacing="14px"
        >
          <Image src={drawerArrow.src} boxSize="20px" />{' '}
          <Text
            as="h1"
            fontSize={{base: '23px', md: '17.25px'}}
            lineHeight={{base: '32px', md: '24px'}}
            fontWeight="400"
            color="matador_text.100"
          >
            Unit Allocation
          </Text>
        </HStack>
        <Morphed.closeBtn position="initial" />
      </HStack>
      <Morphed.body minW={{md: '477px'}} p={{base: '43px 16px 271px', md: '40px 32px'}}>
        <Stack w="full" spacing={{md: '40px', base: 'none'}}>
          <Image
            mb={{base: '7px', md: '0px'}}
            src={homeGif.src}
            mx="auto"
            alt="home gif"
            boxSize={{base: '100px', md: '150px'}}
            filter={appCurrentTheme !== LIGHT ? `invert(1)` : ``}
          />
          <Text fontSize="19px" fontWeight="500" textAlign="center">
            Are you sure you want {allocationVal}?
          </Text>
          <HStack mt={{base: '28px', md: '0px'}} justify="space-between" spacing="20px" w="full">
            <Button
              p="13px 32px"
              border="0.75px solid"
              borderColor={`matador_border_color.100`}
              borderRadius="0px"
              h="48px"
              fontSize="16px"
              fontWeight="500"
              bg={`matador_background.100`}
              color={`text`}
              w="full"
              onClick={handleScreen('select allocation')}
            >
              No
            </Button>{' '}
            <Button
              p="13px 32px"
              color="custom_color.contrast"
              bg="custom_color.color"
              borderRadius="0px"
              h="48px"
              fontSize="16px"
              fontWeight="500"
              isLoading={mutation.isLoading}
              onClick={handleSubmitAllocation}
              w="full"
            >
              Yes
            </Button>
          </HStack>
        </Stack>
      </Morphed.body>
    </>
  );
};

export default ConfirmSelection;
