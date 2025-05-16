import {PaymentFlowContent} from '@/components/payment/PaymentFlowContent';
import {Stack} from '@chakra-ui/react';

export const PaymentMethod = ({
  listing,
  unit,
  selectedPlan,
  setScreen,
  fullPayment,
  amountToPay,
}) => {
  const paymentDetails = {
    paymentplan_id: selectedPlan?.id,
    bundle_id: selectedPlan?.bundle?.id || unit?.id,
    type: 'WHOLE',
  };

  return (
    <Stack
      maxW={`480px`}
      w={`100%`}
      gap={`32px`}
      bg={`matador_background.200`}
      p={{base: `20px`, md: `40px`}}
    >
      <PaymentFlowContent
        purchaseType={`direct_purchase`}
        onSelectBankTransfer={() => setScreen(`bank_transfer`)}
        onSelectInstantBankTransfer={() => setScreen(`instant_bank_transfer`)}
        handleClose={() => setScreen(`payment_method`)}
        asset_id={listing?.id}
        fullPayment={fullPayment}
        paymentType={'asset'}
        selectedPlan={selectedPlan}
        amountToPay={amountToPay}
        modal={null}
        paymentDetails={paymentDetails}
        unitData={unit}
      />
    </Stack>
  );
};
