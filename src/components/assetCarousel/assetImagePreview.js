import React from 'react';
import {
  Box,
  HStack,
  Image,
  Icon,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';
import {Carousel} from 'react-responsive-carousel';
import thinArrow from '@/images/icons/thin-arrow.svg';
import {IoMdClose} from 'react-icons/io';

const buttonStyles = {
  zIndex: 2,
  top: '50%',
  display: 'flex',
  aspectRatio: 1 / 1,
  position: 'absolute',
  borderRadius: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'xl',
  border: '1px solid #EAEAEA',
  backgroundColor: '#FFFFFFB2',
};

const AssetImagePreview = ({disclosure, slideImages}) => {
  return (
    <Modal isOpen={disclosure?.isOpen} onClose={disclosure?.onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{base: `70vw`, lg: `50vw`, xl: `1000px`}}
        bg={`transparent`}
        boxShadow={`none`}
      >
        <Carousel
          showThumbs={false}
          showStatus={false}
          useKeyboardArrows
          renderArrowPrev={(clickHandler, hasPrev) => (
            <>
              {hasPrev && (
                <Box
                  {...buttonStyles}
                  onClick={clickHandler}
                  cursor={'pointer'}
                  right={{base: '90%', md: '94%'}}
                  position="fixed"
                  width={{base: 'unset', md: '5%'}}
                >
                  <Center w="full" h="full" p={{base: '5px', md: '18px'}}>
                    <Image transform="rotate(180deg)" src={thinArrow.src} alt="left arrow" />
                  </Center>
                </Box>
              )}
            </>
          )}
          renderArrowNext={(clickHandler, hasNext) => (
            <>
              {hasNext && (
                <Box
                  {...buttonStyles}
                  onClick={clickHandler}
                  cursor={'pointer'}
                  left={{base: '90%', md: '94%'}}
                  position="fixed"
                  width={{base: 'unset', md: '5%'}}
                >
                  <Center w="full" h="full" p={{base: '5px', md: '18px'}}>
                    <Image src={thinArrow.src} alt="right arrow" />
                  </Center>
                </Box>
              )}
            </>
          )}
        >
          {slideImages?.map((photo, id) => (
            <Center key={id} position="relative" margin="auto auto" maxW="80vw" maxH={`80vh`}>
              <Image src={photo?.original} alt="ues" maxH={`100%`} maxW={`100%`} />
            </Center>
          ))}
        </Carousel>
      </ModalContent>
    </Modal>
  );
};

export default AssetImagePreview;
