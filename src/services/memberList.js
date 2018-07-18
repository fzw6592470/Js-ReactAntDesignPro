import { stringify } from 'qs';
import request from '../utils/request';

export async function queryMemberList(params) {
    return request(`/api/member/list?${stringify(params)}`);
}

export async function addMemberList(params) {
  return request('/api/member/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'add'
    }
  });
}


export async function deleteMemberList(params) {
  return request('/api/member/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete'
    }
  });
}




export async function updateMemberList(params) {
  return request('/api/member/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'update'
    }
  });
}




