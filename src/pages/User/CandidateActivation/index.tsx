import type { ProFormInstance } from '@ant-design/pro-components';
import {
  StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Layout } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import './addCandidate.css'
import { requestAddCandidate } from '@/pages/Candidate/services/api';

const { Header, Footer, Content } = Layout;

const dateFormat = 'YYYY/MM/DD';

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000000',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#ffffff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#ffffff',
  paddingTop: 70
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#ffffff',
};

const formDefaultValue = {
  "onlinePatientID": "0",
  "eMail": "",
  "password": "",
  "curMobileNoCC": "",
  "curMobileNo": "",
  "fName": "",
  "mName": "",
  "lName": "",
  "genderID": 0,
  "fNameML": "",
  "dob": "2023-11-28T12:49:16.420Z",
  "nationalityID": 0,
  "uniqueID": 0,
  "uniqueName": "",
  "curAddress": "",
  "otp": "",
  "userID": "-1",
  "formID": -1,
  "type": "4"
}

const CandidateActivation = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
  const formRef = useRef<ProFormInstance>();
  const { token } = theme.useToken();
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [isOtpVisible, setOTPVisible] = useState(false);
  const [candidateData, setCandidateData] = useState(formDefaultValue);

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  };


  const convertDate = (inputDateString: string) => {
    // Parse the input date string using Moment.js
    const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
    // Format the parsed date in the desired format
    const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    console.log(formattedDate);
    return formattedDate
  }


  const addCandidate = async (values: any) => {
    try {
      setLoading(true)
      const msg = await requestAddCandidate({ ...candidateData, ...values });
      setLoading(false)
      if (msg.isSuccess === true) {
        formRef.current?.resetFields();
        message.success(msg.msg);
        setOTPVisible(true);
        setCandidateData({ ...candidateData, ...values })
        // requestForOTP({ ...candidateData, ...values })
        return;
      } else {
        message.error(msg.msg);
      }

    } catch (error) {
      setLoading(false)
      const defaultLoginFailureMessage = "failed, please try again!";
      console.log({ error });
      message.error(defaultLoginFailureMessage);
    }
  };

  const requestForOTP = async (params: any) => {
    try {
      setLoading(true)
      params['type'] = 4;
      const msg = await requestAddCandidate(params);
      setLoading(false)
      if (msg.isSuccess === "True") {
        // message.success(msg.msg);
        return;
      } else {
        message.error(msg.msg);
      }

    } catch (error) {
      setLoading(false)
      const defaultLoginFailureMessage = "Please try again!";
      message.error(defaultLoginFailureMessage);
    }
  }

  const requestForValidateOTP = async (params: any) => {
    try {
      setLoading(true)
      const data: any = { ...candidateData };
      data['type'] = 5;
      data['otp'] = params.otp;
      const msg = await requestAddCandidate(data);
      setLoading(false)
      if (msg.isSuccess === "True") {
        message.success(msg.msg);
        const urlParams = new URL(window.location.href).searchParams;
        setTimeout(() => {
          history.push(urlParams.get('redirect') || '/user/login');
        }, 1000)
        return;
      } else {
        message.error(msg.msg);
      }

    } catch (error) {
      setLoading(false)
      const defaultLoginFailureMessage = "Please try again!";
      message.error(defaultLoginFailureMessage);
    }
  }

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    requestForValidateOTP(values);
  };
  const goBack = () => {
    history.push("/")
  }

  const activateCandidateActivation = () => {
    return (
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={async (values) => {
          addCandidate(values)
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="curMobileNo"
          label="Mobile No"
          rules={[
            { required: true, type: 'string', message: 'Please enter mobile number' },
            {
              pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
              message: 'Please enter a valid mobile number',
            }
          ]}
        >
          <Input
            maxLength={10}
            placeholder="Please enter mobileNo" />
        </Form.Item>

        <Form.Item
          name="eMail"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
        >
          <Input maxLength={80} placeholder="Please enter Email" />
        </Form.Item>

        <div style={{ alignContent: 'center', display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={goBack} type="primary" htmlType="submit" className="login-form-button">
              Cancel
            </Button>
          </Form.Item>
        </div>

      </Form>
    )
  }

  const addOtpForm = () => {
    return (
      <>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <h2>{'OTP Verification'}</h2>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: 'Please input your valid otp!' }]}
          >
            <Input placeholder="Enter the otp here" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Verify
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" htmlType="submit" className="login-form-button">
              Resend the OTP
            </Button>
          </Form.Item>
        </Form>
      </>
    )
  }

  return (
    <>

      <>
        <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
          <Layout>
            <Header style={headerStyle}>
              <h2>Activate Patient</h2>
            </Header>
            <Content style={contentStyle}>
              <Spin tip="Please wait..." spinning={loading}>
                <Row justify="space-around" align="middle">
                  {!isOtpVisible ? activateCandidateActivation() : addOtpForm()}
                </Row>
              </Spin>
            </Content>
            <Footer style={footerStyle}></Footer>
          </Layout>
        </Space>
      </>
    </>
  );
};



export default CandidateActivation;