import React, {useState} from 'react';
import {Text, Box, Image, Center, Textarea, useToast, Stack} from '@chakra-ui/react';
import processingLoader from '../../images/processing-transaction.gif';
import successfulLoader from '../../images/successful-transaction.gif';
import {Button} from '../../ui-lib';
import {useMutation} from 'react-query';
import {PostForCustomerEquityValidationoOrDispute} from '../../api/listing';
import {toastForError} from '../../utils/toastForErrors';

const Dispute = ({equityData, setType, customScrollbarStyles, validation_requestsId, drawer}) => {
  const [message, setMessage] = useState('');
  const toast = useToast();

  const disputeEquity = useMutation(
    formData => PostForCustomerEquityValidationoOrDispute(formData),
    {
      onSuccess: res => {
        toast({
          title: `Thank you for the feedback`,
          description: 'We’ll get back to you as soon as possible.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        drawer?.onClose();
      },
      onError: err => {
        toastForError(err, true, toast);
      },
    }
  );

  const handleDispute = () => {
    if (!isValid)
      return toast({
        description: 'Enter your message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    const obj = {
      action: 'reject',
      reason: message,
      validation_request_id: validation_requestsId,
    };
    return disputeEquity.mutate(obj);
  };

  const isValid = !!message.trim();

  const handleResetModal = () => {
    disputeEquity.reset();
    drawer?.onClose();
  };

  return (
    <Box h={'fit-content'} overflowY="auto" __css={customScrollbarStyles}>
      <Stack
        py={{base: `20px`, md: '35px'}}
        color="text"
        fontSize={{base: '13px', md: '16px'}}
        fontWeight={`400`}
        gap={`20px`}
      >
        <Text lineHeight={`140%`} letterSpacing={`0.16px`}>
          {/* Is there any mistake in the information provided? Kindly let us know. */}
          We’re truly sorry for any inconvenience caused. Could you share where we may have fallen
          short so we can address it promptly?{' '}
        </Text>

        <Stack gap={`6px`}>
          <Text lineHeight={`140%`} letterSpacing={`0.16px`}>
            Comments
          </Text>

          <Textarea
            onChange={e => setMessage(e.target.value)}
            value={message}
            resize="none"
            placeholder="Tell us about the issue..."
            border="0.5px solid"
            borderColor={`matador_border_color.100 !important`}
            bg={`matador_background.100`}
            borderRadius={'2px'}
            color={`text`}
            w="full"
            h="100px"
          />
        </Stack>

        <Button
          fontWeight="500"
          w="full"
          h="48px"
          disabled={disputeEquity.isLoading}
          loading={disputeEquity.isLoading}
          onClick={handleDispute}
          align="right"
          color="custom_color.contrast"
          bg="custom_color.color"
          isLoading={disputeEquity.isLoading}
          hoverEffect={false}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default Dispute;
