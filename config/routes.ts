/**
 * @name umi routing configuration for
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon Configuration
 * @param path  path only supports two placeholder configurations, the first is the form of the dynamic parameter :id, the second is the * wildcard, and the wildcard can only appear at the end of the routing string.
 * @param component Configure the path of the React component to be rendered after matching location and path. It can be an absolute path or a relative path. If it is a relative path, it will start from src/pages.
 * @param routes Configure sub-routes, usually used when you need to add layout components for multiple paths.
 * @param redirect Configure routing jump
 * @param wrappers Configure the packaging component of the routing component. Through the packaging component, more functions can be combined into the current routing component. For example, it can be used for permission verification at the routing level
 * @param name Configure the title of the route. By default, the value of menu.xxxx in the internationalization file menu.ts is read. If the name is configured as login, the value of menu.login in menu.ts is read as the title
 * @param icon Configure the icon of the route, refer to https://ant.design/components/icon-cn for the value, pay attention to remove the style suffix and capitalization, if you want to configure the icon as <StepBackwardOutlined />, the value should be stepBackward or StepBackward, such as If you want to configure the icon as <UserOutlined />, the value should be user or User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        name: 'candidate-activation',
        path: '/user/candidateActivation',
        component: './User/CandidateActivation',
      },
      {
        name: 'package',
        path: '/user/package',
        component: './User/Package',
      },
    ],
  },
  {
    name: 'Update',
    path: '/update',
    routes: [
      {
        name: 'user profile',
        path: '/update/user-profile',
        component: './User/UserProfile/UserProfile',
      }
    ]
  },
  {
    path: '/welcome',
    name: 'Welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    name: 'Employee',
    path: '/employee',
    routes: [
      {
        name: 'Employee Registration',
        path: '/employee/registration',
        component: './Employee/components/EmployeeRegistration',
      },
      {
        name: 'Search Employee',
        path: '/employee/list',
        component: './Employee',
      }
    ],
  },
  {
    name: 'Attendance',
    path: '/attendance',
    routes: [
      {
        name: 'Emp Raw Data Correction',
        path: '/attendance/DataCorrection',
        component: './Attendance/components/EmployeeDataCorrection',
      },
    ],
  },
  {
    name: 'Master',
    path: '/master',
    routes: [
      {
        name: 'Caste',
        path: '/master/caste',
        component: './Master/AddCaste',
      },
      {
        name: 'SubCaste',
        path: '/master/SubCaste',
        component: './Master/AddSubCaste',
      },
      {
        name: 'Department',
        path: '/master/department',
        component: './Master/AddDepartment',
      },
      {
        name: 'Designation',
        path: '/master/designation',
        component: './Master/Designation',
      },
      {
        name: 'State',
        path: '/master/state',
        component: './Master/AddState',
      },
      {
        name: 'District',
        path: '/master/district',
        component: './Master/AddDistrict',
      }
    ],
  },

  {
    name: 'reception',
    path: '/reception',
    routes: [
      {
        name: 'Reception',
        path: '/reception/search',
        component: './Reception/components/ReceptionSearch',
      },

    ],
  },
  {
    name: 'User Management2',
    path: '/user-management',
    routes: [
      {
        name: 'User Management1',
        path: '/user-management/list',
        component: './UserManagement',
      },
      {
        name: 'User Management3',
        path: 'list',
        component: './UserManagement',
      },
      {
        name: 'UserRolePermission',
        path: '/user-management/userrole',
        component: './UserRolePermission',
      },
    ],
  },
  {
    name: 'Role Form Permission',
    routes: [
      {
        name: 'UserRolePermission',
        path: '/userrole',
        component: './UserRolePermission',
      }
    ],
  },
  {
    name: 'Change Password',
    routes: [
      {
        name: 'Change Password',
        path: '/UserManagement/change-password',
        component: './UserManagement/components/UserChangePass',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/candidate-dashboard',
    component: './CandidateDashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
