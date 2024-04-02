import { request } from '@umijs/max';


export async function requestGetHospitalBill(body: any, options?: { [key: string]: any }) {
    return request<any>('/Reports/GetHospitalBill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function requestAddPatientPharmaBill(body: any, options?: { [key: string]: any }) {
    return request<any>('AddPatientPharmaBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
export async function requestGetPatientPharmaBill(body: any, options?: { [key: string]: any }) {
    return request<any>('GetPatientPharmaBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  export async function requestGetBalanceBill(body: any, options?: { [key: string]: any }) {
    return request<any>('GetBalanceBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
  export async function requestAddPatientBalanceBill(body: any, options?: { [key: string]: any }) {
    return request<any>('AddPatientBalanceBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
export async function requestGetPatientPharmaBillReport(body: any, options?: { [key: string]: any }) {
    return request<any>('Reports/GetPatientPharmaBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
export async function requestGetItemBalanceWithBaarCode(body: any, options?: { [key: string]: any }) {
    return request<any>('InventoryForm/GetItemBalanceWithBaarCode_1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }