import { parse } from 'url';
import moment from 'moment';

const transRecrod = [];
const transDetails = [];
const parkingNames = [0, 1];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
for (let i = 0; i < 88; i += 1) {
  const amountFee = Number(Math.floor(Math.random() * 1000));
  const paidedFee = Number(Math.floor(Math.random() * 100));
  const cancelFee = amountFee - paidedFee - i;
  transRecrod.push({
    key: i,
    disabled: false,
    wasteNo: `wasteNo_${i}`,
    transTime: moment(new Date(new Date().getTime() - 1000 * 60 * 60 * i)).format(
      'YYYY-MM-DD HH:mm:ss'
    ),
    amount: amountFee.toFixed(2),
    paided: paidedFee.toFixed(2),
    free: i.toFixed(2),
    cancelAmount: cancelFee.toFixed(2),
    parkingName: parkingNames[i % 2],
  });
  transDetails.push({
    key: i,
    disabled: false,
    platNo: `粤B${getRandomArrayElements(numbers, 5).join('')}`,
    mobNo: `138${Math.floor(Math.random() * 100000000)}`,
    name: `龙丽丽${i}`,
    orderType: i % 3,
    orderStatus: i % 3,
    orderFee: Number(Math.floor(Math.random() * 1000)).toFixed(2),
    payTime: moment(new Date(new Date().getTime() - 1000 * 60 * 60 * i)).format(
      'YYYY-MM-DD HH:mm:ss'
    ),
    payType: i % 5,
    orderTime: moment(new Date(new Date().getTime() - 1000 * 60 * 60 * i)).format(
      'YYYY-MM-DD HH:mm:ss'
    ),
  });
}

function getRandomArrayElements(arr, count) {
  const shuffled = arr.slice(0);
  let i = arr.length;
  const min = i - count;
  let temp;
  let index;
  while ((i -= 1) > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

export function getTransRecord(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...transRecrod];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.parkingName && params.parkingName !== '-1') {
    const parkingName = params.parkingName.split(',');
    let filterDataSource = [];
    parkingName.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.parkingName, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.startDate) {
    dataSource = dataSource.filter(data => data.transTime >= params.startDate);
  }
  if (params.endDate) {
    dataSource = dataSource.filter(data => data.transTime < params.endDate);
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

export function getTransDetails(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...transDetails];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.date) {
    dataSource = dataSource.filter(
      data => data.transTime > params.date[0] && data.transTime < params.date[1]
    );
  }

  if (params.platNo) {
    dataSource = dataSource.filter(data => data.platNo.indexOf(params.platNo) > -1);
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
