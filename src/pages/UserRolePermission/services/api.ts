// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestAddUser(body: any, options?: { [key: string]: any }) {
  console.log("token " + JSON.stringify( body) )
  return request<any>('/Login/SaveUserInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${body.token}`,
    },
    data: body,
    ...(options || {}),
  });
}


/**  POST /api/login/account */
export async function requestAddUserRolePermission(body: any, options?: { [key: string]: any }) {
  console.log("token " + JSON.stringify( body) )
  return request<any>('/Login/UpdateRoleBAction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${body.token}`,
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddUserFormRight(body: any, options?: { [key: string]: any }) {
  console.log("token " + JSON.stringify( body) )
  return request<any>('/Login/UpdateFormRight', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${body.token}`,
    },
    data: body,
    ...(options || {}),
  });
}


/**  POST /api/login/ChangePassword */
export async function requestChangePassword(body: any, options?: { [key: string]: any }) {
  console.log("token " + JSON.stringify( body) )
  return request<any>('/Login/ChangePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${body.token}`,
    },
    data: body,
    ...(options || {}),
  });
}

/**  POST menus */
export async function mo(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/GetUserPermission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestGetUserList(body: any, options?: { [key: string]: any }) {
  return request<any>('/Login/GetUserList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetUserinfo(body: any, options?: { [key: string]: any }) {
  return request<any>('/Login/GetUserInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}



/** 此处后端没有提供注释 GET /api/notices */
export async function getCandidategetList(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
