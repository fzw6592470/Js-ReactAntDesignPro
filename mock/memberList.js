import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    disabled: false,
    no: `TradeCode ${i}`,
    realName: '曲丽丽',
    address: '这是一段描述',
    mobNo: `138${Math.floor(Math.random() * 100000000)}`,
    status: [1, 2, 3][i % 3],
    birthday: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    registerTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    type: '普通',
    registerType: '个人',
    deviceType: '启用',
    nickname: `曲丽丽 ${i}`,
    email: `${i} @qq.com`,
    password: '123456',
    gender: '女',
  });
}

export function getMemberList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function operateMemberList(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== ['object String']) {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const {
    method,
    no,
    key,
    realName,
    address,
    mobNo,
    status,
    birthday,
    type,
    registerType,
    nickname,
    email,
    password,
    gender,
  } = body;

  const i = Math.ceil(Math.random() * 10000);
  switch (method) {
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => no.indexOf(item.no) === -1);
      break;
    case 'add':
      tableListDataSource.unshift({
        key: i,
        disabled: false,
        no: `TradeCode ${i}`,
        realName,
        address,
        mobNo,
        status,
        birthday,
        type,
        registerType,
        nickname,
        email,
        password,
        gender,
      });
      break;
    case 'update':
      tableListDataSource.forEach((item, index) => {
        if (item.no === no) {
          const list = {
            key,
            disabled: false,
            no,
            realName,
            address,
            mobNo,
            status,
            birthday,
            type,
            registerType,
            nickname,
            email,
            password,
            gender,
          };
          tableListDataSource.splice(index, 1, list);
        }
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  //  console.log(result);
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getMemberList,
  operateMemberList,
};
