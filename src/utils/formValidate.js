const checkTelphoneNumber = num => {
  const reg = /^1(3[0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/;
  return reg.test(num);
};

/**
 * @param
 *        type 校验密码类型。1-属于6位数字密码，2-属于6-12位数字字母组合密码
 *        num  密码
 * @return boolean
 */
const checkPasswordNumber = (type, num) => {
  let reg;
  if (type === 1) {
    reg = /^[0-9]{6}$/;
  } else {
    reg = /^\d{6,12}$/;
  }
  return reg.test(num);
};

export { checkTelphoneNumber, checkPasswordNumber };
