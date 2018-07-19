import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Table,
  Button,
  DatePicker,
  Modal,
  message,
  Badge,
} from 'antd';
import ImageWrapper from 'components/ImageWrapper';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { checkTelphoneNumber } from '../../utils/formValidate';

import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'enable', 'disable'];
const status = ['关闭', '启用', '禁用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, handleModalVisible, records, loading } = props;
  const columns = [
    {
      title: '充值时间',
      dataIndex: 'time',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '充值费用(元)',
      dataIndex: 'fee',
    },
    {
      title: '支付方式',
      dataIndex: 'type',
      render(val) {
        return val === 1 ? '微信支付' : val === 2 ? '支付宝支付' : '银联支付';
      },
    },
  ];
  const closable = false;
  return (
    <Modal
      closable={closable}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={<Button onClick={() => handleModalVisible()}>确定</Button>}
      destroyOnClose
    >
      <Table bordered rowKey="key" loading={loading} dataSource={records} columns={columns} />
    </Modal>
  );
});

const WalletChargeForm = Form.create()(props => {
  const { chargeWalletVisible, form, handleAdd, handleChargeWalletVisible, selectRow } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const checkPhone = (rule, value, callback) => {
    if (checkTelphoneNumber(value)) {
      callback();
      return;
    }
    callback('请输入正确的11位手机号码!');
  };

  const checkMoney = (rule, value, callback) => {
    if (value <= 0 || value > 2000) {
      callback('不能输入超过2000元！');
      return;
    }
    callback();
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  return (
    <Modal
      title="充值"
      destroyOnClose
      visible={chargeWalletVisible}
      onOk={okHandle}
      onCancel={() => handleChargeWalletVisible()}
    >
      <Form className="ant-form-hide-required-mark">
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator('mobNo', {
                initialValue: selectRow ? selectRow.mobNo : '',
                rules: [
                  { validator: checkPhone },
                  { required: true, message: '请填写您的手机号!' },
                ],
              })(<Input placeholder="请输入账号" maxLength="11" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="充值金额" {...formItemLayout}>
              {getFieldDecorator('fee', {
                initialValue: '',
                rules: [
                  { validator: checkMoney },
                  { required: true, message: '请填写需要充值的金额！' },
                ],
              })(<Input placeholder="请输入充值金额(元)" maxLength="6" />)}
            </FormItem>
          </Col>
        </Row>
        {getFieldDecorator('key', { initialValue: selectRow ? selectRow.key : '' })(
          <Input type="hidden" />
        )}
        {getFieldDecorator('userId', { initialValue: selectRow ? selectRow.userId : '' })(
          <Input type="hidden" />
        )}
      </Form>
    </Modal>
  );
});

@connect(({ wallet, loading }) => ({
  wallet,
  loading: loading.models.wallet,
}))
@Form.create()
export default class Wallet extends PureComponent {
  state = {
    modalVisible: false,
    chargeWalletVisible: false,
    record: [],
    formValues: {},
    selectRow: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wallet/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'wallet/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'wallet/fetch',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'wallet/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleChargeWalletVisible = flag => {
    this.setState({
      chargeWalletVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'wallet/charge',
      payload: {
        mobNo: fields.mobNo,
        fee: fields.fee,
        key: fields.key,
        userId: fields.userId,
      },
    });

    message.success('添加成功');
    this.setState({
      chargeWalletVisible: false,
    });
  };

  showChargeRecord = records => {
    if (!records) {
      message.error('没有充值记录。');
      return;
    }

    this.setState({
      modalVisible: true,
      record: records,
    });
  };

  showChargeForm = row => {
    this.setState({
      chargeWalletVisible: true,
      selectRow: row,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('mobNo')(<Input placeholder="手机号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">启用</Option>
                  <Option value="2">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('mobNo')(<Input placeholder="请输入手机号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">启用</Option>
                  <Option value="2">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="注册时间">
              {getFieldDecorator('registerTime')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入注册时间" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const self = this;
    const { wallet, loading } = this.props;
    const { record, selectRow, modalVisible, chargeWalletVisible } = this.state;
    const { data } = wallet;

    const columns = [
      {
        title: '手机号码',
        dataIndex: 'mobNo',
      },
      {
        title: '姓名',
        dataIndex: 'realName',
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '当前余额(元)',
        dataIndex: 'balance',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
        ],
        onFilter: (value, records) => records.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '充值记录',
        dataIndex: 'chargeRecord',
        sorter: true,
        render(val) {
          return (
            <Button
              onClick={function() {
                self.showChargeRecord(val);
              }}
            >
              查看
            </Button>
          );
        },
      },
      {
        title: '充值',
        dataIndex: 'isChargedabled',
        render: (val, row) => (
          <Button
            disabled={!val}
            onClick={function() {
              self.showChargeForm(row);
            }}
          >
            充值
          </Button>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleChargeWalletVisible: this.handleChargeWalletVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table bordered loading={loading} dataSource={data.list} columns={columns} />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          records={record}
          loading={loading}
        />
        <WalletChargeForm
          {...parentMethods}
          chargeWalletVisible={chargeWalletVisible}
          selectRow={selectRow}
        />
        <ImageWrapper
          src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png"
          desc="示意图"
        />
      </PageHeaderLayout>
    );
  }
}
