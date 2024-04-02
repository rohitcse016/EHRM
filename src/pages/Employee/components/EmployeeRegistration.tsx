import type { ProFormInstance } from '@ant-design/pro-components';
import {
    PageContainer,
    StepsForm,
} from '@ant-design/pro-components';
import {
    Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message,
    Steps, theme, Spin, InputNumber, Card, Divider, Checkbox, Typography, Tabs, Upload,
    Table, Popconfirm, CollapseProps, Collapse, Segmented
} from 'antd';

import { useEffect, useRef, useState } from 'react';
import { history, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetBloodGroup, requestGetGender, requestGetRelation, requestGetReligion, requestGetShift, requestGetState, requestGetWorkingStatus } from '@/services/apiRequest/dropdowns';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { RightOutlined, UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';
import { ColumnsType } from 'antd/es/table';
import { requestEmployeeRegistration, requestGetEmployee } from '../services/api';
import { requestGetCaste, requestGetDepartmentList, requestGetDesigList, requestGetDistrict, requestGetEmpCategory, requestGetEmpType, requestGetMaritalStatus, requestGetSubCaste } from '@/pages/Master/services/api';
import AddQualification from './AddQualification';
import AddExperience from './AddExperience';
import AddFamily from './AddFamily';

const { Search } = Input;
interface DataType {
    col1: string
    col2: string,
    col3: string
    col4: string
    col5: string
    col6: string
    col7: string
    col8: string
    col9: string
    col10: string,
    col11: string,
    col12: string,
    col13: string,
    col14: string,
    col15: string
}
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const EmployeeRegistration = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("1");
    const [empID, setEmpID] = useState<any>("-1")
    const [state, setState] = useState<any>([{ value: '1', label: "Uttar Pradesh" }])
    const [district, setDistrict] = useState<any>([{ value: '1', label: "Kanpur" }])
    const [country, setCountry] = useState<any>([{ value: '1', label: "India" }])
    const [workingStatus, setWorkingStatus] = useState<any>([{ value: '1', label: "Status1" }])
    const [department, setDepartment] = useState<any>([])
    const [designation, setDesignation] = useState<any>([])
    const [empType, setEmpType] = useState<any>([{ value: '1', label: "Type1" }])
    const [caste, setCaste] = useState<any>([])
    const [subCaste, setSubCaste] = useState<any>([])
    const [empCategory, setEmpCategory] = useState<any>([{ value: '1', label: "Category1" }])
    const [nationality, setNationality] = useState<any>([{ value: '1', label: "Indian" }])
    const [gender, setGender] = useState<any>([{ value: '1', label: "Male" }, { value: '2', label: "Female" }])
    const [shift, setShift] = useState<any>([])
    const [civilStatus, setCivilStatus] = useState<any>([{ value: '1', label: "Married" }, { value: '2', label: "UnMarried" }])
    const [bloodGroup, setBloodGroup] = useState<any>([{ value: '1', label: "O+" }])
    const [religion, setReligion] = useState<any>([{ value: '1', label: "Hindu" }])
    const [relation, setRelation] = useState<any>([{ value: '1', label: "Father" }])
    const [title, setTitle] = useState<any>([{ value: '1', label: "Mr" }, { value: '2', label: "Ms" }])
    const [docType, setDocType] = useState<any>([{ value: '1', label: "Aadhaar" }])
    const [selectedDoc, setSelectedDoc] = useState<any>()
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [lstType_Patient, setLstType_Patient] = useState([]);
    const [docName, setDocName] = useState<any>("");
    const user = JSON.parse(localStorage.getItem("user") as string);
    const [patientDocUpload, setPatientDocUpload] = useState<any>();
    const [employeeDetails, setEmployeeDetails] = useState([]);




    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        // marginTop: 60,
        height: 350,
    };

    useEffect(() => {
        const empCode = history.location.state?.empCode
        if (empCode != "" && empCode != undefined)
            getEmployeeSearch(empCode);
        getGender();
        getMaritalStatus();
        getBloodGroup();
        getState();
        getReligion();
        getRelation();
        getWorkingStatus();
        getDepartment();
        getDesignation();
        getEmpType();
        getEmpCategory();
        getCaste();
        getSubCaste();
        getShift();
        let customDate = moment().format("YYYY-MM-DD");
    }, [])

    useEffect(() => {

    }, [lstType_Patient])

    const initialTabItems = [
        { label: 'Patient Information', children: '', key: '1' },
        { label: 'Qualifications', children: '', key: '2' },
        { label: 'Experience', children: '', key: '3' },
        { label: 'Family Information', children: '', key: '4' },
    ];

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }
    const onDocTypeSelect = (v: any) => {
        setSelectedDoc(v)
    };
    const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };
    const getByteArray = async (img: RcFile, callback: (url: string) => void) => {
        const reader1 = new FileReader();
        reader1.addEventListener('load', () => callback(reader1.result as string));
        reader1.readAsArrayBuffer(img)
    };
    const getFile = (e: any) => {
        if (e.file.status === 'uploading') {
            console.log('Upload event:', e.file.status);
            return "";
        }
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.file.originFileObj;
    };

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // requestForValidateOTP(values);
    };
    const getEmployeeSearch = async (v: any) => {
        setLoading(true);
        const params = {
            "empID": "-1",
            "empCode": v,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const response = await requestGetEmployee({ ...params });
        setEmployeeDetails(response?.result)
        setLoading(false)

        if (response?.isSuccess && response?.result.length > 0) {
            const empData = response?.result[0]
            form.setFieldsValue(
                {
                    "firstName": empData?.firstName,
                    "middleName": empData?.middleName,
                    "lastName": empData?.lastName,
                    "fatherName": empData?.fatherName,
                    "motherName": empData?.motherName,
                    "emailID": empData?.emailID,
                    "dob": dayjs(empData?.dob),
                    "dom": dayjs(empData?.dom),
                    "dor": dayjs(empData?.dor),
                    "doj": dayjs(empData?.doj),
                    "doa": dayjs(empData?.doa),
                    "empCode": empData?.empCode,
                    "genderID": empData?.m05_GenderID,
                    "shiftID": empData?.m16_ShiftID,
                    "spouseName": empData?.spouseName,
                    "curAddress": empData?.curAddress,
                    "idMark": empData?.idMark,
                    "titleID": empData?.m01_TitleID,
                    "religionID": empData?.m13_ReligionID,
                    "casteID": empData?.m14_CasteID,
                    "maritalStatusID": empData?.m07_MaritalStatusID,
                    "bloodGroupID": empData?.m06_BloodGroupID,
                    "workingStatusID": empData?.m12_WorkingStatusID,
                    "curPin": empData?.curPin,
                    "curCountryID": empData?.m02_NationalityID,
                    "nationalityID": empData?.m02_NationalityID,
                    "subCasteID": empData?.m15_SubCasteID,
                    "curDistrictID": empData?.m04_CurDistrictID,
                    "curStateID": empData?.m03_CurStateID,
                    "perAddress": empData?.perAddress,
                    "perStateID": empData?.m03_PerStateID,
                    "perDistrictID": empData?.m04_PerDistrictID,
                    "perPin": empData?.perPin,
                    "mobileNo": empData?.mobileNo,
                    "emergenyContactNo": empData?.emergenyContactNo,
                    "aadhaarNo": empData?.aadhaarNo,
                    "desigID": empData?.m11_DesigID,
                    "deptID": empData?.m10_DeptID,
                    "empCategoryID": empData?.m08_EmpCategoryID,
                    "panNo": empData?.panNo,
                    "empTypeID": empData?.m09_EmpTypeID,
                    "isOverTimeValid": empData?.isOverTimeValid,
                    "isHandicapped": empData?.isHandicapped,
                    "isApproved": empData?.isApproved,

                    "photo": empData?.photo ? `data:image/png;base64,${empData?.photo}` : "",
                    // "signature": patientDoc?.signature ? `data:image/png;base64,${patientDoc?.signature}` : "",

                    "uidDocPath": "",
                    // "uidDocID": 1,
                    "vUniqueID": empData.vUniqueID,
                    "vUniqueName": empData.vUniqueName,

                });
            setEmpID(empData.empID)
        }
        else {
            message.error("Employee Not Found For Given Employee Code ")
        }
    }
    const getCaste = async () => {
        const params = {
            "casteID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetCaste(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.casteID, label: item.casteName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setCaste(dataMaskForDropdown)
        }
    }
    const getSubCaste = async (casteID: any = 1) => {
        const params = {
            "casteID": casteID,
            "subCasteID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetSubCaste(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.subCasteID, label: item.subCasteName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setSubCaste(dataMaskForDropdown)
        }
    }
    const getShift = async () => {
        const params: any = {
            "shiftID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetShift(params);
        if (res?.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.shiftID, label: item.shiftName }
            })
            dataMaskForDropdown.unshift({ value: -1, label: "All" });
            setShift(dataMaskForDropdown)
        }
    }
    const getGender = async () => {
        const params = {
            "genderID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetGender(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setGender(dataMaskForDropdown)
        }
    }
    const getWorkingStatus = async () => {
        const res = await requestGetWorkingStatus();
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.workingStatusID, label: item.workingStatusName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setWorkingStatus(dataMaskForDropdown)
        }
    }
    const getDesignation = async () => {
        const param = {
            "desigID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetDesigList(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.desigID, label: item.desigName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setDesignation(dataMaskForDropdown)
        }
    }
    const getDepartment = async () => {
        const param = {
            "deptID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetDepartmentList(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.deptID, label: item.deptName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setDepartment(dataMaskForDropdown)
        }
    }
    const getEmpType = async () => {
        const param = {
            "empTypeID": 0,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetEmpType(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.empID, label: item.empName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setEmpType(dataMaskForDropdown)
        }
    }
    const getEmpCategory = async () => {
        const param = {
            "empCategoryID": 0,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetEmpCategory(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.empCategoryID, label: item.empCategoryName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setEmpCategory(dataMaskForDropdown)
        }
    }
    const saveFileSelected = (e) => {
        //in case you wan to print the file selected
        console.log(e.target.files[0]);
        // setFile(e.target.files[0]);
    };

    const onUpload = (info: any) => {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as RcFile, async (url) => {
                // console.log(url, info.file.name)
                setDocName(info.file.name)

                addPatientDoc({ docBase64: url, docName: info.file.name })

                // const param = {
                //     "fileName": info.file.name,
                //     "data": url
                // }
                // const res = await requestFileUpload(param);
                // if (res.isSuccess == true)
                //     {
                //         message.success(`${res.msg}`);
                //     }
                // else
                //     message.error(`Some Error Occurred`);
            })
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }

    }

    const addPatientDoc = async (values: any) => {
        var re = /(?:\.([^.]+))?$/;
        var ext = re?.exec(values.docName)[1];
        console.log(values)

        const params = {
            "onlinePatientID": user?.verifiedUser?.userID,
            "slNo": 1,
            "docName": values.docName,
            "docExt": ext,
            "docPath": "",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestAddOnlinePatDoc(params);

        // console.log(res.result['0'].docID);

        if (res?.isSuccess == true) {
            const param1 = {
                "fileName": res?.result['0']?.docID,
                "data": values.docBase64
            }
            const res1 = await requestFileUpload(param1);

            if (res1.isSuccess == true)
                setPatientDocUpload({
                    "uidDocID": res?.result['0']?.docID.split('_')[1],
                    "uidDocExt": ext,
                    "uidDocName": values.docName,
                })
            else
                message.error(res1.msg)
        }
    }

    const getMaritalStatus = async () => {
        const param = {
            "maritalStatusID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetMaritalStatus(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.maritalStatusID, label: item.maritalStatusName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setCivilStatus(dataMaskForDropdown)
        }
    }
    const getBloodGroup = async () => {
        const param = {
            "bloodGroupID": -1, "userID": -1,
            "formID": -1, "type": 1
        }
        const res = await requestGetBloodGroup(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.bloodGroupID, label: item.bloodGroupName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setBloodGroup(dataMaskForDropdown)
        }
    }
    const getReligion = async () => {
        const param = { "religionID": "-1", "type": 1 }
        const res = await requestGetReligion(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.religionID, label: item.religionName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setReligion(dataMaskForDropdown)
        }
    }
    const getRelation = async () => {
        const param = { "relationID": "-1", "type": 1 }
        const res = await requestGetRelation(param);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.relationID, label: item.relationName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setRelation(dataMaskForDropdown)
        }
    }

    const getDistrict = async (stateId: any = 1) => {
        const params = {
            "districtID": -1,
            "stateID": stateId,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetDistrict(params);
        if (res?.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.districtID, label: item.districtName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setDistrict(dataMaskForDropdown)
        }
        else 
            setDistrict([])
    }
    const getState = async () => {
        const params={"stateID":"-1","userID":"-1","formID":"-1","type":"1"}
        const res = await requestGetState(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
            dataMaskForDropdown.unshift({ value: "-1", label: "Select" });
            setState(dataMaskForDropdown)
        }
        // form.setFieldsValue(
        //     {
        //         "mName": "",
        //         "fNameML": "",
        //         "mNameML": "",
        //         "lNameML": "",
        //         "fatherNameML": "",
        //         "motherNameML": "",
        //         "alternateEmail": "",

        //         "curHouseNo": "0",
        //         "curAddress": "",
        //         "curPinCode": "",
        //         "curStateID": "-1",
        //         "curDistrictID": "-1",
        //         "curCountryID": "-1",
        //         "curPhoneCC": "",
        //         "curPhoneNo": "",
        //         "perHouseNo": "0",
        //         "perAddress": "",
        //         "perPinCode": "",
        //         "perStateID": "-1",
        //         "perDistrictID": "-1",
        //         "perCountryID": "-1",
        //         "perMobileNoCC": "",
        //         "perMobileNo": "",
        //         "perPhoneCC": "",
        //         "perPhoneNo": "",
        //         //"uidDocName": "",
        //         "passIssueDate": dayjs(),
        //         "passIssuePlace": "",
        //         "vUniqueID": "-1",
        //         "bGroupID": "-1",
        //         "civilStatusID": "-1",
        //         "genderID": "-1",
        //         "nationalityID": "-1",
        //         "religionID": "-1",
        //     });
    }
    const addEmployeeReg = async (values: any) => {
        values['dob'] = convertDate(values.dob);
        values['middleName'] = values?.middleName ? values.middleName : '';
        values['motherName'] = values?.motherName ? values.motherName : '';
        values['spouseName'] = values?.spouseName ? values.spouseName : '';
        values['isVIP'] = values.isVIP ? values.isVIP : false;
        values['passIssueDate'] = values.passIssueDate ? convertDate(values.passIssueDate) : '1900-01-01';
        values['signature'] = values?.signature ? values.signature : '';
        values['photo'] = values?.photo ? values.photo : '';
        values['rFingerID'] = values?.rFingerID ? values.rFingerID : -1;
        values['rFinger'] = values?.rFinger ? values.rFinger : "";
        values['lFingerID'] = values?.lFingerID ? values.lFingerID : "-1";
        values['lFinger'] = values?.lFinger ? values.lFinger : "";
        values['faceImage'] = values?.faceImage ? values.faceImage : "";
        values['perPhoneNo'] = values?.perPhoneNo ? values.perPhoneNo : "";


        try {
            const staticParams = {
                "empID": empID,
                // "empCode": "",
                // "titleID": 0,
                // "firstName": "string",
                // "middleName": "string",
                // "lastName": "string",
                // "mobileNo": "string",
                // "emailID": "string",
                // "fatherName": "string",
                // "motherName": "string",
                // "idMark": "string",
                // "nationalityID": 0,
                // "genderID": 0,
                // "bloodGroupID": 0,
                // "maritalStatusID": 0,
                // "empCategoryID": 0,
                // "empTypeID": 0,
                // "deptID": 0,
                // "desigID": 0,
                // "workingStatusID": 0,
                // "religionID": 0,
                // "casteID": 0,
                // "subCasteID": 0,
                // "shiftID": 0,
                // "dob": "2024-03-22T12:04:08.934Z",
                // "doa": "2024-03-22T12:04:08.934Z",
                // "doj": "2024-03-22T12:04:08.935Z",
                // "dor": "2024-03-22T12:04:08.935Z",
                // "dom": "2024-03-22T12:04:08.935Z",
                // "spouseName": "string",
                // "curAddress": "string",
                // "curStateID": 0,
                // "curDistrictID": 0,
                // "curPin": "string",
                // "perAddress": "string",
                // "perStateID": 0,
                // "perDistrictID": 0,
                // "perPin": "string",
                // "perPhoneNo": "string",
                // "emergenyContactNo": "string",
                // "isHandicapped": true,
                // "isOverTimeValid": true,
                // "isApproved": true,
                // "aadhaarNo": "string",
                // "panNo": "string",
                // "photo": "string",
                // "rFingerID": 0,
                // "rFinger": "string",
                // "lFingerID": 0,
                // "lFinger": "string",
                // "faceImage": "string",
                "userID": -1,
                "formID": -1,
                "type": empID === "-1" ? 1 : 2,
                "otp": ""
            };
            setLoading(true)
            const msg = await requestEmployeeRegistration({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                setEmpID("-1")
                history.push(`/employee/registration`, "")
                message.success(msg.msg);
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };
    const goBack = () => {
        history.push("/")
    }
    const validateCharacters = (rule, value, callback) => {
        const regex = /^[A-Za-z\s]+$/;
        if (!regex.test(value)) {
            if (value) {
                callback('Only characters are allowed');
            } else {
                callback();
            }

        } else {
            callback();
        }
    };

    const onChange = (e: CheckboxChangeEvent) => {
        const addressFields = form.getFieldsValue()
        if (e.target.checked == true)
            form.setFieldsValue(
                {
                    "perAddress": addressFields.curAddress,
                    "perStateID": addressFields.curStateID,
                    "perPin": addressFields.curPin,
                    "perDistrictID": addressFields.curDistrictID,
                });
        else
            form.setFieldsValue({
                "perAddress": "",
                "perStateID": "",
                "perPin": "",
                "perDistrictID": "",
            })
    };

    const onSelectCurState = (stateID:any) => {
        form.setFieldValue("curDistrictID","-1")
        getDistrict(stateID)
    };

    const addEmployeeRegForm = () => {
        return (
            <PageContainer
                style={{ width: '100%' }}
            title={' '}
            >
                <Card
                    title={
                        <Row align={'middle'}>
                            <Form>
                                <Form.Item
                                    style={{ paddingTop: 15 }}
                                    name={"empCode"}
                                    label="Search by Employee Code :"
                                    rules={[{ required: true, message: 'Please Enter Employee Code' }]}>
                                    <Search placeholder="Input Search Text"
                                        loading={loading}
                                        onSearch={(v) => getEmployeeSearch(v)} enterButton />
                                </Form.Item>
                            </Form>
                        </Row>
                    }
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Form
                        layout={'vertical'}
                        form={form}
                        preserve={true}
                        scrollToFirstError={true}
                        onFinish={async (values) => {
                            addEmployeeReg(values)
                        }}
                    >
                        <Card title={<Typography style={{ color: 'white', fontSize: 18 }}>
                            {"Basic Details"}</Typography>} style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="titleID"
                                        label="Title"
                                        rules={[{ required: true, message: 'Please Choose The Title' }]}
                                    >
                                        <Select
                                            placeholder="Please Choose The Title"
                                            options={title}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="empCode"
                                        label="Employee Code"
                                        rules={[{ required: true, message: 'Please Enter Employee Code' }
                                        ]}
                                    >
                                        <Input style={{ borderColor: 'blue' }} placeholder="Please Enter Employee Code" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="firstName"
                                        label="First Name"
                                        rules={[{ required: true, message: 'Please Enter First Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input style={{ borderColor: 'blue' }} placeholder="Please enter First Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="middleName"
                                        label="Middle Name"
                                        rules={[{ required: false, message: 'Please enter Middle Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input placeholder="Please enter Middle Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="lastName"
                                        label="Last Name"
                                        rules={[{ required: true, message: 'Please enter Last Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input placeholder="Please enter Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="fatherName"
                                        label="Father Name"
                                        rules={[{ required: true, message: 'Please enter Father Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input placeholder="Please enter Father Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="motherName"
                                        label="Mother Name"
                                        rules={[{ required: false, message: 'Please enter Mother Name' },
                                        { validator: validateCharacters }]}
                                    >
                                        <Input placeholder="Please enter Mother Name" />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        name="genderID"
                                        label="Gender"
                                        rules={[{ required: true, message: 'Please choose the Gender' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the Gender"
                                            options={gender}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="shiftID"
                                        label="Shift"
                                        rules={[{ required: true, message: 'Please choose the Shift' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the Shift"
                                            options={shift}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        name="dob"
                                        label="DOB"
                                        rules={[{ required: true, message: 'Please choose the DOB' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format={'DD-MMM-YYYY'}
                                            // disabledDate={(current) => {
                                            //     let customDate = moment().format("YYYY-MM-DD");
                                            //     return current && current > dayjs().subtract(12, 'year');
                                            // }}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="dom"
                                        label="DOM"
                                        rules={[{ required: true, message: 'Please choose the DOM' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format={'DD-MMM-YYYY'}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="dor"
                                        label="DOR"
                                        rules={[{ required: true, message: 'Please choose the DOR' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format={'DD-MMM-YYYY'}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="doj"
                                        label="DOJ"
                                        rules={[{ required: true, message: 'Please choose the DOJ' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format={'DD-MMM-YYYY'}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="doa"
                                        label="DOA"
                                        rules={[{ required: true, message: 'Please choose the DOA' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format={'DD-MMM-YYYY'}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        name="emailID"
                                        label="Email"
                                        rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
                                    >
                                        <Input maxLength={40} placeholder="Please enter Email" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="spouseName"
                                        label="Spouse Name"
                                        rules={[{ required: false, type: 'email', message: 'Please Enter Spouse Name' }]}
                                    >
                                        <Input maxLength={30} placeholder="Please Enter Spouse Name" />
                                    </Form.Item>
                                </Col>

                                <Collapse style={{ width: '100%' }} items={[
                                    {
                                        key: '1',
                                        label: 'More',
                                        children: <Row style={{ width: '100%' }} gutter={16}>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="maritalStatusID"
                                                    label="Marital Status"
                                                    rules={[{ required: false, message: 'Please choose the Civil Status' }]}
                                                >
                                                    <Select
                                                        placeholder="Please choose the Marital Status"
                                                        options={civilStatus}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="bloodGroupID"
                                                    label="Blood Group"
                                                    rules={[{ required: false, message: 'Please Choose Blood Group' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Blood Group"
                                                        options={bloodGroup}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="religionID"
                                                    label="Religion"
                                                    rules={[{ required: false, message: 'Please Choose Religion' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Religion"
                                                        options={religion}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="nationalityID"
                                                    label="Nationality"
                                                    rules={[{ required: false, message: 'Please Choose Nationality' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Nationality"
                                                        options={nationality}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="workingStatusID"
                                                    label="Working Status"
                                                    rules={[{ required: false, message: 'Please Choose Working Status' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Working Status"
                                                        options={workingStatus}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="deptID"
                                                    label="Department"
                                                    rules={[{ required: false, message: 'Please Choose Department' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Department"
                                                        options={department}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="desigID"
                                                    label="Designation"
                                                    rules={[{ required: false, message: 'Please Choose Designation' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Designation"
                                                        options={designation}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="empTypeID"
                                                    label="Employee Type"
                                                    rules={[{ required: false, message: 'Please Choose Employee Type' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Employee Type"
                                                        options={empType}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="empCategoryID"
                                                    label="Employee Category"
                                                    rules={[{ required: false, message: 'Please Choose Employee Category' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Employee Category"
                                                        options={empCategory}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="casteID"
                                                    label="Caste"
                                                    rules={[{ required: false, message: 'Please Choose Caste' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose Caste"
                                                        options={caste}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="subCasteID"
                                                    label="SubCaste"
                                                    rules={[{ required: false, message: 'Please Choose SubCaste' }]}
                                                >
                                                    <Select
                                                        placeholder="Please Choose SubCaste"
                                                        options={subCaste}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="idMark"
                                                    label="Identification Mark"
                                                    rules={[{ required: false, message: 'Please Enter The Identification Mark' }]}
                                                >
                                                    <Input maxLength={50} placeholder="Please Enter The Identification Mark" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    }]} />

                            </Row>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>
                        <Card title={<Typography style={{ color: 'white', fontSize: 18 }}>
                            {"Current Address"}</Typography>}
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="curAddress"
                                        label="Address"
                                        rules={[{ required: false, message: 'Please Enter The Address' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please Enter The Address" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curPin"
                                        label="PinCode"
                                        rules={[{ required: false, message: 'Please Enter The PinCode' },
                                        {
                                            pattern: /^[0-9\b]+$/,
                                            message: 'Please Enter a Valid Pincode',
                                        }]}
                                    >
                                        <Input maxLength={6} placeholder="Please Enter The PinCode" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curStateID"
                                        label="State"
                                        rules={[{ required: false, message: 'Please Choose The State' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the State"
                                            onSelect={(i)=>onSelectCurState(i)}
                                            options={state}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curDistrictID"
                                        label="District"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the District"
                                            options={district}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="curCountryID"
                                        label="Country"
                                        rules={[{ required: false, message: 'Please Choose The District' }]}
                                    >
                                        <Select
                                            placeholder="Please choose the District"
                                            options={country}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Space.Compact>
                                        <Form.Item
                                            style={{ width: '20%' }}
                                            initialValue={'+91'}
                                            name="curMobileNoCC"
                                            label="  CC"
                                            rules={[{ required: false, message: 'Please enter Mobile number cc' }]}
                                        >
                                            <Input maxLength={3} size={'middle'} placeholder="CC" />

                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: '80%' }}
                                            name="mobileNo"
                                            label="Mobile number"
                                            rules={[
                                                { required: true, type: 'string', message: 'Please enter mobile number' },
                                                {
                                                    pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                    message: 'Please enter a valid mobile number',
                                                }
                                            ]}
                                        >
                                            <Input maxLength={10} size={'middle'} placeholder="Please enter mobile number" />
                                        </Form.Item>

                                    </Space.Compact>

                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="perPhoneNo"
                                        label="Phone No"
                                        rules={[{ required: false, message: 'Please Enter Phone No' }]}
                                    >
                                        <Input maxLength={80} placeholder="Please enter Phone No" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="emergenyContactNo"
                                        label="Emergency ContactNo"
                                        rules={[
                                            { required: false, type: 'string', message: 'Please Enter Emergency ContactNo' },
                                            {
                                                pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                                message: 'Please enter a valid mobile number',
                                            }
                                        ]}
                                    >
                                        <Input maxLength={10} size={'middle'} placeholder="Please Enter Emergency ContactNo" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>
                        <Collapse
                            expandIcon={({ isActive }) => <RightOutlined style={{ color: 'white', fontSize: 18 }} rotate={isActive ? 90 : 0} />}
                            style={{ backgroundColor: '#004080' }}
                            items={[
                                {
                                    key: '1',
                                    label: <Space direction='horizontal'>
                                        {<Typography style={{ color: 'white', fontSize: 18 }}>
                                            {"Permanent Address"}</Typography>}
                                        <Checkbox style={{ color: 'white', fontSize: 14 }} onChange={onChange}>Same as Current</Checkbox>
                                    </Space>,
                                    children:
                                        <Row gutter={16}>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="perAddress"
                                                    label="Address"
                                                    rules={[{ required: false, message: 'Please Enter The Address' }]}
                                                >
                                                    <Input maxLength={80} placeholder="Please Enter The Address" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="perPin"
                                                    label="PinCode"
                                                    rules={[{ required: false, message: 'Please Enter The PinCode' },
                                                    {
                                                        pattern: /^[0-9\b]+$/,
                                                        message: 'Please Enter a Valid Pincode',
                                                    }]}
                                                >
                                                    <Input maxLength={6} placeholder="Please Enter The PinCode" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="perStateID"
                                                    label="State"
                                                    rules={[{ required: false, message: 'Please Choose The State' }]}
                                                >
                                                    <Select
                                                        onSelect={(e: any) => console.log(e)}
                                                        placeholder="Please choose the State"
                                                        options={state}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="perDistrictID"
                                                    label="District"
                                                    rules={[{ required: false, message: 'Please Choose The District' }]}
                                                >
                                                    <Select
                                                        placeholder="Please choose the District"
                                                        options={district}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                }
                            ]} />
                        <Divider orientation="left"><h4></h4></Divider>

                        {/* <Collapse
                            expandIcon={({ isActive }) => <RightOutlined style={{ color: 'white', fontSize: 18 }} rotate={isActive ? 90 : 0} />}
                            style={{ backgroundColor: '#004080' }}
                            items={[
                                {
                                    key: '1',
                                    label: <Space direction='horizontal'>
                                        {<Typography style={{ color: 'white', fontSize: 18 }}>
                                            {"Family Information"}</Typography>}
                                        <Checkbox style={{ color: 'white', fontSize: 14 }} onChange={onChange}>Same as Current</Checkbox>
                                    </Space>,
                                    children: formList()
                                }]}
                        /> */}
                        <Card title={<Space direction='horizontal'>
                            <Typography style={{ color: 'white', fontSize: 18 }}>
                                {"Documents"}</Typography>
                        </Space>
                        }
                            style={{ boxShadow: '2px 2px 2px #4874dc' }}
                            headStyle={{ backgroundColor: '#004080', border: 0 }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item
                                        name="aadhaarNo"
                                        label="Aadhaar Number"
                                        rules={[
                                            { required: true, message: 'Please Enter Aadhaar Number' },
                                            {
                                                pattern: /^[0-9\b]+$/,
                                                message: 'Please Enter a Aadhaar Number',
                                            }
                                        ]}
                                    >
                                        <Input maxLength={16} placeholder="Please Enter The Aadhaar Number" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="panNo"
                                        label="Pan Number"
                                        rules={[
                                            { required: true, message: 'Please Enter Pan Number' },
                                            // {
                                            //     pattern: /^[0-9\b]+$/,
                                            //     message: 'Please Enter a Pan Number',
                                            // }
                                        ]}
                                    >
                                        <Input maxLength={10} placeholder="Please Enter The Pan Number" />
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Col span={6}>
                                <Upload
                                    onChange={onUpload}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                            <Divider></Divider>
                            <Col span={6}>
                                <Form.Item
                                    name="photo"
                                    getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                        form.setFieldsValue({ photo: url })
                                    })}
                                    label="Photo"
                                    rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                                >
                                    <Upload
                                        className="avatar-uploader"
                                        // showUploadList={false}
                                        maxCount={1}
                                        listType="picture-circle"
                                    // defaultFileList={[...fileList]}
                                    // beforeUpload={beforeUpload}
                                    // onPreview={onPreview}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="signature"
                                    getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                                        form.setFieldsValue({ signature: url })
                                    })}
                                    label="Signature"
                                    rules={[{ required: false, message: 'Please Choose Signature Pic' }]}
                                >
                                    <Upload
                                        // showUploadList={false}
                                        // beforeUpload={beforeUpload}
                                        // onChange={(info) => handleChange(info, item)}
                                        // onPreview={onPreview}
                                        className="avatar-uploader"
                                        maxCount={1}
                                        listType="picture-card"
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>

                            </Col>
                        </Card>
                        <Divider orientation="left"><h4></h4></Divider>

                        <Row>
                            <Form.Item
                                name="isApproved"
                                valuePropName="checked"
                                label=""
                            >
                                <Checkbox>isApproved</Checkbox>

                            </Form.Item>
                            <Form.Item
                                name="isHandicapped"
                                valuePropName="checked"
                                label=""
                            >
                                <Checkbox>isHandicapped</Checkbox>

                            </Form.Item>
                            <Form.Item
                                name="isOverTimeValid"
                                valuePropName="checked"
                                label=""
                            >
                                <Checkbox>isOverTimeValid</Checkbox>

                            </Form.Item>
                        </Row>
                        <Row style={{ marginTop: 30 }} justify="center" align="middle">
                            <Form.Item >
                                <Button type="primary" htmlType="submit" >
                                    Register
                                </Button>
                            </Form.Item>
                        </Row>
                    </Form>
                </Card>
             </PageContainer>
        )
    }
    const addOtpForm = () => {
        return (
            <>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <h2>{'OTP Verification'}</h2>
                    <Form.Item
                        name="otp"
                        rules={[{ required: true, message: 'Please input your valid otp!' }]}
                    >
                        <Input placeholder="Enter the otp here" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Verify
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="link" htmlType="submit" className="login-form-button">
                            Resend the OTP
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }

    return (
        <>
            <Spin tip="Please wait..." spinning={loading}>
                {/* <Segmented options={["Basic", "Qualification", "Experience", 'Family Members']} block /> */}
                
                <Card
                title="Employee Registration">
                    <Tabs
                        tabPosition={'top'}
                        items={initialTabItems}
                        onChange={(activeKey) => setActiveTab(activeKey)}
                    />
                    <div style={{ marginTop: 3 }}>
                        {activeTab === "1" && addEmployeeRegForm()}
                        {activeTab === "2" && <AddQualification
                            state={state}
                            district={district}
                            country={country} 
                            empId={empID}/>}
                        {activeTab === "3" && <AddExperience
                            empId={empID}/>}
                        {activeTab === "4" && <AddFamily
                            empId={empID}
                            relation={relation}
                            gender={gender}/>}
                    </div>
                </Card>
            </Spin>
        </>
    );
};



export default EmployeeRegistration;