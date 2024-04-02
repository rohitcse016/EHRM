import type { ProFormInstance } from '@ant-design/pro-components';
import {
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber } from 'antd';

import { useEffect, useRef, useState } from 'react';
import { requestAddUser } from '../services/api';
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

const AddUser = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess, isdrawer  }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState<any>([])
    const [role, setRole] = useState<any>([])
    const [designation, setDesignation] = useState<any>([])
    const [section, setSection] = useState<any>([])
    const [rank, setRank] = useState<any>([{ value: -1, label: "All" }]);
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
      
       
        getGender()
       // getMarital()
        getPackages();
        getRole();
        getDesignation();
        getSection();
        getRank();
        getUserType();

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
                emailID: selectedRows?.emailID,
                mobileNo: selectedRows?.mobileNo,
                dob: dayjs(selectedRows?.dob, dateFormat),
               // panNo: selectedRows?.panNo,
                //aadhaarNo: selectedRows?.aadhaarNo,
                //maritalStatusID: { value: selectedRows?.maritalStatusID, label: selectedRows?.maritalStatusName },
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

    const getUserType = async () => {
        const res = await requestGetUserType();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.userTypeID, label: item.userTypeName }
            })
            setUserType(dataMaskForDropdown)
        }
    }

    const getRank = async () => {
        const res = await requestGetRank();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.rankID, label: item.rankName }
            })
            setRank(dataMaskForDropdown)
        }
    }

    const getSection = async () => {
        const staticParams = {
              "sectionID": "-1",
              "type": "1"
        };

        const res = await requestGetSectionTree(staticParams);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.sectionID, label: item.sectionName , sectionID: item.sectionID, sectionName: item.sectionName , plainSectionName: item.plainSectionName, sectionCode: item.sectionCode, parentSectionID: item.parentSectionID, mainSectionID: item.mainSectionID, parentMainSectionID: item.parentMainSectionID, rowID: item.rowID, depthLevel:item.depthLevel, sectionTree:item.sectionTree, sectionIDTree:item.sectionIDTree }
            })
            setSection(dataMaskForDropdown)
        }
    }
    const getDesignation  = async () => {

        const staticParams = {
            DesigID: "-1",
        };
        const res = await requestGetDesignation(staticParams);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.desigID, label: item.desigName , desigID: item.desigID , desigName: item.desigName , desigCode: item.desigCode , isActive: item.isActive , priority: item.priority , desigType: item.desigType }
            })
            setDesignation(dataMaskForDropdown)
        }
    }

    const getRole  = async () => {
        const staticParams = {
            RoleID: "-1",
        };
        const res = await requestGetRole(staticParams);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.rowID, label: item.rowValue }
            })
            setRole(dataMaskForDropdown)
        }
    }
    
    const getPackages  = async () => {
        const staticParams = {
            collegeID: "1",
            packageID: "-1",
            type: "1"
        };


        const res = await requestGetPackages(staticParams);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.packageID, label: item.packageName, packageID: item.packageID, packageName: item.packageName, orgID: item.orgID, packageURL:item.packageURL }
            })
            setPackages(dataMaskForDropdown)
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

   
    

      function  getformidbyname (values: string | undefined)   {
        // initialState.data.formRight.leght
        var formid="";
        for (let i = 0; i < initialState.data.formRight.length; i++) {
                console.log(initialState.data.formRight[i]['displayName'])
                if(initialState.data.formRight[i]['displayName']==values)
                {
                    formid=  initialState.data.formRight[i]['formID'];
                }
                // Code to be repeated
          }
        return formid;
        //console.log(initialState.data.formRight.length)
    }

    function  getuserid ()   {
        // initialState.data.formRight.leght

       // const user = jwt(initialState?.currentUser?.verifiedUser.token);
       

       // return user.UserId;
        //console.log(initialState.data.formRight.length)
    }



    const addCandidate =async (values: any) => {
        try {
            
          //  const firstName = event.target.elements.firstName.value;
           
const packaget_array: { packageID: any; packageName: any; orgID: any; packageURL: any; }[]=[];
const role_array :{roleID: any; type: any; }[] =[];
const designstion_array:{desigID:any; desigName:any; desigCode:any; isActive:any; priority:any; desigType:any;}[] =[];
const section_array:{sectionID:any; sectionName:any; sectionCode:any; parentSectionID:any; mainSectionID:any; parentMainSectionID:any;depthLevel:any;}[] =[];


            values.packageT.forEach((pkg, index) => {
                const filtered = packages.filter((pkge: { packageID: string; }) => {
                    return pkge.packageID === pkg;
                  });
                  packaget_array.push({ packageID: filtered[0].packageID, packageName: filtered[0].packageName, orgID: filtered[0].orgID, packageURL:filtered[0].packageURL})
            })

            values.desigT.forEach((desig, index) => {

               
                const filtered = designation.filter((designations: { desigID: string; }) => {
                    return designations.desigID === desig;
                  });
                  designstion_array.push({ desigID: filtered[0].desigID, desigName: filtered[0].desigName, desigCode: filtered[0].desigCode, isActive:filtered[0].isActive, priority:filtered[0].priority, desigType:filtered[0].desigType})
            })

            values.sectionT.forEach((sect, index) => {

               
                const filtered = section.filter((sections: { sectionID: string; }) => {
                    return sections.sectionID === sect;
                  });
                  section_array.push({ sectionID: filtered[0].sectionID+"", sectionName: filtered[0].sectionName, sectionCode: filtered[0].sectionCode, parentSectionID:filtered[0].parentSectionID, mainSectionID:filtered[0].mainSectionID+"", parentMainSectionID:filtered[0].parentMainSectionID, depthLevel:filtered[0].depthLevel+""})
            })
            values.roleT.forEach((rl, index) => {
                console.log(role)
                const filtered = role.filter((roles: { value: string; }) => {
                    return roles.value === rl;
                  });
                  role_array.push({ roleID: filtered[0].value, type: 1})
            })
           
           // const content = event.target.elements.content.value;
           values['dob'] = values?.dob ? convertDate(values['dob']) :dayjs();

            const staticParams = {
                userID: "-1",
                
                //userID: getuserid(),
                //formID: getformidbyname('Institute User Profile'),
                "sectionT": section_array,
                  "desigT": designstion_array,
                  "roleT": role_array,
                  "packageT":packaget_array,
                  "rankID": values.rankID?values.rankID+"":"-1",
                  ShortName :"",
                  UserTypeID:"-1",
                  stringName:"",
                  "middleName":values.middleName ? values.middleName :"",
                  
                formID: "-1",
                type: "1",
                otp: "",

               
              
            };

            console.log(staticParams);

            setLoading(true)
          
            const msg = await requestAddUser({ ...values, ...staticParams} );
            setLoading(false)
            if (msg.isSuccess === true) {
                //formRef.current?.resetFields();
                // form.resetFields();
                message.success(msg.msg);
                //setOTPVisible(true);
                setCandidateData({ ...values, ...staticParams })
               // const urlParams = new URL(window.location.href).searchParams;
                // setTimeout(() => {
                //     history.push(urlParams.get('redirect') || '/list');
                // }, 1000)
                onSaveSuccess()
                onClose();
                //requestForOTP({ ...values, ...staticParams })
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
           // var token = initialState?.currentUser?.verifiedUser.token;
           // params['token'] =token;
            const msg = await requestAddUser(params);
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
          //  var token = initialState?.currentUser?.verifiedUser.token;
          
           // data['token'] = token;
            const msg = await requestAddUser(data);
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
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        requestForValidateOTP(values);
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
            title={`${isEditable ? `Edit ${selectedRows?.firstName}` : "Create a new User"}`}
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
                addCandidate(values)
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
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please enter First Name' }]}
                                >
                                    <Input placeholder="Please enter First Name" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="middleName"
                                    label="Middle Name"
                                    rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                >
                                    <Input placeholder="Please enter Middle Name" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                               labelCol={{ span: 24 }}
                                    name="surName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please enter Last Name' }]}
                                >
                                    <Input placeholder="Please enter Last Name" />
                                </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="loginName"
                                    label="Login Name"
                                    rules={[{ required: true, message: 'Please enter Login Name' }]}
                                >
                                    <Input placeholder="Please enter Login Name" />
                                </Form.Item>
                            </Col>
                            
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="loginPassword"
                                    label="Password"
                                    
                                    rules={[{ required: true, message: 'Please enter Password' }]}
                                >
                                    <Input type='password' placeholder="Please enter Password" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="userCode"
                                    label="User Code"
                                    rules={[{ required: true, message: 'Please enter User Code' }]}
                                >
                                    <Input placeholder="Please enter User Code" />
                                </Form.Item>
                            </Col>
                            
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="curMobile"
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
                                labelCol={{ span: 24 }}
                                    name="eMail"
                                    label="Email"
                                    rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}
                                >
                                    <Input maxLength={80} placeholder="Please enter Email" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="dob"
                                    label="DOB"
                                    rules={[{ required: true, message: 'Please choose the DOB' }]}
                                >
                                    {/* 12 age min DD-MMM-YYYY */}
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format={'DD-MMM-YYYY'}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="genderID"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please choose the Gender' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Gender"
                                        style= {{ width: '100%',textAlign:'start' }}
                                        options={gender}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="packageT"
                                    label="Packages"
                                    rules={[{ required: true, message: 'Please choose the Packages' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Packages"
                                        mode="multiple"
                                        style= {{ width: '100%', }}
                                        maxTagCount= 'responsive'
                                        options={packages}
                                        onSelect={(e)=>{
                                            console.log(packages)
                                            console.log(e)

                                            const filtered = packages.filter((pkge: { packageID: string; }) => {
                                                return pkge.packageID === e;
                                              });
                                              console.log(filtered)
                                           // packages.filter(data => data.id === e)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                          
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="roleT"
                                    label="Role"
                                   
                                    
                                    rules={[{ required: true, message: 'Please choose the Role' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        style= {{ width: '100%', }}
                                        maxTagCount= 'responsive'
                                        allowClear
                                        placeholder="Please choose the Role"
                                        options={role}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="desigT"
                                    label="Designation"
                                    
                                    rules={[{ required: true, message: 'Please choose the Designation' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        style= {{ width: '100%', }}
                                        maxTagCount= 'responsive'
                                        allowClear
                                        placeholder="Please choose the Designation"
                                        options={designation}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="sectionT"
                                    label="Section"
                                    
                                    rules={[{ required: true, message: 'Please choose the Section' }]}
                                >
                                    <Select
                                  style= {{ width: '100%', }}
                                  maxTagCount= 'responsive'
                                    mode="multiple"
                                    
                                    allowClear
                                        placeholder="Please choose the Section"
                                        options={section}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="rankID"
                                    label="Rank"
                                    rules={[{ required: false, message: 'Please choose the Rank' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Rank"
                                        style= {{ width: '100%',textAlign:'start' }}
                                        options={rank}
                                       
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="userTypeID"
                                    label="User Type"
                                    rules={[{ required: true, message: 'Please choose the User Type' }]}
                                >
                                    <Select
                                        placeholder="Please choose the User Type"
                                        allowClear
                                        style= {{ width: '100%',textAlign:'start' }}
                                        options={userType}
                                       
                                    />
                                </Form.Item>
                            </Col>


                            <Col span={4}>
                                 <Form.Item
                                 label=" "
                                 labelCol={{ span: 24 }}
                                 >
                                    
                        <Button type="primary" htmlType="submit"> Submit</Button>
                    </Form.Item>
                            </Col> <Col span={4}>
                                 <Form.Item
                                 label=" "
                                 labelCol={{ span: 24 }}
                                 >
                                    
                        <Button type="primary" htmlType="reset" onClick={form.resetFields()}  > Reset</Button>
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



export default AddUser;