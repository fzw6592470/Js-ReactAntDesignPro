import { stringify } from 'qs';
import request from '../utils/request';

export async function queryWalletList(params) {
  return request(`/api/member/wallet?${stringify(params)}`);
}
export async function chargeWalletFee(params) {
  return request('/api/member/wallet', {
    method: 'POST',
    body: {
      ...params,
      method: 'charge'
    }
  });
}

