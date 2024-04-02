// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestGetDepartmentList(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetDept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddDepartment(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/AddDept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddDesig(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/AddDesig', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDesigList(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetDesig', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetEmpType(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetEmpType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetEmpCategory(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetEmpCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetMaritalStatus(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetMaritalStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDistrict(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetDistrict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetCaste(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetCaste', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddSubCaste(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/AddSubCaste', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetSubCaste(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetSubCaste', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddCaste(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/AddCaste', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetCasteList(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetCaste', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddState(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/AddState', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetStateList(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetState', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  
}
export async function requestAddDistrict(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/AddDistrict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDistrictList(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetDistrict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  
}