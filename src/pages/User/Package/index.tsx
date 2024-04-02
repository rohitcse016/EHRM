import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Button, Form, Input, Select, Layout, Space, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import Settings from '../../../../config/defaultSettings';
import { login } from '@/services/apiRequest/api';
import { setPackageId } from '@/utils/common';

const { Header, Footer, Sider, Content } = Layout;

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#ffffff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  backgroundColor: '#ffffff',
  paddingTop: 110
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#ffffff',
};


const Package: React.FC = () => {

  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [currentUser, setCurrentUser] = useState<any>();
  const [packageList, setPackageList] = useState<any>();
  const [form] = Form.useForm();
  const intl = useIntl();


  const onPackageChange = (value: string) => {
    setTimeout(() => {
      // this.setState({ success: false });
      flushSync(() => {
        setInitialState((s: any) => {
          s.currentUser['selectedPackageId'] = value
          return { ...s }
        });
      });
      setPackageId(value);
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
    }, 100);
  };

 
  useEffect(() => {
    setCurrentUser(initialState?.currentUser);
    setPackageList(initialState?.currentUser?.listPackages);
  }, [])

  const onFinish = (values: any) => {
    console.log(values);
  };


  const DemoBox: React.FC<{ children: React.ReactNode; value: number }> = (props) => (
    <p className={`height-${props.value}`}>{props.children}</p>
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
      <Layout>
        <Header style={headerStyle}><h1>Select you Package</h1></Header>
        <Content style={contentStyle}>
          <Row justify="space-around" align="middle">

            <Col span={8}>
              <Form
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item name="package" label="Package" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Package"
                    onChange={onPackageChange}
                    allowClear
                  >
                    {packageList && packageList.map((item: any) => {
                      return <Option value={item.packagE_ID}>{item.packagE_NAME}</Option>
                    })}
                  </Select>
                </Form.Item>

              </Form>
            </Col>

          </Row>
        </Content>
        <Footer style={footerStyle}>EIEHR Portal</Footer>
      </Layout>
    </Space>
  )

  // return (
  //   <Row>
  //     <Col span={8}></Col>
  //     <Col span={8}>
  //       <Space align="center" style={{ marginTop: "20%" }}>
  //         <Form
  //           form={form}
  //           name="control-hooks"
  //           onFinish={onFinish}
  //           layout="vertical"
  //         >
  //           <Form.Item name="package" label="Package" rules={[{ required: true }]}>
  //             <Select
  //               placeholder="Select Package"
  //               onChange={onPackageChange}
  //               allowClear
  //             >
  //               {packageList && packageList.map((item: any) => {
  //                 return <Option value={item.packagE_ID}>{item.packagE_NAME}</Option>
  //               })}
  //             </Select>
  //           </Form.Item>
  //         </Form>
  //       </Space>

  //     </Col>
  //     <Col span={8}></Col>
  //   </Row>
  // );
};

export default Package;
