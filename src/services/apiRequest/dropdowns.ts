// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function requestGetGender(body: any,options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetGender', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDept(body: any,options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetDept', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDesig(body: any,options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetDesig', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function requestGetShift(body: any,options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetShift', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function requestGetWorkingStatus(options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetWorkingStatus?WorkingStatusID=-1&UserID=-1&FormID=-1&Type=1', {
    method: 'GET',
    ...(options || {}),
  });
}
export async function requestGetUserType(options?: { [key: string]: any }) {
  return request<any>('/Login/GetUserType', {
    method: 'GET',
    ...(options || {}),
  });
}
export async function requestGetRank(options?: { [key: string]: any }) {
  return request<any>('/Login/GetRank', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function requestGetRole(body: API.GetRole, options?: { [key: string]: any }) {
  return request<any>('/Login/GetRole?RoleID=' + body.RoleID, {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    // data: body,
    ...(options || {}),
  });
}
export async function requestGetRoleBAction(body: API.GetRoleBAction, options?: { [key: string]: any }) {
  return request<any>('/Login/GetRoleBaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetForm(body: API.GetForm, options?: { [key: string]: any }) {
  return request<any>('/Login/GetForm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetOrg(body: API.GetOrg, options?: { [key: string]: any }) {
  return request<any>('/Login/GetOrg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetMmodule(body: API.GetOrg, options?: { [key: string]: any }) {
  return request<any>('/Login/GetModule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetSectionTree(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/GetSectionTree', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),

  });
}
export async function requestGetDesignation(body: API.GetDesignation, options?: { [key: string]: any }) {
  return request<any>('/Login/GetDesignation?DesigID=' + body.DesigID, {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    data: body,
    ...(options || {}),

  });
}
export async function requestGetPackages(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/GetPackage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),

  });
}


export async function requestGetMarital(options?: { [key: string]: any }) {
  return request<any>('/Common/GetMarital', {
    method: 'GET',
    ...(options || {}),
  });
}


/**  POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestGetState(body: any = {}, options?: { [key: string]: any }) {
  return request<any>(`/MasterForm/GetState`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestGetDistrict(body: any = {}, options?: { [key: string]: any }) {
  console.log(body);
  return request<any>(`/Common/GetDistrict?&StateID=${body.value}&DistrictID=-1&Type=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function requestGetArea(body: any = {}, options?: { [key: string]: any }) {
  return request<any>(`Common/GetArea?AreaID=-1&DistrictID=-1&StateID=${-1}&UserID=-1&FormID=-1&Type=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function requestGetCity(body: any = {}, options?: { [key: string]: any }) {
  return request<any>(`/Common/GetCity?CityID=-1&ULBypeid=-1&DistrictID=${body.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
export async function requestGetCivilStatus(body: any={}, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/GetCivilStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetBloodGroup(body: any={}, options?: { [key: string]: any }) {
  return request<any>('MasterForm/GetBloodGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetReligion(body: any={}, options?: { [key: string]: any }) {
  return request<any>('MasterForm/GetReligion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetRelation(body: any={}, options?: { [key: string]: any }) {
  return request<any>('MasterForm/GetRelation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDocType(body: any={}, options?: { [key: string]: any }) {
  return request<any>('MasterForm/vUniqueID', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetSupplier(body: any={}, options?: { [key: string]: any }) {
  return request<any>('InventoryForm/GetSupplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetUnit(body: any={}, options?: { [key: string]: any }) {
  return request<any>('InventoryForm/GetUnit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetItemCat(body: any={}, options?: { [key: string]: any }) {
  return request<any>('InventoryForm/GetItemCat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddItem(body: any={}, options?: { [key: string]: any }) {
  return request<any>('InventoryForm/AddItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddSupplier(body: any={}, options?: { [key: string]: any }) {
  return request<any>('InventoryForm/AddSupplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetUniqueID() {
  return request<any>('DefaultForm/api/GetUniqueID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    
  });
}
export async function requestGetCountry(body: any={}, options?: { [key: string]: any }) {
  return request<any>('Common/GetCountry?CountryID=-1&Type=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetBranch(body: any = {}, options?: { [key: string]: any }) {
  console.log(body);
  return request<any>(`Common/GetBranch?BranchID=-1&IsActive=1&UserID=-1&FormID=-1&Type=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function requestGetRoomType(body: any, options?: { [key: string]: any }) {
  return request<any>('/Room/GetRoomType?RoomTypeID=-1&IsActive=1&UserID=-1&FormID=-1&Type=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetComplaintType(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/api/GetComplaintType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetRateType(body: any, options?: { [key: string]: any }) {
  return request<any>('Common/GetrateType?RateTypeID=-1&IsActive=-1&UserID=-1&FormID=-1&Type=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetSlot(options?: { [key: string]: any }) {
  return request<any>('/Common/GetSlot', {
    method: 'GET',
    ...(options || {}),
  });
}



export async function requestGetSection(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetSection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestVPreEmpType(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/vPreEmpType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestFnGetItem(body: any, options?: { [key: string]: any }) {
  return request<any>('/InventoryForm/FnGetItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestGetProduct(body: any, options?: { [key: string]: any }) {
  return request<any>('/InventoryForm/GetProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}



export async function requestGetVitalParameter(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetVitalParameter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetUserList(
  params: {
    // query
    CommonID?: number;
    /** 页面的容量 */
    Type?: number;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/Login/GetUserList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
