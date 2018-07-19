import { parse } from 'url';

const walletData = [];
for (let i = 0; i < 78; i += 1) {
  walletData.push({
    key: i,
    disabled: false,
    userId: `userId_${i}`,
    mobNo: `138${Math.floor(Math.random() * 100000000)}`,
    realName: `曲丽丽 ${i}`,
    nickName: `曲丽丽的小名 ${i}`,
    registerTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    balance: Math.floor(Math.random() * 1000).toFixed(2),
    status: 1,
    chargeRecord: [
      {
        key: i,
        time: new Date(`2017-05-${Math.floor(i / 2) + 1}`),
        fee: Math.floor(Math.random() * 1000).toFixed(2),
        type: 1,
      },
      {
        key: i + 1,
        time: new Date(`2017-05-${Math.floor(i / 3) + 7}`),
        fee: Math.floor(Math.random() * 1000).toFixed(2),
        type: 2,
      },
    ],
    isChargedabled: true,
  });
}

export function getWalletList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...walletData];

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

  if (params.mobNo) {
    dataSource = dataSource.filter(data => data.mobNo.indexOf(params.mobNo) > -1);
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

export function updateWalletList(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { userId, fee } = body;

  walletData.forEach((item, index) => {
    if (item.userId === userId) {
      const list = item;
      const money = item.balance;
      list.balance = (Number(money) + Number(fee)).toFixed(2);
      walletData.splice(index, 1, list);
    }
  });

  const result = {
    list: walletData,
    pagination: {
      total: walletData.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
