import {Box, HStack, Hide, Image, Stack, Text, useDisclosure} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {MobileHamburger} from '../../../navbar/mobile_hamburger';
import {ArrowBackIcon} from '@chakra-ui/icons';

const AssetWrapper = ({children}) => {
  const router = useRouter();
  const {isOpen: isAssetOpen, onOpen: onAssetOpen, onClose: onAssetClose} = useDisclosure();

  return (
    <>
      <Stack
        w="full"
        spacing={{base: '13px', xl: '0px'}}
        py={{base: '16px', xl: '21.88px'}}
        // pb={{base: '16px', xl: '59.5px'}}
      >
        {/* <Hide above="lg"> */}{' '}
        <HStack px="20px" display={{base: 'flex', xl: 'none'}} justify="space-between">
          <HStack
            role="button"
            w="fit-content"
            onClick={router.back}
            // onClick={onAssetOpen}
            spacing="14px"
          >
            {/* <Image src={angledArrow.src} alt="back arrow" boxSize="24px" /> */}
            <ArrowBackIcon fontSize={'22px'} cursor="pointer" color="text" />

            <Text
              fontSize="23px"
              fontWeight="500"
              className="heading-text-regular"
              color="matador_text.100"
            >
              Portfolio
            </Text>
          </HStack>
          <MobileHamburger
            onAssetClose={onAssetClose}
            onAssetOpen={onAssetOpen}
            isAssetOpen={isAssetOpen}
          />
        </HStack>
        {/* </Hide> */}
        <Stack w="full" align="center" spacing={{base: '16px', xl: '0px'}}>
          {children}
        </Stack>
      </Stack>
    </>
  );
};

export default AssetWrapper;
