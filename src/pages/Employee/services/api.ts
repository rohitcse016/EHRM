// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestGetEmployeeList(body: any, options?: { [key: string]: any }) {
  return request<any>('EmpForm/GetEmpList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestEmployeeRegistration(body: any, options?: { [key: string]: any }) {
  return request<any>('EmpForm/AddUpdateEmp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetEmployee(body: any, options?: { [key: string]: any }) {
  return request<any>('/EmpForm/GetEmployee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddQualification(body: any, options?: { [key: string]: any }) {
  return request<any>('/EmpForm/AddUpdateEmpQual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddExperience(body: any, options?: { [key: string]: any }) {
  return request<any>('/EmpForm/AddUpdateEmpIndustryExp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddFamily(body: any, options?: { [key: string]: any }) {
  return request<any>('/EmpForm/AddUpdateEmpFamilyMembers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetQual(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetQual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
