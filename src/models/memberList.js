import { queryMemberList, addMemberList, deleteMemberList, updateMemberList } from '../services/memberList';

export default {
  // 在common->route中定义路由时[]中的内容
  namespace: 'memberList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  // 定义的方法将在routes中调用
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMemberList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMemberList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteMemberList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMemberList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback();
    },
  },

  // reducers负责返回数据
  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveList(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  },
};


