import React, { PureComponent, Fragment } from 'react';
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
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ImageWrapper from 'components/ImageWrapper';
import { checkTelphoneNumber, checkPasswordNumber } from '../../utils/formValidate';

import styles from '../List/TableList.less';
import memberStyles from './MemberList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'enable', 'disable'];
const status = ['关闭', '启用', '禁用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleUpdate, handleModalVisible, selectedRows  } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if(selectedRows.length > 0){
        handleUpdate(fieldsValue);
      }else{
        handleAdd(fieldsValue);
      }
      console.log(fieldsValue);
    });
  };

  const checkPhone = (rule, value, callback) => {
    console.log(value);
    if (checkTelphoneNumber(value)) {
      callback();
      return;
    }
    callback('请输入正确的11位手机号码!');
  }

  const checkPassword = (rule, value, callback) => {
    if(checkPasswordNumber(1, value)) {
      callback();
      return;
    }
    callback('请输入正确的6位数字密码!');
  }

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
      title={selectedRows.length>0?"修改会员":"新增会员"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form className="ant-form-hide-required-mark">
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator('mobNo', { initialValue: selectedRows.length>0?selectedRows[0].mobNo:"", rules: [{ validator: checkPhone },{ required: true, message: '请填写您的手机号!' },]  })(<Input placeholder="请输入账号" maxLength="11" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="密码" {...formItemLayout}>
              {getFieldDecorator('password',{ initialValue: selectedRows.length>0?selectedRows[0].password:"", rules: [{ validator: checkPassword }] })(<Input placeholder="请输入密码" maxLength='6' />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('realName', { initialValue: selectedRows.length>0?selectedRows[0].realName:"" })(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="性别" {...formItemLayout}>
              {getFieldDecorator('gender', { initialValue: selectedRows.length>0?selectedRows[0].gender:"1" })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">男</Option>
                  <Option value="0">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="地址" {...formItemLayout}>
              {getFieldDecorator('address', { initialValue: selectedRows.length>0?selectedRows[0].address:"" })(<Input placeholder="请输入地址" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="邮箱" {...formItemLayout}>
              {getFieldDecorator('email', { initialValue: selectedRows.length>0?selectedRows[0].email:"" })(<Input placeholder="请输入邮箱" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="昵称" {...formItemLayout}>
              {getFieldDecorator('nickname', { initialValue: selectedRows.length>0?selectedRows[0].nickname:"" })(<Input placeholder="请输入昵称" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="生日" {...formItemLayout}>
              {getFieldDecorator('birthday', { initialValue: moment(selectedRows.length>0?selectedRows[0].birthday:"", 'YYYY/MM/DD') })(
                <DatePicker style={{ width: '100%' }} placeholder="请输入出生日期" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="会员类型" {...formItemLayout}>
              {getFieldDecorator('type', { initialValue: selectedRows.length>0?selectedRows[0].type:"" })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">个人用户</Option>
                  <Option value="1">集团用户</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="注册类型" {...formItemLayout}>
              {getFieldDecorator('registerType', { initialValue: selectedRows.length>0?selectedRows[0].registerType:"平台注册" })(<Input  />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', { initialValue: selectedRows.length>0?selectedRows[0].status:"有效" })(<Input />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label="设备状态">
              {getFieldDecorator('deviceStatus', { initialValue: selectedRows.length>0?selectedRows[0].deviceStatus:"1" })(
                <Select  style={{ width: '100%' }}>
                  <Option value="1">未激活</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {getFieldDecorator('key',{ initialValue: selectedRows.length>0?selectedRows[0].key:""})(<Input type="hidden" />)}
        {getFieldDecorator('no',{ initialValue: selectedRows.length>0?selectedRows[0].no:""})(<Input type="hidden" />)}
      </Form>
    </Modal>
  );
});

@connect(({ memberList, loading }) => ({
  memberList,
  loading: loading.models.memberList,
}))
@Form.create()
export default class MemberList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberList/fetch',
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
      type: 'memberList/fetch',
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
      type: 'memberList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'memberList/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      case 'update':
        if( selectedRows.length > 1 ) {
          message.warning("您只能选择一条需要修改的记录.");
        }else{
          this.handleModalVisible(true);
        }
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
        type: 'memberList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'memberList/add',
      payload: {
        realName: fields.realName,
        address: fields.address,
        mobNo: fields.mobNo,
        status: fields.status,
        birthday: fields.birthday,
        type: fields.type,
        registerType: fields.registerType,
        deviceType: fields.deviceType,
        nickname: fields.nickname,
        email: fields.email,
        password: fields.password,
        gender: fields.gender,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  handleUpdate = fields => {
    this.props.dispatch({
      type: 'memberList/update',
      payload: {
        key: fields.key,
        no: fields.no,
        realName: fields.realName,
        address: fields.address,
        mobNo: fields.mobNo,
        status: fields.status,
        birthday: fields.birthday,
        type: fields.type,
        registerType: fields.registerType,
        deviceType: fields.deviceType,
        nickname: fields.nickname,
        email: fields.email,
        password: fields.password,
        gender: fields.gender,
      },
    });

    message.success('修改成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="账号">
              {getFieldDecorator('no')(<Input placeholder="请输入账号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">正常</Option>
                  <Option value="0">禁止</Option>
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
            <FormItem label="账号">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">开启</Option>
                  <Option value="2">禁止</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="登录密码">
              {getFieldDecorator('password')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="生日">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入出生日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="会员类型">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">个人</Option>
                  <Option value="1">集团</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('status4')(<Input placeholder="请输入姓名" />)}
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
    //return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderSimpleForm();
  }

  render() {
    const { memberList, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const { data } =  memberList ;

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
        title: '性别',
        dataIndex: 'gender',
        //sorter: true,
        //align: 'right',
        //render: val => `${val} 万`,
        // mark to display a total number
        //needTotal: true,
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
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '地址',
        dataIndex: 'address',
        //render: () => (
        //  <Fragment>
        //    <a href="">配置</a>
        //    <Divider type="vertical" />
        //    <a href="">订阅警报</a>
        //  </Fragment>
        //),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: '登录密码',
        dataIndex: 'password',
      },
      {
        title: '会员类型',
        dataIndex: 'type',
      },
      {
        title: '注册类型',
        dataIndex: 'registerType',
      },
      {
        title: '设备状态',
        dataIndex: 'deviceType',
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="update">修改</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} selectedRows={selectedRows}  />
        <ImageWrapper src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png" desc="示意图" />
      </PageHeaderLayout>
    );
  }
}
