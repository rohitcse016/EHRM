// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestAddCandidate(body: any, options?: { [key: string]: any }) {
  return request<any>('Online/AddOnlineLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestUpdateCandidate(body: any, options?: { [key: string]: any }) {
  console.log(body)
  return request<any>('/Candidate/UpdateCandidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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


export async function requestGetCandidateList(body: any, options?: { [key: string]: any }) {
  return request<any>('Online/GetOnlinePatient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDocuments(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/DownloadFile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getCandidateDoc(body: any, options?: { [key: string]: any }) {
  return request<any>('/Candidate/GetCandidateDoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function addCandidateDoc(body: any, options?: { [key: string]: any }) {
  return request<any>('/Candidate/AddCandidateDoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

