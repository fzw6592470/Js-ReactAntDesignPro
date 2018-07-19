import { getTransactionDetails } from '../services/transaction';

export default {
  namespace: 'transDetails',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTransactionDetails, payload);

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
      };
    },
  },
};
