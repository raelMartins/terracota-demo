import {useEffect, useState} from 'react';
import {
  ModalContent,
  Modal,
  ModalOverlay,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';

import {PaymentFlowContent} from './PaymentFlowContent';

const PaymentModal = ({
  setStep,
  paymentType,
  amountToPay,
  modal,
  paymentDetails,
  onCloseModal,
  unitData,
  isFractional,
}) => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth);
    });
  }, []);

  const handlePaymentModalClose = () => {
    setStep && setStep('type');
    onCloseModal();
  };

  return (
    <>
      {screenWidth < 768 ? (
        <Drawer
          onCloseComplete={handlePaymentModalClose}
          isCentered
          onClose={modal?.onClose}
          isOpen={modal?.isOpen}
          placement="bottom"
          borderRadius={{base: '10px', md: '16px'}}
        >
          <DrawerOverlay />
          <DrawerContent
            bg="card_bg"
            color={`text`}
            maxW="560px"
            px={{base: '20px', md: '35px'}}
            minH="401px"
            pt={{base: '18px', md: '30px'}}
            pb={{base: '20px', md: '53px'}}
            // borderTopRadius={{base: '10px', md: '16px'}}
          >
            <PaymentFlowContent
              paymentType={paymentType}
              amountToPay={amountToPay}
              modal={modal}
              paymentDetails={paymentDetails}
              handleClose={handlePaymentModalClose}
              unitData={unitData}
              showTitle
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          autoFocus={false}
          onCloseComplete={handlePaymentModalClose}
          isCentered
          onClose={modal?.onClose}
          isOpen={modal?.isOpen}
          borderRadius={{base: '10px', md: '16px'}}
        >
          <ModalOverlay />
          <ModalContent
            bg="card_bg"
            color={`text`}
            maxW="500px"
            px={{base: '20px', md: '35px'}}
            minH="401px"
            pt={{base: '18px', md: '30px'}}
            pb={{base: '20px', md: '53px'}}
            borderRadius={{base: '10px', md: '5px'}}
          >
            <PaymentFlowContent
              paymentType={paymentType}
              amountToPay={amountToPay}
              modal={modal}
              paymentDetails={paymentDetails}
              handleClose={handlePaymentModalClose}
              unitData={unitData}
              showTitle
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PaymentModal;
