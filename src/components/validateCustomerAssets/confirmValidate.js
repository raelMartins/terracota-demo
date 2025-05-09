import {Box, Flex, Text, Center, Image, HStack, useToast} from '@chakra-ui/react';
import {Button, CustomizableButton} from '../../ui-lib';
import processingLoader from '../../images/processing-transaction.gif';
import successfulLoader from '../../images/successful-transaction.gif';
import orangeAlertIcon from '../../images/icons/orange-alert-icon.svg';
import {useMutation} from 'react-query';
import {PostForCustomerEquityValidationoOrDispute} from '../../api/listing';
import {toastForError} from '../../utils/toastForErrors';

const ConfirmValidate = ({validation_requestsId, refetch, setType, customScrollbarStyles}) => {
  const toast = useToast();
  const validateEquity = useMutation(
    formData => PostForCustomerEquityValidationoOrDispute(formData),
    {
      onSuccess: async res => {
        await refetch();
        setType('list');
        toast({
          // title: `Thank you for the feedback`,
          description: 'Validation Successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onError: err => {
        toastForError(err, true, toast);
      },
    }
  );

  const handleValidation = () => {
    const obj = {
      action: 'accept',
      validation_request_id: validation_requestsId,
    };

    return validateEquity.mutate(obj);
  };

  return (
    <Box h={'fit-content'} overflowY="auto" __css={customScrollbarStyles}>
      <Flex p="12px" w="full" direction="column" justify={'center'} align={'center'} gap="20px">
        <Text
          color="text"
          fontWeight={500}
          fontSize="30px"
          lineHeight={'36px'}
          className="heading-text-regular"
        >
          Are you sure?
        </Text>
        <HStack
          align="start"
          spacing="7.42px"
          p="10px"
          w="full"
          borderRadius="2px"
          border="0.5px solid #DD4449"
          bg="rgba(221, 68, 73, 0.1)"
        >
          <Image src={orangeAlertIcon.src} alt="orange alert icon" />
          <Text mt="-2px" fontSize="11.448px" fontWeight="300" color="#DD4449">
            We kindly request your confirmation regarding the property, amount paid, and transaction
            date. If any information is inaccurate, please initiate a dispute. However, if all
            details are accurate, we kindly ask you to proceed with validation.
          </Text>
        </HStack>

        <Flex mt="10px" gap="8px" align="center" mx={'auto'} w="full">
          <CustomizableButton
            border="1px solid !important"
            borderColor="custom_color.color !important"
            color="custom_color.color"
            bg="custom_color.background"
            h="49px"
            w="50%"
            onClick={() => setType('summary')}
          >
            No, Go back
          </CustomizableButton>
          <Button
            onClick={handleValidation}
            color="custom_color.contrast"
            bg="custom_color.color"
            h="49px"
            w="50%"
            isLoading={validateEquity.isLoading}
          >
            Yes, Validate
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ConfirmValidate;
