import axios from '@/utils/axiosInstance';
import {BaseURL_TWO, BaseURL_ONE, store_name, STORE__DOMAIN} from '../constants/routes.js';
import {getSession} from '@/utils/sessionmanagers';

export const storeDetails = async (storeN = null) => {
  const storeName =
    storeN && (typeof storeN === 'string' || storeN instanceof String) ? storeN : store_name();

  return await axios.get(`${BaseURL_TWO}/store/store_info/?store_name=${storeName}`);
};

export const storeDomainCheck = async domain => {
  return await axios.get(`${BaseURL_TWO}/store/domain-check/${STORE__DOMAIN}`);
};

// POST REQUEST
export const verifyMagicToken = async token => {
  return axios.post(`${BaseURL_TWO}/store/verify-magic-token/`, token);
};

export const AttemptLogin = async data => {
  return await axios.post(`${BaseURL_TWO}/store/login/`, data);
};

export const registerUser = async data => {
  return await axios.post(`${BaseURL_TWO}/store/customers/`, data);
};

export const outreach = async data => {
  return await axios.post(`${BaseURL_TWO}/developers/outreach`, data);
};

// agents

export const VerifyTokenAgents = async data => {
  return await axios.post(`${BaseURL_TWO}/store/verify-agent-token`, data);
};

export const agentLogin = async data => {
  return await axios.post(`${BaseURL_TWO}/store/agent-webstore`, data);
};

export const agentAccount = async data => {
  return await axios.post(`${BaseURL_ONE}/user/agent-login`, data);
};
