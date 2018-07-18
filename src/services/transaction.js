import request from '../utils/request';
import { stringify } from 'qs';

export async function getTransactionDetails(params) {
  return request(`/api/transaction/details?${stringify(params)}`);
}

export async function getTransactionRecord(params) {
  return request(`/api/transaction/record?${stringify(params)}`);
}
