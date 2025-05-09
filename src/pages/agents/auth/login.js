import Register from '/src/components/auth/register';
import {AuthLayout} from '../../../components/page_layout/AuthLayout';
import AgentRegister from '../../../realtors_portal/components/auth/agent_register';
import {declinceAppAccessDueToPayment, store_name} from '../../../constants/routes';
import ServiceDowntime from '../../service_downtime';

export default function RealtorLogin() {
  const storeName = store_name();
  return declinceAppAccessDueToPayment?.includes(storeName) ? (
    <ServiceDowntime />
  ) : (
    <AuthLayout agent authPage />
  );
}
