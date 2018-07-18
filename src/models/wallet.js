import { queryWalletList, chargeWalletFee } from '../services/wallet';

export default {

  namespace: 'wallet',

  state: {
    data: {
      list: [],
      pageination: {},
    }
  },

  effects :{
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWalletList, payload);

      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *charge({ payload }, { call, put }) {
      const response = yield call(chargeWalletFee, payload);

      yield put({
        type: 'chargeWallet',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
    chargeWallet(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
  }

}
