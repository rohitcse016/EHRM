// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type GetRole = {
    RoleID?: string;

  };
  type GetUserLIst = {
    CommonID?: string;
    Type?: string;

  };
  type GetRoleBAction = {
    orgID?: string;
    packageID?: string;
    mModuleID?: string;
    formID?: string;
    type?: string;

  };
  type GetOrg = {
    orgID?: string;
    type?: string;

  };
  type GetForm = {
    collegeID?: string;
    packageID?: string;
    mModuleID?: string;
    formID?: string;
  }
  type GetDesignation = {
    DesigID?: string;

  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type GetGender = {
    genderID: string,
    genderName: string,
    genderCode: string,
    isActive: string
  };
  type AddGender = {
    genderID: number,
    userID: number,
    formId: number,
    type: number
  };
  type AddInstituteParam = {
    "instituteName": string,
    "instituteAddress": string,
    "instituteCode": string,
    "mobileNo": string,
    "phoneNo": string,
    "faxNo": string,
    "emailID": string,
    "landMark": string,
    "stateID": string,
    "districtID": string,
    "cityID": string,
    "areaID": string,
    "estdDate": Date,
    "website": string,
    "campusArea": string,
    "noOfFaculty": string,
    "noOfStudent": string,
    "longitude": string,
    "latitude": string,
    "overAllRanking": string,
  };
}
