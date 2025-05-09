import {useEffect, useRef} from 'react';
import {Box, Center, Image, useDisclosure} from '@chakra-ui/react';
import ImageGallery from 'react-image-gallery';
import AssetImagePreview from './assetImagePreview';
import {EmbedVideo} from '.';

const AssetCarouselMobile = ({videoUrl, slideImages, noBorderRadius = false}) => {
  const galleryRef = useRef();
  const gallery_disclosure = useDisclosure();

  useEffect(() => {
    galleryRef.current?.play();
  }, []);

  const handleImageExpansion = index => {
    galleryRef.current?.pause();
    gallery_disclosure?.onOpen(true);
  };

  return (
    <>
      <Box w="full" h="250px" position={`relative`}>
        <Box w="full" h="full">
          <ImageGallery
            onClick={() => handleImageExpansion()}
            showPlayButton={false}
            disableKeyDown
            ref={galleryRef}
            showNav={false}
            slideInterval={3000}
            showThumbnails={false}
            items={slideImages}
            showFullscreenButton={false}
            renderItem={item => (
              <Image
                alt=""
                borderRadius={noBorderRadius ? 'none' : '16px'}
                src={item?.original}
                objectFit={'cover'}
                w="full"
                h="250px"
              />
            )}
          />
          <Center pos={`absolute`} bottom={`5%`} right={`5%`} zIndex={2}>
            {videoUrl ? <EmbedVideo videoUrl={videoUrl} /> : null}
          </Center>
        </Box>
      </Box>

      <AssetImagePreview disclosure={gallery_disclosure} slideImages={slideImages} />
    </>
  );
};

export default AssetCarouselMobile;
