import { stringify } from 'qs';
import request from '../utils/request';

export async function getTransactionDetails(params) {
  return request(`/api/transaction/details?${stringify(params)}`);
}

export async function getTransactionRecord(params) {
  return request(`/api/transaction/record?${stringify(params)}`);
}
