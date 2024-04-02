import type { ProFormInstance } from '@ant-design/pro-components';
import {
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { requestChangePassword } from '../services/api';
import { FormattedMessage, history, SelectLang, useIntl , useModel, Helmet } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDesignation, requestGetDistrict, requestGetGender, requestGetMarital, requestGetPackages, requestGetRank, requestGetRole, requestGetSection, requestGetSectionTree, requestGetState, requestGetUserType } from '@/services/apiRequest/dropdowns';
import { useEmotionCss } from '@ant-design/use-emotion-css';

import { forEach, functions } from 'lodash';
//import jwt from 'jwt-decode'
//import { fetchMenuData, currentUser as queryCurrentUser } from '../services/apiRequest/api';


const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const ChangePassword = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess, isdrawer  }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState<any>([])
    const [role, setRole] = useState<any>([])
    const [designation, setDesignation] = useState<any>([])
    const [section, setSection] = useState<any>([])
    const [rank, setRank] = useState<any>([]);
    const [userType, setUserType] = useState<any>([]);

    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [candidateData, setCandidateData] = useState({});
    const { initialState, setInitialState } = useModel('@@initialState');
    
    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        marginTop: 60,
        height: 300,
    };

    useEffect(() => {
        
        console.log("initialState");
        console.log(initialState);
      
       

       // getformidbyname()

    }, [])

    useEffect(() => {
        console.log({ selectedRows })
        if (isEditable) {
            formRef.current?.setFieldsValue({
                firstName: selectedRows?.firstName,
                middleName: selectedRows?.middleName,
                lastName: selectedRows?.lastName ? selectedRows?.lastName : "-",
                candPassword: selectedRows?.candPassword ? selectedRows?.candPassword : "-",
              

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

    
   
   

    const UserChangePassword =async (values: any) => {
        try {
            
          //  const firstName = event.target.elements.firstName.value;
           
            setLoading(true)
           
            const msg = await requestChangePassword( values  );
            setLoading(false)
            if (msg.isSuccess === "True") {
                //formRef.current?.resetFields();
                form.resetFields();
                message.success(msg.msg);
                //setOTPVisible(true);
               
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

    const addCandidateForm = () => {
        return (
            <Drawer
            title={`${isEditable ? `Edit ${selectedRows?.firstName}` : "User Change Password"}`}
            width={1000}
            onClose={closeDrawer}
            open={visible}
            bodyStyle={{ paddingBottom: 80 }}
            extra={<Space align="baseline">
                {/* <Button type="primary" onClick={reset}>
                    New Institute User
                </Button> */}
            </Space>}
        >

            <>
                <Spin tip="Please wait..." spinning={loading}>
            <Form
             form={form}
          //  containerStyle={{alignSelf:'center',width:'100%',marginInline:10}}
               // formRef={formRef}
               onFinish={async (values) => {
                UserChangePassword(values)
            }}
                // onSubmit={event =>
                //     addCandidate(
                //         event
                        
                //     )
                // }


                // formProps={{
                //     validateMessages: {
                //         required: 'This is required',
                //     },
                // }}
            >
                {/* <StepsForm.StepForm
                    name="basicInformation"
                    title="Basic Details"
                    stepProps={{
                        description: '',
                    }}
                    onFinish={async () => {
                        console.log(formRef.current?.getFieldsValue());
                        return true;
                    }}
                > */}
                    <div style={contentStyle}>
                        <Row gutter={16}>
                        {/* <Col span={6}>
                                <Form.Item
                                    name="userID"
                                    label="user ID"
                                    rules={[{ required: true, message: 'Please enter User ID' }]}
                                >
                                    <Input placeholder="Please enter User ID" />
                                </Form.Item>
                            </Col> */}
                          
                            <Col span={12}>
                                <Form.Item
                                    name="LoginName"
                                    label="Login Name"
                                    rules={[{ required: true, message: 'Please enter Login Name' }]}
                                >
                                    <Input placeholder="Please enter Login Name" />
                                </Form.Item>
                            </Col>
                              <Col span={12}>
                                <Form.Item
                                    name="OldPwd"
                                    label="Old Password"
                                    rules={[{ required: true, message: 'Please enter Old Password' }]}
                                >
                                    <Input placeholder="Please enter Old Password" />
                                </Form.Item>
                            </Col> 
                            <Col span={12}>
                                <Form.Item
                                    name="NewPwd"
                                    label="New Password"
                                    
                                    rules={[{ required: true, message: 'Please enter Password' }]}
                                >
                                    <Input type='password' placeholder="Please enter Password" />
                                </Form.Item>
                            </Col>
                           
                            
                            <Col span={12}>
                                 <Form.Item>
                        <Button type="primary" htmlType="submit"> Change Password</Button>
                    </Form.Item>
                            </Col>
                        </Row>
                    </div>
                {/* </StepsForm.StepForm> */}

                {/* Identity Proofs */}
               

               
                {/* Address Information */}
  
            </Form>
            </Spin>

            </>
            </Drawer>
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



export default ChangePassword;