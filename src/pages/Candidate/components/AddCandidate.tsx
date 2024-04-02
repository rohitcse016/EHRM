import type { ProFormInstance } from '@ant-design/pro-components';
import {
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { requestAddCandidate } from '../services/api';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDistrict, requestGetGender, requestGetMarital, requestGetState } from '@/services/apiRequest/dropdowns';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import '../styles/addCandidate.css'

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const AddCandidate = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<any>([])
    const [district, setDistrict] = useState<any>([])
    const [city, setCity] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    const [branch, setBranch] = useState<any>([{ value: 1, label: "Branch 1" }]);
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [candidateData, setCandidateData] = useState({});
    const [dobValidation, setDobValidation] = useState<any>();

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        marginTop: 60,
        height: 300,
    };

    useEffect(() => {
        getState()
        getGender()
        getMarital()
        const dobRestrictDate = moment().subtract(12, 'y').format('YYYY-MM-DD');
        setDobValidation(dobRestrictDate)
        let customDate = moment().format("YYYY-MM-DD");
        console.log(moment() && moment() > moment(customDate, "YYYY-MM-DD"))
    }, [])

    useEffect(() => {
        console.log({ selectedRows })
        if (isEditable) {
            formRef.current?.setFieldsValue({
                firstName: selectedRows?.firstName,
                middleName: selectedRows?.middleName,
                lastName: selectedRows?.lastName ? selectedRows?.lastName : "-",
                candPassword: selectedRows?.candPassword ? selectedRows?.candPassword : "-",
                emailID: selectedRows?.emailID,
                mobileNo: selectedRows?.mobileNo,
                dob: dayjs(selectedRows?.dob, dateFormat),
                panNo: selectedRows?.panNo,
                aadhaarNo: selectedRows?.aadhaarNo,
                maritalStatusID: { value: selectedRows?.maritalStatusID, label: selectedRows?.maritalStatusName },
                genderID: { value: selectedRows?.genderID, label: selectedRows?.genderName },

            })
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

    const getBranch = async () => {
        const res = await requestGetBranch();
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
            console.log({ dataMaskForDropdown })
            setState(dataMaskForDropdown)
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
            });
            setCity(dataMaskForDropdown);
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
                formID: 2,
                type: 1,
                otp: "",
            };

            setLoading(true)
            const msg = await requestAddCandidate({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                formRef.current?.resetFields();
                message.success(msg.msg);
                setOTPVisible(true);
                setCandidateData({ ...values, ...staticParams })
                requestForOTP({ ...values, ...staticParams })
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

    const requestForOTP = async (params: any) => {
        try {
            setLoading(true)
            params['type'] = 4;
            const msg = await requestAddCandidate(params);
            setLoading(false)
            if (msg.isSuccess === "True") {
                // message.success(msg.msg);
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            const defaultLoginFailureMessage = "Please try again!";
            message.error(defaultLoginFailureMessage);
        }
    }

    const requestForValidateOTP = async (params: any) => {
        try {
            setLoading(true)
            const data: any = { ...candidateData };
            data['type'] = 5;
            data['otp'] = params.otp;
            const msg = await requestAddCandidate(data);
            setLoading(false)
            if (msg.isSuccess === "True") {
                message.success(msg.msg);
                const urlParams = new URL(window.location.href).searchParams;
                setTimeout(() => {
                    history.push(urlParams.get('redirect') || '/user/login');
                }, 1000)
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            const defaultLoginFailureMessage = "Please try again!";
            message.error(defaultLoginFailureMessage);
        }
    }

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        requestForValidateOTP(values);
    };
    const goBack = () => {
        history.push("/")
    }

    const addCandidateForm = () => {
        return (<div style={{ alignItems:'inherit'}}>
            <StepsForm
                containerStyle={{ width: '100%', marginInline: 10 }}
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
                <StepsForm.StepForm
                    name="basicInformation"
                    title="Basic Details"
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
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please enter First Name' }]}
                                >
                                    <Input placeholder="Please enter First Name" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="middleName"
                                    label="Middle Name"
                                    rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                >
                                    <Input placeholder="Please enter Middle Name" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please enter Last Name' }]}
                                >
                                    <Input placeholder="Please enter Last Name" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="candPassword"
                                    label="Password"
                                    rules={[{ required: true, message: 'Please enter Password' }]}
                                >
                                    <Input type="password" placeholder="Please enter Password" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="mobileNo"
                                    label="Mobile No"
                                    rules={[
                                        { required: true, type: 'string', message: 'Please enter mobile number' },
                                        {
                                            pattern: /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
                                            message: 'Please enter a valid mobile number',
                                        }
                                    ]}
                                >
                                    <Input
                                        maxLength={10}
                                        placeholder="Please enter mobileNo" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="emailID"
                                    label="Email"
                                    rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
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
                                    {/* 12 age min DD-MMM-YYYY */}
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format={'DD-MMM-YYYY'}
                                        disabledDate={(current) => {
                                            let customDate = moment().format("YYYY-MM-DD");
                                            return current && current > dayjs().subtract(12, 'year');
                                        }}
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
                                    name="panNo"
                                    label="PAN No"
                                    rules={[
                                        { required: false, message: 'Please enter PAN No' },
                                        // {
                                        //     pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                                        //     message: 'Please enter a valid PAN number',
                                        // }
                                    ]}
                                >
                                    <Input maxLength={12} placeholder="Please enter PAN No" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="aadhaarNo"
                                    label="Aadhaar No"
                                    rules={[
                                        { required: false, message: 'Please enter Aadhaar No' },
                                        // {
                                        //     pattern: /^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/,
                                        //     message: 'Please enter a valid Aadhaar number',
                                        // }
                                    ]}
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
                            <Col span={8}></Col>
                            <Col span={8}></Col>
                        </Row>
                    </div>
                </StepsForm.StepForm>

                {/* Institution Information */}
                <StepsForm.StepForm
                    name="instInformation"
                    title="Institution"
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
                                        autoComplete="new-state"
                                        placeholder="Branch"
                                        options={branch}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="otherBranchName"
                                    label="Other Branch Name"
                                    rules={[{ required: false, message: 'Please enter Other Branch Name' }]}
                                >
                                    <Input placeholder="Please enter otherBranchName" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="instName"
                                    label="Inst Name"
                                    rules={[{ required: false, message: 'Please enter Inst Name' }]}
                                >
                                    <Input placeholder="Please enter instName" />
                                </Form.Item>
                            </Col>
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
                                    name="candidateAddress"
                                    label="Candidate Address"
                                    rules={[{ required: false, message: 'Please enter candidate Address' }]}
                                >
                                    <Input placeholder="Please enter candidate Address" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="instAddress"
                                    label="Inst. Address"
                                    rules={[{ required: false, message: 'Please enter Inst. Address' }]}
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
                                        onChange={(value, item) => {
                                            getCity(value, item)
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
                                        placeholder="Search to Area"
                                        optionFilterProp="children"
                                        options={area}
                                    />
                                </Form.Item>
                            </Col>
                            {/* </Row>
                        <Row gutter={16}> */}
                            <Col span={8}>
                                <Form.Item
                                    name="landmark"
                                    label="Landmark"
                                    rules={[{ required: false, message: 'Please enter Landmark' }]}
                                >
                                    <Input placeholder="Please enter Landmark" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="sessionName"
                                    label="Session Name"
                                    rules={[{ required: false, message: 'Please enter Session Name' }]}
                                >
                                    <Input placeholder="Please enter Session Name" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </StepsForm.StepForm>

            </StepsForm>
            <Button onClick={goBack} style={{ }} type="primary" >
                Cancel
            </Button>
        </div>
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
                <Row justify="space-around" align="middle">
                    {!isOtpVisible ? addCandidateForm() : addOtpForm()}
                </Row>
            </Spin>
        </>
    );
};



export default AddCandidate;