import React, { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { login } from '@/services/apiRequest/api';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
  AlipayOutlined,
  TaobaoOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  LoginFormPage
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Tabs, Button, Divider, Space } from 'antd';
import { flushSync } from 'react-dom';
import { setPackageId } from '@/utils/common';
import { requestGetDocuments } from '@/pages/Candidate/services/api';

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const [loginType, setLoginType] = useState<LoginType>('phone');
  const [imgBase64, setImageBase64] = useState<string>('');

  useEffect(() => {
    getImgUrl();
  }, [])
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });


  const handleSubmit = async (values: API.LoginParams) => {
    try {

      const staticParams = {
        orgID: "-1",
        packageID: "-1",
        token: ""
      };

      const msg = await login({ ...values, ...staticParams, type });

      if (msg.verifiedUser.isVerify) {
        localStorage.setItem('user', JSON.stringify(msg));
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'login successful!',
        });

        setTimeout(() => {
          // this.setState({ success: false });
          const urlParams = new URL(window.location.href).searchParams;
          if (msg?.listPackages.length > 1) {
            flushSync(() => {
              setInitialState((s) => ({
                ...s,
                currentUser: msg,
              }));
            });
            history.push(urlParams.get('redirect') || 'package');
            msg['selectedPackageId'] = msg?.listPackages[0]?.packagE_ID
            setPackageId(msg?.listPackages[0]?.packagE_ID);
          } else {
            msg['selectedPackageId'] = msg?.listPackages[0]?.packagE_ID
            setPackageId(msg?.listPackages[0]?.packagE_ID);
            flushSync(() => {
              setInitialState((s) => ({
                ...s,
                currentUser: msg,
              }));
            });

            if (msg?.verifiedUser.userTypeID === "11") {
              history.push('/candidate-dashboard');
            } else {
              history.push('/welcome');
            }
          }
        }, 100);
        message.success(defaultLoginSuccessMessage);
        return;
      } else {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: 'Login failed, please try again!',
        });
        message.error(defaultLoginFailureMessage);
      }

      setUserLoginState(msg);

    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Login failed, please try again!',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const getImgUrl = async () => {
    const params = {
      fileName: "loginImg.png",
      filePath: ""
    }
    const res = await requestGetDocuments(params);
    setImageBase64(res.result)
    console.log(imgBase64)
  }

  return (
      <LoginFormPage
      // style={{height:window.innerHeight, justifyContent:'initial',backgroundRepeat:'no-repeat'}}
        backgroundImageUrl={`data:image/png;base64,${imgBase64}`}
        // backgroundImageUrl="https://www.shutterstock.com/shutterstock/photos/1401561251/display_1500/stock-photo-modern-microscope-for-operations-in-surgery-room-at-the-hospital-background-1401561251.jpg"
        title=""
        subTitle={<><h1 style={{color:'black'}}></h1></>}
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Divider plain>
              <span
                style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}
              >
                Others
              </span>
            </Divider>
            <Space direction="vertical" size="small" style={{ display: 'flex' }}>
              <Button
                size='middle'
                style={{ width: 300 }}
                type="default"
                onClick={() => {
                  const urlParams = new URL(window.location.href).searchParams;
                  history.push(urlParams.get('redirect') || '/user/candidate/add');
                }}>
                Register Patient
              </Button>
              <Button
                size='middle'
                style={{ width: 300 }}
                type="default"
                onClick={() => {
                  const urlParams = new URL(window.location.href).searchParams;
                  history.push(urlParams.get('redirect') || '/user/candidateActivation');
                }}>
                Patient Activation
              </Button>

              <Button
                disabled
                size='middle'
                style={{ width: 300 }}
                type="default"
                onClick={() => {
                  const urlParams = new URL(window.location.href).searchParams;
                  history.push(urlParams.get('redirect') || '/employee/list');
                }}>
                Add Hospital/Doctor
              </Button>

              {/* <Button
                disabled
                size='middle'
                style={{ width: 300 }}
                type="default"
                onClick={() => {
                  const urlParams = new URL(window.location.href).searchParams;
                  history.push(urlParams.get('redirect') || '/user/InstitututeUserActivation');
                }}>
                Hospital/Doctor Activation
              </Button> */}
            </Space>
          </div>
        }
        onFinish={async (values) => {
          await handleSubmit(values as API.LoginParams);
        }}
        submitter={{ searchConfig: { submitText: 'Log in', restText: 'Log in' } }}
      >
        <Tabs
          centered
          activeKey={loginType}
          style={{ marginTop: -40 }}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'account'} tab={'Account Login'} />
        </Tabs>
        {type === 'account' && (
          <>
            <ProFormText
              name="loginName"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}

              placeholder={'Username'}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="please enter user name!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'Password'}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="Please enter your password!"
                    />
                  ),
                },
              ]}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <a
            style={{
              float: 'right',
              marginTop: 10,
              marginBottom: 20
            }}
          >
            Forgot password?
          </a>
        </div>
      </LoginFormPage>
  );


};

export default Login;
