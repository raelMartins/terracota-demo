import React, {useEffect, useRef, useState} from 'react';
import {Box, Text, Flex, HStack, Image as ChakraImage, useDisclosure} from '@chakra-ui/react';
import AssetImagePreview from './assetImagePreview';
import {BsImage} from 'react-icons/bs';
import videoIcon from '../../images/icons/videoIcon.svg';
import Image from 'next/image';

const AssetCarousel = ({videoUrl, slideImages, ...rest}) => {
  const gallery_disclosure = useDisclosure();

  useEffect(() => {
    const slider = document.getElementById(`image_slider`);
    if (slideImages?.length === 1) return;
    let step = 1;
    setInterval(() => {
      if (step == slideImages?.length) {
        step = 1;
        slider.scrollTo(0, 0);
      } else {
        step++;
        slider.scrollBy(slider.clientWidth || 1000, 0);
      }
    }, 3000);
  }, []);

  const handleImageExpansion = index => {
    gallery_disclosure.onOpen();
  };

  return (
    <>
      <Box position={`relative`} onClick={() => handleImageExpansion()}>
        <Box
          position="absolute"
          top={`0px`}
          left={`0px`}
          bottom={`0px`}
          right={`0px`}
          zIndex={`1`}
        />
        <Box
          w="100%"
          overflowX={`auto`}
          overflowY={`hidden`}
          h="516px"
          position={'relative'}
          css={{
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
          id={`image_slider`}
          scrollBehavior={`smooth`}
          scrollSnapType={`x mandatory`}
          bg={`rgba(0,0,0,.8)`}
          {...rest}
        >
          <Flex w={`${slideImages?.length}00%`} position={'relative'}>
            {slideImages?.map((slideImage, i) => (
              <Box
                key={i}
                alt="next_image"
                w="full"
                h="516px"
                onClick={() => handleImageExpansion()}
                position={`relative`}
                scrollSnapAlign={`start`}
              >
                <Image
                  cursor={'pointer'}
                  fill
                  style={{objectFit: `cover`}}
                  src={slideImage?.original}
                  alt={`Image`}
                />
              </Box>
            ))}
          </Flex>
        </Box>
        <StatusBox total={slideImages?.length} videoUrl={videoUrl} />
      </Box>
      <AssetImagePreview disclosure={gallery_disclosure} slideImages={slideImages} />
    </>
  );
};

export default AssetCarousel;

const StatusBox = ({total, videoUrl}) => {
  return (
    <HStack position={'absolute'} bottom={'5%'} right={'5%'} zIndex={2} spacing="14px">
      <Flex
        bg={'#FFFFFFCC'}
        color={'#191919'}
        py={'8px'}
        px={'10px'}
        gap={'12px'}
        align={'center'}
        borderRadius={'5px'}
      >
        <BsImage size={'18px'} />
        <Text>
          {total} {total > 1 ? 'Photos' : 'Photo'}
        </Text>
      </Flex>
      {videoUrl ? <EmbedVideo videoUrl={videoUrl} /> : null}
    </HStack>
  );
};

export const EmbedVideo = ({videoUrl}) => {
  const iframeRef = useRef(null);
  const playRef = useRef(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const playVideo = () => {
    setIsVideoVisible(true);

    const element = playRef?.current;

    // Modify the styles or attributes
    if (element) {
      element.style.opacity = '0'; // Change opacity to 0.5 (50%)
      element.style.pointerEvents = 'none'; // Disable pointer events
      element.style.visibility = 'hidden'; // Hide the element (it won't occupy space)
    }
  };

  useEffect(() => {
    function handleFullscreenChange() {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // The video is no longer in fullscreen
        setIsVideoVisible(null);
      }
    }

    // Add an event listener for fullscreenchange
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    var rx =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    const r = videoUrl.match(rx);
    const videoId = r[1];

    if (isVideoVisible) {
      // Play the video
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      // Request fullscreen for the iframe
      const iframe = iframeRef.current;
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  }, [isVideoVisible]);

  return (
    <>
      <Flex
        bg={'#FFFFFFCC'}
        onClick={playVideo}
        py={'8px'}
        px={'10px'}
        align={'center'}
        borderRadius={'5px'}
        cursor="pointer"
      >
        <ChakraImage src={videoIcon.src} fontSize="4px" alt="youtube icon for listing" />
      </Flex>
      {isVideoVisible ? (
        <iframe
          ref={iframeRef}
          style={{
            position: `fixed`,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: '',
            width: '100%',
            height: '100%',
            maxWidth: '660px',
            maxHeight: '587px',
            backgroundColor: '#000000',
          }}
          controls="false"
          width="660"
          height="587"
          src={``}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      ) : null}
    </>
  );
};
