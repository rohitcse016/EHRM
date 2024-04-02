import type { ProFormInstance } from '@ant-design/pro-components';
import {
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { requestAddInstituteUser } from '../services/api';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';


const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const EditInstituteUser = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState<any>([])
    const [district, setDistrict] = useState<any>([])
    const [city, setCity] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    const [branch, setBranch] = useState<any>([{ value: 1, label: "Branch 1" }])

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        marginTop: 60,
        height: 300,
    };

    useEffect(() => {

    }, [])



    useEffect(() => {
        console.log({ selectedRows })
        if (isEditable) {

            getState();
            getDistrict(selectedRows?.stateID, { value: selectedRows?.stateID, label: selectedRows?.stateID });
            getCity(selectedRows?.districtID, { value: selectedRows?.districtID, label: selectedRows?.districtID });
            getArea(selectedRows?.cityID, { value: selectedRows?.cityID, label: selectedRows?.cityID });
            getGender();
            getMarital();


            formRef.current?.setFieldsValue({
                firstName: selectedRows?.firstName,
                middleName: selectedRows?.middleName,
                lastName: selectedRows?.lastName ? selectedRows?.lastName : "-",
                candPassword: selectedRows?.candPassword ? selectedRows?.candPassword : "-",
                emailID: selectedRows?.emailID,
                mobileNo: selectedRows?.mobileNo,
                dob: dayjs(selectedRows?.dob, dateFormat),
            })
        } else {
            formRef.current?.resetFields();
        }

    }, [selectedRows])

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }

    const getGender = async () => {
        const res = await requestGetGender();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            setGender(dataMaskForDropdown)
        }
    }

    const getMarital = async () => {
        const res = await requestGetMarital();
        if (res?.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.maritalStatusID, label: item.maritalStatusName }
            })
            console.log({ dataMaskForDropdown })
            setMarital(dataMaskForDropdown)
        }
    }


    const getState = async () => {
        const res = await requestGetState();
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.stateID, label: item.stateName }
            })
            setState(dataMaskForDropdown)
            // if(isEditable){
            //     formRef.current?.setFieldsValue({
            //         stateID:{ value: selectedRows?.stateID, label: selectedRows?.stateName },
            //     })
            // }
        }
    }

    const getDistrict = async (value: any, item: any) => {
        const res = await requestGetDistrict(item);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.districtID, label: item.districtName }
            })
            setDistrict(dataMaskForDropdown)
        }
    }

    const getCity = async (value: any, item: any) => {
        const res = await requestGetCity(item);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.cityID, label: item.cityName }
            })
            setCity(dataMaskForDropdown)
        }
    }

    const getArea = async (value: any, item: any) => {
        const res = await requestGetArea(item);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.areaID, label: item.areaName }
            })
            setArea(dataMaskForDropdown)
        }
    }

    const addCandidate = async (values: any) => {
        try {
            values['dob'] = convertDate(values['dob']);

            const staticParams = {
                candidateID: isEditable ? selectedRows?.candidateID : "-1",
                profileImage: "",
                userID: "2",
                formID: "2",
                type: "1",
                otp: "4376",
            };

            setLoading(true)
            const msg = await requestAddCandidate({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                formRef.current?.resetFields();
                onClose();
                message.success(msg.msg);

                onSaveSuccess(msg);
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'pages.login.failure',
                defaultMessage: 'Login failed, please try again!',
            });
            console.log({ error });
            message.error(defaultLoginFailureMessage);
        }
    };

    const reset = () => {
        console.log("reset")
        formRef.current?.resetFields();
    }

    const closeDrawer = () => {
        onClose();
    }

console.log({sEEEEelected:selectedRows})
    return (
        <>
            <Drawer
                title={`${isEditable ? `Edit ${selectedRows?.firstName}` : "Create a new Add Candidate"}`}
                width={1000}
                onClose={closeDrawer}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={<Space align="baseline">
                    <Button type="primary" onClick={reset}>
                        New Candidate
                    </Button>
                </Space>}
            >

                <>
                    <Spin tip="Please wait..." spinning={loading}>
                        <StepsForm
                            formRef={formRef}
                            onFinish={async (values) => {
                                addCandidate(values)
                            }}

                            formProps={{
                                validateMessages: {
                                    required: 'This is required',
                                },
                            }}
                        >
                            {/* Basic Information */}
                            <StepsForm.StepForm
                                name="basicInformation"
                                title="Basic Information"
                                stepProps={{
                                    description: '',
                                }}
                                onFinish={async () => {
                                    console.log(formRef.current?.getFieldsValue());
                                    return true;
                                }}
                            >
                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.firstName}
                                                name="firstName"
                                                label="First Name"
                                                rules={[{ required: true, message: 'Please enter First Name' }]}
                                            >
                                                <Input placeholder="Please enter First Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.middleName}
                                                name="middleName"
                                                label="Middle Name"
                                                rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                            >
                                                <Input placeholder="Please enter Middle Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.lastName}
                                                name="lastName"
                                                label="Last Name"
                                                rules={[{ required: false, message: 'Please enter Last Name' }]}
                                            >
                                                <Input placeholder="Please enter Last Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.candPassword}
                                                name="candPassword"
                                                label="Password"
                                                rules={[{ required: false, message: 'Please enter Password' }]}
                                            >
                                                <Input placeholder="Please enter Password" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.mobileNo}
                                                name="mobileNo"
                                                label="Mobile No"
                                                rules={[{ required: false, message: 'Please enter Mobile No' }]}
                                            >
                                                <Input maxLength={11} placeholder="Please enter mobileNo" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.emailID}
                                                name="emailID"
                                                label="Email"
                                                rules={[{ required: false, message: 'Please enter Email' }]}
                                            >
                                                <Input maxLength={80} placeholder="Please enter Email" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="dob"
                                                label="DOB"
                                                rules={[{ required: false, message: 'Please choose the DOB' }]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>


                                </div>
                            </StepsForm.StepForm>

                            {/* Identity Proofs */}
                            <StepsForm.StepForm
                                name="identityProofs"
                                title="Identity"
                                stepProps={{
                                    description: '',
                                }}
                                onFinish={async () => {
                                    console.log(formRef.current?.getFieldsValue());
                                    return true;
                                }}
                            >
                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.panNo}
                                                name="panNo"
                                                label="PAN No"
                                                rules={[{ required: false, message: 'Please enter PAN No' }]}
                                            >
                                                <Input maxLength={12} placeholder="Please enter PAN No" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.aadhaarNo}
                                                name="aadhaarNo"
                                                label="Aadhaar No"
                                                rules={[{ required: false, message: 'Please enter Aadhaar No' }]}
                                            >
                                                <Input maxLength={12} placeholder="Please enter Aadhaar No" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="maritalStatusID"
                                                label="Marital Status"
                                                rules={[{ required: false, message: 'Please select an Marital Status' }]}
                                            >
                                                <Select
                                                    defaultValue={selectedRows?.maritalStatusID}
                                                    placeholder="Marital Status"
                                                    optionFilterProp="children"
                                                    options={marital}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="genderID"
                                                label="Gender"
                                                rules={[{ required: false, message: 'Please choose the Gender' }]}
                                            >
                                                <Select
                                                    defaultValue={selectedRows?.genderID}
                                                    placeholder="Please choose the Gender"
                                                    options={gender}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                    </Row>
                                </div>
                            </StepsForm.StepForm>

                            {/* Institution Information */}
                            <StepsForm.StepForm
                                name="instInformation"
                                title="Institution Information"
                                stepProps={{
                                    description: '',
                                }}
                                onFinish={async () => {
                                    console.log(formRef.current?.getFieldsValue());
                                    return true;
                                }}
                            >
                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.instUiqueID}
                                                name="instUiqueID"
                                                label="Inst Unique ID"
                                                rules={[{ required: false, message: 'Please enter Inst Unique ID' }]}
                                            >
                                                <Input placeholder="Please enter Inst Unique ID" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="branchID"
                                                label="branchID"
                                                rules={[{ required: false, message: 'Please enter branchID' }]}
                                            >
                                                <Select
                                                    defaultValue={1}
                                                    autoComplete="new-state"
                                                    placeholder="State"
                                                    options={branch}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.otherBranchName}
                                                name="otherBranchName"
                                                label="otherBranchName"
                                                rules={[{ required: false, message: 'Please enter otherBranchName' }]}
                                            >
                                                <Input placeholder="Please enter otherBranchName" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.instName}
                                                name="instName"
                                                label="instName"
                                                rules={[{ required: false, message: 'Please enter instName' }]}
                                            >
                                                <Input placeholder="Please enter instName" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                        <Col span={8}></Col>
                                    </Row>
                                </div>

                            </StepsForm.StepForm>

                            {/* Address Information */}
                            <StepsForm.StepForm
                                name="address"
                                title="Address Information"
                                stepProps={{
                                    description: '',
                                }}
                                onFinish={async () => {
                                    console.log(formRef.current?.getFieldsValue());
                                    return true;
                                }}
                            >

                                <div style={contentStyle}>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.candidateAddress}
                                                name="candidateAddress"
                                                label="Candidate Address"
                                                rules={[{ required: false, message: 'Please enter candidate Address' }]}
                                            >
                                                <Input placeholder="Please enter candidate Address" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.instAddress}
                                                name="instAddress"
                                                label="Inst. Address"
                                                rules={[{ required: false, message: 'Please enter instAddress' }]}
                                            >
                                                <Input placeholder="Please enter instAddress" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="stateID"
                                                label="State"
                                                rules={[{ required: false, message: 'Please choose the State' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    autoComplete="new-state"
                                                    placeholder="State"
                                                    options={state}
                                                    defaultValue={selectedRows?.stateID}
                                                    onChange={(value, item) => {
                                                        getDistrict(value, item)
                                                        formRef.current?.resetFields(["districtID", "cityID", "areaID"]);
                                                    }}

                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="districtID"
                                                label="District"

                                                rules={[{ required: false, message: 'Please choose the District' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="District"
                                                    autoComplete="new-state"
                                                    options={district}
                                                    defaultValue={selectedRows?.districtID}
                                                    onChange={(value, item) => {
                                                        getCity(value, item)
                                                        formRef.current?.resetFields(["cityID"]);
                                                        formRef.current?.resetFields(["cityID", "areaID"]);
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="cityID"
                                                label="City"
                                                rules={[{ required: false, message: 'Please choose the City' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    defaultValue={selectedRows?.cityID}
                                                    placeholder="Search to City"
                                                    options={city}
                                                    autoComplete="new-state"
                                                    optionFilterProp="children"
                                                    onChange={(value, item) => {
                                                        getArea(value, item)
                                                        formRef.current?.resetFields(["areaID"]);
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="areaID"
                                                label="Area"
                                                rules={[{ required: false, message: 'Please choose the Area' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    defaultValue={selectedRows?.areaID}
                                                    placeholder="Search to Area"
                                                    optionFilterProp="children"
                                                    options={area}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>

                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.landmark}
                                                name="landmark"
                                                label="Landmark"
                                                rules={[{ required: false, message: 'Please enter Landmark' }]}
                                            >
                                                <Input placeholder="Please enter Landmark" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={selectedRows?.sessionName}
                                                name="sessionName"
                                                label="Session Name"
                                                rules={[{ required: false, message: 'Please enter Session Name' }]}
                                            >
                                                <Input placeholder="Please enter Session Name" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                            </StepsForm.StepForm>
                        </StepsForm>
                    </Spin>

                </>

            </Drawer>
        </>
    );
};

export default EditInstituteUser;