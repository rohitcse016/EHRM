import React from 'react';
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { DownOutlined, HomeOutlined, LinkOutlined, LogoutOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link, SelectLang } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { fetchMenuData, currentUser as queryCurrentUser } from './services/apiRequest/api';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
import { useModel } from '@umijs/max';
import { flushSync } from 'react-dom';
import { getPackageId, getUserInLocalStorage, setMenu } from './utils/common';
import { createMenu } from './utils/createMenu';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, message } from 'antd';



/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const { initialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    try {
      return getUserInLocalStorage();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const { location } = history;
  console.log({ initialStateApp: initialState })
  console.log({ pathname: location.pathname, loginPath })
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}



const UserMenu = ({ initialState }: any) => {

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '1':
        localStorage.clear()
        history.push("/")
        break;
      case '2':
        history.push("/update/user-profile")
        break;
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'Update Profile',
      key: '2',
    },
    {
      label: 'Logout',
      key: '1',
    }
  ];

  return <Dropdown
    menu={{ items, onClick }}
    trigger={['click']}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        {getUserInLocalStorage()?.verifiedUser?.userTypeID === "1" && getUserInLocalStorage()?.verifiedUser?.userID==="-2" ? 
          <span>{'Admin'}</span> :
          <span>{getUserInLocalStorage()?.verifiedUser?.userName.toString().toUpperCase()}</span>}
        <UserOutlined />
      </Space>
    </a>
  </Dropdown>
}


const patientComp = () => {
  return (
    <>
      {/* <PatientDetailsCommon/> */}
    </>
  )
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }: any) => {
  return {
    actionsRender: () => [patientComp(), <UserMenu initialState={initialState} />],
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const user = getUserInLocalStorage();
      console.log(user)
      if (!user && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menu: {
      // Re-execute request whenever initialState?.currentUser?.userid is modified
      params: {
        userId: initialState?.currentUser?.userid,
      },
      request: async (params, defaultMenuData) => {
        const menu = createMenu();
        return menu;
      },
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],

    menuHeaderRender: (logo,title)=><div
    id="customize_menu_header"
    style={{
      height: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
    onClick={() => {
      if(getUserInLocalStorage()?.verifiedUser?.userTypeID === "11")
      history.push("/candidate-dashboard")
      else  
      history.push("/welcome")
    }}
  >
    {<HomeOutlined />}
    {'HomePage'}
  </div>,
// 自定义 403 页面
// unAccessible: <div>unAccessible</div>,
// 增加一个 loading 的状态
childrenRender: (children) => {
  // if (initialState?.loading) return <PageLoading />;
  return (
    <>
      {children}
      <SettingDrawer
        disableUrlParams
        enableDarkTheme
        settings={initialState?.settings}
        onSettingChange={(settings) => {
          setInitialState((preInitialState) => ({
            ...preInitialState,
            settings,
          }));
        }}
      />
    </>
  );
},
    ...initialState?.settings,
    ...defaultSettings,
  };
};


/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */

const authInterceptor = (url: string, options: RequestConfig) => {
  const user = JSON.parse(localStorage.getItem("user") as string);
  const token = user?.verifiedUser?.token;
  const authHeader = { Authorization: `Bearer ${token}` };
  return {
    url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

export const request: RequestConfig = {
  baseURL: BASE_URL,
  errorConfig: errorConfig.errorConfig,
  requestInterceptors: errorConfig.requestInterceptors ? [...errorConfig.requestInterceptors, authInterceptor] : [authInterceptor],
  responseInterceptors: errorConfig.responseInterceptors
};
