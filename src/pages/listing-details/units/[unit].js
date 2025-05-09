import {AuthLayout} from '@/components/page_layout/AuthLayout';
import {UnitPage} from '@/components/properties/units/UnitPage';

const Unit = () => {
  return <AuthLayout InnerComponent={<UnitPage />}></AuthLayout>;
};

export default Unit;
