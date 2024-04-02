import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker, List, Avatar, Tag, Drawer, DatePicker } from 'antd';
import { requestGetBloodGroup, requestGetCivilStatus, requestGetCountry, requestGetDept, requestGetDesig, requestGetDesignation, requestGetDistrict, requestGetGender, requestGetSection, requestGetShift, requestGetState, requestGetWorkingStatus } from '@/services/apiRequest/dropdowns';
import moment from 'moment';
import { dateFormat } from '@/utils/constant';
import { requestGetEmpCategory, requestGetMaritalStatus } from '@/pages/Master/services/api';


const EmployeeFilter = ({ visible, onClose, selectedRows, loading, onFilter }: any) => {

    const [filterForm] = Form.useForm();
    const [genderChoices, setGenderChoices] = useState<any>([]);
    const [civilStatusChoices, setCivilStatusChoices] = useState<any>([]);
    const [bloodGroupChoices, setBloodGroupChoices] = useState<any>([]);
    const [nationalityChoices, setNationalityChoices] = useState<any>([]);
    const [serviceTypeChoices, setServiceTypeChoices] = useState<any>([]);
    const [state, setState] = useState<any>([])
    const [department, setDepartment] = useState<any>([])
    const [designation, setDesignation] = useState<any>([])
    const [workingStatus, setWorkingStatus] = useState<any>([])
    const [shift, setShift] = useState<any>([])
    const [empCategory, setEmpCategory] = useState<any>([{ value: -1, label: "All" }])

    useEffect(() => {
        getChoices();
    }, []);

    const getChoices = async () => {
        await getGenderData();
        await getBloodGroupData();
        await getDepartment();
        await getDesignation();
        await getWorkingStatus();
        await getServiceTypeData();
        await getShift();
        await getMaritalStatus()
        await getEmpCategory()

        filterForm.setFieldsValue({
            "empID": -1,
            "empCode": "",
            "empName": "",
            "mobileNo": "",
            "emailID": "",
            "genderID": -1,
            "bloodGroupID": -1,
            "maritalStatusID": -1,
            "empCategoryID": -1,
            "empTypeID": -1,
            "deptID": -1,
            "desigID": -1,
            "workingStatusID": -1,
            "shiftID": -1,
            "isApproved": -1,
            "userID": -1,
            "formID": -1,
            "type": 1,
            // fromDate: '1900-11-21T12:47:26.406Z',
            // toDate: '2023-12-21T12:47:26.406Z',
        })
    }

    const getWorkingStatus = async () => {
        const res = await requestGetWorkingStatus();
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.workingStatusID, label: item.workingStatusName }
            })
            dataMaskForDropdown.unshift({ value: -1, label: "Select" });
            setWorkingStatus(dataMaskForDropdown)
        }
    }
    const getDepartment = async () => {
        const params = {
            "deptID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetDept(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.deptID, label: item.deptName }
            })
            dataMaskForDropdown.unshift({ value: -1, label: "All" });
            setDepartment(dataMaskForDropdown)
        }
    }
    const getDesignation = async () => {
        const params: any = {
            "desigID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetDesig(params);
        if (res?.result.length > 0) {
            const dataMaskForDropdown = res?.result.map((item: any) => {
                return { value: item.desigID, label: item.desigName }
            })
            dataMaskForDropdown.unshift({ value: -1, label: "All" });
            setDesignation(dataMaskForDropdown)
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

    const getGenderData = async () => {
        const params: any = {
            genderID: -1,
            userID: -1,
            formID: -1,
            type: 1
        }
        const res = await requestGetGender(params);
        let dataMaskForDropdown = [];
        if (res?.result.length > 0) {
            dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            });
        }
        dataMaskForDropdown.unshift({ value: -1, label: "Select" });

        setGenderChoices(dataMaskForDropdown)
    }

    const getBloodGroupData = async () => {
        const params = {
            "bloodGroupID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetBloodGroup(params);
        let dataMaskForDropdown = [];
        if (res.result.length > 0) {
            dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.bloodGroupID, label: item.bloodGroupName }
            });
        }
        dataMaskForDropdown.unshift({ value: -1, label: "All" });
        setBloodGroupChoices(dataMaskForDropdown)
    }

    const getServiceTypeData = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        // const res = await requestGetGender(params);
        let dataMaskForDropdown = [];
        // if (res.data.length > 0) {
        //     dataMaskForDropdown = res?.data?.map((item: any) => {
        //         return { value: item.genderID, label: item.genderName }
        //     });
        // }
        dataMaskForDropdown.unshift({ value: -1, label: "All" });
        setServiceTypeChoices(dataMaskForDropdown)
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
            setCivilStatusChoices(dataMaskForDropdown)
        }
    }

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    /* eslint-enable no-template-curly-in-string */

    const onFinishPatForm = async (values: any) => {
        values['keyword'] = values?.empName ? values?.empName:""

        if (!values.patientDOB) {
            values['patientDOB'] = '1900-01-01';
        } else {
            values['patientDOB'] = moment(values.patientDOB).format('YYYY-MM-DD');
        }
        if (!values.fromToDate) {
            values['fromDate'] = '1900-01-21';
            values['toDate'] = moment(new Date()).format('YYYY-MM-DD');
        } else {
            values['fromDate'] = moment(values.fromToDate[0]).format('YYYY-MM-DD');
            values['toDate'] = moment(values.fromToDate[1]).format('YYYY-MM-DD');
        }
        console.log(values);
        onFilter(values);

    };



    const handleResetFilter = async () => {
        await filterForm.resetFields();
        await filterForm.setFieldsValue({
            "empID": -1,
            "empCode": "",
            "empName": "",
            "mobileNo": "",
            "emailID": "",
            "genderID": -1,
            "bloodGroupID": -1,
            "maritalStatusID": -1,
            "empCategoryID": -1,
            "empTypeID": -1,
            "deptID": -1,
            "desigID": -1,
            "workingStatusID": -1,
            "shiftID": -1,
            "isApproved": -1,
            "userID": -1,
            "formID": -1,
            "type": 1,
            // fromDate: '1900-01-21',
            // toDate: moment(new Date()).format('YYYY-MM-DD')
        });
        console.log(filterForm.getFieldsValue())
        onFinishPatForm(filterForm.getFieldsValue())
        // onFilter(filterForm.getFieldValue());
    }

    const handleChangeFilter = (value: any) => { }

    return (
        <>
            <Drawer title="Employee Filter" placement="right" onClose={onClose} open={visible}
                extra={<>
                    {/* <Button type="primary" danger loading={loading} htmlType="submit" onClick={handleResetFilter}>
                        Reset
                    </Button> */}
                </>}
            >
                <Form
                    onFinish={onFinishPatForm}
                    form={filterForm}
                    validateMessages={validateMessages}
                    layout="vertical"
                >

                    <Form.Item name="empName" label="Employee Name" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="empCode" label="Employee Code" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="mobileNo" label="Mobile No" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="emailID" label="Email ID" rules={[{ required: false }]}>
                        <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                    <Form.Item name="genderID" label="Gender" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={genderChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="bloodGroupID" label="Blood Group" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={bloodGroupChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="maritalStatusID" label="Marital Status" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={civilStatusChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>


                    <Form.Item name="empCategoryID" label="Category" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={empCategory}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item hidden name="empTypeID" label="Type" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={serviceTypeChoices}
                            defaultValue={-1}
                        />
                    </Form.Item>

                    <Form.Item name="deptID" label="Department" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={department}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="desigID" label="Designation" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={designation}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="workingStatusID" label="Working Status" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={workingStatus}
                            defaultValue={-1}
                        />
                    </Form.Item>
                    <Form.Item name="shiftID" label="Shift" rules={[{ required: false }]}>
                        <Select
                            onChange={handleChangeFilter}
                            options={shift}
                            defaultValue={-1}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit">
                            Filter
                        </Button>
                        <Button onClick={() => handleResetFilter()} style={{ marginLeft: 20 }} type="primary">
                            Clear
                        </Button>

                    </Form.Item>
                </Form >
            </Drawer>
        </>
    );
};

export default EmployeeFilter;
