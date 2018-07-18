import { getTransactionRecord } from '../services/transaction';

export default {

  namespace: 'transRecord',

  state: {
    data: {
      list: [],
      pagination: {},
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTransactionRecord, payload);

      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        data: action.payload,
      }
    },
  }

};
