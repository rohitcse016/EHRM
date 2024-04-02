// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function requestGetPatientDailyCount(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientDailyCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestGetPatientSearchOPIP(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientSearchOPIP', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestAddUpdatePatientCase(body: any, options?: { [key: string]: any }) {
  return request<any>('AddUpdatePatientCase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}









