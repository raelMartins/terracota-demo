import {Flex, HStack, Stack, Text, useDisclosure} from '@chakra-ui/react';
import {PropertyImageDisplay} from './components/PropertyImageDisplay';
import {Button} from '@/ui-lib';
import {HiOutlineLocationMarker} from 'react-icons/hi';
import {SelectionFlow} from './components/SelectionFlow';
import {DirectPurchaseAuthFlow} from './components/AuthFlow';

export const SelectAsset = ({
  listing,
  unit,
  nextStep,
  setSelectedUnit,
  selectedPlan,
  setSelectedPlan,
  setAmountToPay,
  fullPayment,
  setFullPayment,
}) => {
  const disclosure = useDisclosure();
  const auth_disclosure = useDisclosure();

  const brochure_url =
    listing?.property_document?.find(el => el.purpose === `brochure`)?.document_url ||
    listing?.property_document?.find(el => el.purpose === `brochure`)?.document_file ||
    listing?.property_document?.[0]?.document_url ||
    listing?.property_document?.[0]?.document_file ||
    null;

  return (
    <>
      <Stack maxW={`544px`} w={`100%`} gap={`32px`}>
        <PropertyImageDisplay images={unit ? unit?.photos : listing?.photos} />
        <Flex direction={`column`} gap={`8px`}>
          <Text
            fontWeight={{base: `400`}}
            fontSize={{base: `24px`}}
            lineHeight={{base: `100%`}}
            letterSpacing={{base: `-2%`}}
          >
            {unit && `${unit?.unit_title} ,`}
            {listing?.name}
          </Text>
          <HStack color={`matador_form.label`} gap={`6px`}>
            <HiOutlineLocationMarker />

            <Text
              fontWeight={{base: `400`}}
              fontSize={{base: `16px`}}
              lineHeight={{base: `140%`}}
              letterSpacing={{base: `1%`}}
            >
              {listing?.address}
            </Text>
          </HStack>
        </Flex>
        <HStack>
          {brochure_url && (
            <Button variation={`type-4`} w={`100%`} onClick={() => window.open(brochure_url)}>
              Open Brochure
            </Button>
          )}
          <Button variation={`primary`} w={`100%`} onClick={disclosure?.onOpen}>
            Secure {unit ? `unit` : `listing`}
          </Button>
        </HStack>
      </Stack>
      <SelectionFlow
        listing={listing}
        unit={unit}
        setSelectedUnit={setSelectedUnit}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        setAmountToPay={setAmountToPay}
        fullPayment={fullPayment}
        setFullPayment={setFullPayment}
        disclosure={disclosure}
        auth_disclosure={auth_disclosure}
      />
      <DirectPurchaseAuthFlow
        disclosure={auth_disclosure}
        nextStep={nextStep}
        listing={listing}
        unit={unit}
      />
    </>
  );
};
