import { request } from '@umijs/max';


export async function requestGetRawDataForCorrection(body: any, options?: { [key: string]: any }) {
    return request<any>('/AttendanceForm/GetRawDataForCorrection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
export async function requestDeleteRawData(body: any, options?: { [key: string]: any }) {
    return request<any>('/AttendanceForm/DeleteRawData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }