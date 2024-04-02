import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Divider, Tabs, Card } from 'antd';

import { useEffect, useRef, useState } from 'react';

const moment = require('moment');
import dayjs from 'dayjs';
import { PageContainer, ProFormInstance, StepsForm } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import { getUserType } from '@/utils/common';
import { requestAddCandidate, requestGetCandidateList } from '@/pages/Candidate/services/api';
import ViewCandidate from '@/pages/Candidate/components/ViewCandidate';
import EditCandidate from '@/pages/Candidate/components/EditCandidate';
import UpdateProfileImage from './UpdateProfileImage';
import UpdateDocsUpload from './UpdateDocsUpload';

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';



const UserProfile = () => {
    // console.log(getUserType)
    const formRef = useRef<ProFormInstance>();
    const [visible, setVisible] = useState(false);
    const [visibleAdmin, setVisibleAdmin] = useState(false);
    const [loading, setLoading] = useState(false)
    const intl = useIntl();
    const [openViewCandidate, setOpenViewCandidate] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Object>({});
    const [isEditable, setIsEditable] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<any>("1");

    const user = JSON.parse(localStorage.getItem("user") as string);
    const data = user?.verifiedUser;
    const datatype = getUserType()
    console.log(user?.verifiedUser?.userID)

    const contentStyle: React.CSSProperties = {
        lineHeight: '230px',
        textAlign: 'center',
        marginTop: 60,
        height: 250,
    };

    const initialTabItems = [
        { label: 'Profile Image', children: '', key: '1' },
        { label: 'Edit Information', children: '', key: '2' },
        { label: 'Documents', children: '', key: '3' },
    ];

    useEffect(() => {
        getCandidateList();
        setVisibility()
    }, [])

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }
    const setVisibility = () => {
        if (datatype === 'InstituteUser')
            setVisible(true)
        if (datatype === 'Candidate')
            setOpenViewCandidate(true)
        if (datatype === 'Admin')
            setVisibleAdmin(true)
    }
    const onEditCandidate = (value: any) => {
        setOpenViewCandidate(false)
        setVisible(value)
        console.log(value)
    }
    const onClose = () => {
        setVisible(false)
        setVisibleAdmin(false)
        history.push("/welcome")
    }
    const onCloseViewCandidate = () => {
        setOpenViewCandidate(false);
    };

    const handleSubmit = (values: any) => {
        console.log(values)
        if (datatype === 'InstituteUser')
            addInstituteUser(values)
        if (datatype === 'Candidate')
            addCandidate(values)
        if (datatype === 'Admin')
            message.error("Please login  by another user");
    }
    const addInstituteUser = async (values: any) => {
        console.log(values)
        try {
            values['dob'] = convertDate(values['dob']);
            const staticParams = {
                userID: "-1",
                formID: '10',
                type: "2",
                otp: "",
                emailID: "email",
                mobileNo: "9999999999",
                userPassword: "password",
                genderID: "1",
            };
            console.log(staticParams)

            setLoading(true)
            // const msg = await requestUpdateInstituteUser({ ...values, ...staticParams });
            // setLoading(false)
            // if (msg.isSuccess === "True") {
            //     formRef.current?.resetFields();
            //     console.log('data 1 ' + JSON.stringify(data))

            //     console.log('data 2 ' + JSON.stringify(data))
            //     onClose();
            //     message.success(msg.msg);
            //     return;
            // } else {
            //     message.error(msg.msg);
            // }

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

    const addCandidate = async (values: any) => {
        try {
            values['dob'] = convertDate(values['dob']);

            const staticParams = {
                candidateID: user?.verifiedUser?.userID,
                profileImage: "",
                userID: "2",
                formID: 2,
                type: 2,
                otp: "4374",
                emailID: "eeemail@gmail.com",
                mobileNo: "9999999999",
                candPassword: "string",
                panNo: "pppppppppp",
                aadhaarNo: "787878787770",
                maritalStatusID: "1",
                genderID: "1",
                candidateAddress: "string",
                instUiqueID: "88",
                branchID: "1",
                otherBranchName: "string",
                instName: "string",
                instAddress: "string",
                stateID: "1",
                districtID: "1",
                cityID: "1",
                areaID: "1",
                landmark: "landmark",
                sessionName: "",

            };

            setLoading(true)
            const msg = await requestAddCandidate({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                formRef.current?.resetFields();
                message.success(msg.msg);
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
    const getCandidateList = async () => {
        try {
            const params = {
                "onlinePatientID": user?.verifiedUser?.userID,
                "userID": -1,
                "formID": -1,
                "type": 1
            }

            setLoading(true)
            const msg = await requestGetCandidateList(params);
            setSelectedRows(msg.result[0])
            console.log(msg.result[0])
            setLoading(false)
            if (msg.isSuccess === true) {
                formRef.current?.resetFields();
                message.success(msg.msg);
                return;
            } else {
                message.error(msg);
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

    const reloadTable = () => {
        // actionRef.current.reload();
    }
    const editInformation = () => {
        return (
            <>
                {datatype === 'InstituteUser' &&
                    <>
                        <StepsForm
                            formRef={formRef}
                            onFinish={async (values) => {
                                handleSubmit(values)
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
                                                initialValue={data?.fName}
                                                name="firstName"
                                                label="First Name"
                                                rules={[{ required: true, message: 'Please enter First Name' }]}
                                            >
                                                <Input placeholder="Please enter First Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={data?.mName}
                                                name="middleName"
                                                label="Middle Name"
                                                rules={[{ required: false, message: 'Please enter Middle Name' }]}
                                            >
                                                <Input placeholder="Please enter Middle Name" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={data?.sName}
                                                name="surName"
                                                label="SurName"
                                                rules={[{ required: false, message: 'Please enter Surname' }]}
                                            >
                                                <Input maxLength={11} placeholder="Please enter Surname" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={8}>
                                            <Form.Item
                                                initialValue={dayjs(data?.dob, 'YYYY/MM/DD')}
                                                name="dob"
                                                label="Date of Birth"
                                                rules={[{ required: true, message: 'Please choose the Date of Birth' }]}
                                            >
                                                <DatePicker
                                                    defaultValue={dayjs(data?.dob, 'YYYY/MM/DD')}
                                                    style={{ width: '100%' }}
                                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>


                                </div>
                            </StepsForm.StepForm>
                        </StepsForm>
                    </>
                }
                
                {datatype === 'Admin' &&
                    <>
                        <ProDescriptions
                            dataSource={data}
                            bordered={true}
                            size={'small'}
                            columns={[
                                {
                                    title: 'First Name',
                                    dataIndex: 'firstName',
                                    span: 3
                                },
                                {
                                    title: 'Middle Name',
                                    dataIndex: 'middleName',
                                    span: 3
                                },

                                {
                                    title: 'Sur Name',
                                    dataIndex: 'surName',
                                    span: 3
                                },
                                {
                                    title: 'Date of Birth',
                                    key: 'dob',
                                    dataIndex: 'dob',
                                    valueType: 'date',
                                    fieldProps: {
                                        format: 'DD-MM-YYYY',
                                    },
                                },
                            ]}
                        />
                    </>
                }
            </>
        )
    }

    const updateProfileImage = () => {
        return (
            <>

            </>
        )
    }


    return (
        <PageContainer
            header={{
                title: `Update Profile`,
            }}
        >
            <Card>
                <Tabs
                    tabPosition={'top'}
                    items={initialTabItems}
                    onChange={(activeKey) => setActiveTab(activeKey)}
                />
                <div style={{ marginTop: 30 }}>
                    {activeTab === "1" && <UpdateProfileImage />}
                    {activeTab === "2" && editInformation()}
                    {activeTab === "3" && <UpdateDocsUpload />}
                </div>
            </Card>

        </PageContainer>
    );
};

export default UserProfile;