import {Modal, ModalContent, ModalOverlay} from '@chakra-ui/react';
import {useState} from 'react';
import {SelectionFlowPlans} from './plans';
import {fetchAllBundlePaymentPlan, fetchAllUnits} from '@/api/listing';
import {useQuery} from 'react-query';
import {fetchPaymentPlanDoc} from '@/api/listings';
import {SelectionFlowTerms} from './terms';
import {SelectionFlowUnits} from './units';
import {SelectionFlowSummary} from './summary';
import {ResponsivePopup, ResponsivePopupContent} from '@/ui-lib';

export const SelectionFlow = ({
  disclosure,
  auth_disclosure,
  setSelectedUnit,
  listing,
  unit,
  selectedPlan,
  setSelectedPlan,
  setAmountToPay,
  fullPayment,
  setFullPayment,
}) => {
  const [tab, setTab] = useState(unit ? `plans` : `units`);

  //fetch all possible units for this listing
  const {data: units_data, isLoading: units_loading} = useQuery(
    ['all_units', listing?.id],
    () => fetchAllUnits(parseInt(listing?.id)),
    {enabled: !unit ? true : false}
  );

  //fetch all plans for the selected unit
  const {data: plans_data, isLoading: plans_loading} = useQuery(
    ['unit_payment_plans', unit?.id],
    () => fetchAllBundlePaymentPlan(unit?.id),
    {enabled: unit ? true : false}
  );

  //fetch terms document here
  const param = fullPayment
    ? `unit=${unit?.id}&purpose=outright`
    : `plan=${selectedPlan?.id}&purpose=paymentplan`;
  const {data: document_data, isLoading: document_loading} = useQuery(
    ['fetchPaymentPlanDoc', param],
    () => fetchPaymentPlanDoc(param)
  );

  // declare necessary variables here
  const UNITS_DATA = units_data && units_data?.data?.results;
  const PAYMENT_PLAN_DATA = plans_data && plans_data?.data?.results;
  const DOCUMENT =
    document_data?.data?.results?.[0]?.document_file ||
    document_data?.data?.results?.[0]?.document_url;

  const handleClose = () => {
    disclosure?.onClose();
    setTab(unit ? `plans` : `units`);
    setFullPayment(false);
    setSelectedPlan(null);
  };

  const singular_unit = unit || UNITS_DATA?.length < 1;
  const singular_plan =
    PAYMENT_PLAN_DATA?.length < 1 || (PAYMENT_PLAN_DATA && !PAYMENT_PLAN_DATA[0]?.id); //check that there are actual payment plans

  const current_tab = {
    units: (
      <SelectionFlowUnits
        units={UNITS_DATA}
        unitsLoading={units_loading}
        setTab={setTab}
        setSelectedUnit={setSelectedUnit}
        disclosure={disclosure}
      />
    ),
    plans: (
      <SelectionFlowPlans
        plans={PAYMENT_PLAN_DATA}
        planLoading={plans_loading}
        setTab={setTab}
        setFullPayment={setFullPayment}
        setSelectedPlan={setSelectedPlan}
        disclosure={disclosure}
        backScreen={!singular_unit ? `units` : null}
      />
    ),
    summary: (
      <SelectionFlowSummary
        unit={unit}
        selectedPlan={selectedPlan}
        setAmountToPay={setAmountToPay}
        setSelectedPlan={setSelectedPlan}
        setTab={setTab}
        disclosure={disclosure}
        backScreen={!singular_plan ? `plans` : !singular_unit ? `units` : null}
      />
    ),

    terms: (
      <SelectionFlowTerms
        document={DOCUMENT}
        isLoading={document_loading}
        setTab={setTab}
        handleProceed={() => {
          handleClose();
          auth_disclosure?.onOpen();
        }}
        disclosure={disclosure}
      />
    ),
  }[tab];

  return (
    <ResponsivePopup
      isOpen={disclosure?.isOpen}
      onClose={handleClose}
      isCentered
      placement={`bottom`}
    >
      <ResponsivePopupContent
        bg={`matador_background.200`}
        color={`text`}
        p={`16px`}
        maxH={`80vh`}
        overflow={`auto`}
      >
        {current_tab}
      </ResponsivePopupContent>
    </ResponsivePopup>
  );
};
