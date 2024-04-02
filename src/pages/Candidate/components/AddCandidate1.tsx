import React, { useEffect, useRef, useState } from 'react';
import '../styles/addCandidate.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme } from 'antd';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProColumns,
    ProDescriptions,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
const { Option } = Select;

const steps = [
    {
        title: 'Basic Information',
        content: 'First-content',
    },
    {
        title: 'Second',
        content: 'Second-content',
    },
    {
        title: 'Last',
        content: 'Third-content',
    },
];

const AddCandidate = ({ visible, onClose }: any) => {
    console.log({ visible })

    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };


    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        marginTop: 60,
        height: 350
    };


    const addCandidate = (values: any) => {
        console.log('Success:', values);
        const staticParams = {
            "candidateID": "-1",
            "sessionName": "",
            "profileImage": "",
            "userID": "2",
            "formID": 2,
            "type": 1,
            "otp": "4376"
        }
    }

    const addForm = (steps: any) => {
        return (
            <Form
                layout="vertical"
                hideRequiredMark
                form={form}
                onFinish={addCandidate}
            >
                {/* Basic Information */}
                {steps[current].content === "First-content" ?
                    <>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: false, message: 'Please enter First Name' }]}
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
                                    rules={[{ required: false, message: 'Please enter Last Name' }]}
                                >
                                    <Input placeholder="Please enter Last Name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="candPassword"
                                    label="candPassword"
                                    rules={[{ required: false, message: 'Please enter candPassword' }]}
                                >
                                    <Input placeholder="Please enter candPassword" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="mobileNo"
                                    label="mobileNo"
                                    rules={[{ required: false, message: 'Please enter mobileNo' }]}
                                >
                                    <Input placeholder="Please enter mobileNo" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="emailID"
                                    label="emailID"
                                    rules={[{ required: false, message: 'Please enter emailID' }]}
                                >
                                    <Input placeholder="Please enter emailID" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="dob"
                                    label="dob"
                                    rules={[{ required: false, message: 'Please choose the dob' }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="panNo"
                                    label="panNo"
                                    rules={[{ required: false, message: 'Please enter panNo' }]}
                                >
                                    <Input placeholder="Please enter panNo" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="aadhaarNo"
                                    label="aadhaarNo"
                                    rules={[{ required: false, message: 'Please enter aadhaarNo' }]}
                                >
                                    <Input placeholder="Please enter aadhaarNo" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="maritalStatusID"
                                    label="maritalStatusID"
                                    rules={[{ required: false, message: 'Please select an maritalStatusID' }]}
                                >
                                    <Select placeholder="Please select an owner">
                                        <Option value="3">Single</Option>
                                        <Option value="3">Married</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="genderID"
                                    label="genderID"
                                    rules={[{ required: false, message: 'Please choose the genderID' }]}
                                >
                                    <Select placeholder="Please choose the genderID">
                                        <Option value="1">Male</Option>
                                        <Option value="1">Female</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="instUiqueID"
                                    label="instUiqueID"
                                    rules={[{ required: false, message: 'Please enter instUiqueID' }]}
                                >
                                    <Input placeholder="Please enter instUiqueID" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                    : null}



                {steps[current].content === "Second-content" ?
                    <>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="branchID"
                                    label="branchID"
                                    rules={[{ required: false, message: 'Please enter branchID' }]}
                                >
                                    <Input placeholder="Please enter branchID" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="otherBranchName"
                                    label="otherBranchName"
                                    rules={[{ required: false, message: 'Please enter otherBranchName' }]}
                                >
                                    <Input placeholder="Please enter otherBranchName" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="instName"
                                    label="instName"
                                    rules={[{ required: false, message: 'Please enter instName' }]}
                                >
                                    <Input placeholder="Please enter instName" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </> : null}

                {steps[current].content === "Third-content" ?
                    <>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="instAddress"
                                    label="instAddress"
                                    rules={[{ required: false, message: 'Please enter instAddress' }]}
                                >
                                    <Input placeholder="Please enter instAddress" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="stateID"
                                    label="stateID"
                                    rules={[{ required: false, message: 'Please choose the stateID' }]}
                                >
                                    <Select placeholder="Please choose the stateID">
                                        <Option value="1">stateID1</Option>
                                        <Option value="1">stateID2</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="districtID"
                                    label="districtID"
                                    rules={[{ required: false, message: 'Please choose the districtID' }]}
                                >
                                    <Select placeholder="Please choose the districtID">
                                        <Option value="1">districtID</Option>
                                        <Option value="1">districtID2</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="cityID"
                                    label="cityID"
                                    rules={[{ required: false, message: 'Please choose the cityID' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Search to cityID"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={[
                                            {
                                                value: '1',
                                                label: 'Not Identified',
                                            },
                                            {
                                                value: '2',
                                                label: 'Closed',
                                            },
                                            {
                                                value: '3',
                                                label: 'Communicated',
                                            },
                                            {
                                                value: '4',
                                                label: 'Identified',
                                            },
                                            {
                                                value: '5',
                                                label: 'Resolved',
                                            },
                                            {
                                                value: '6',
                                                label: 'Cancelled',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="areaID"
                                    label="areaID"
                                    rules={[{ required: false, message: 'Please choose the areaID' }]}
                                >
                                    <Select placeholder="Please choose the areaID">
                                        <Option value="1">areaID</Option>
                                        <Option value="1">areaID</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="landmark"
                                    label="landmark"
                                    rules={[{ required: false, message: 'Please enter landmark' }]}
                                >
                                    <Input placeholder="Please enter landmark" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="sessionName"
                                    label="sessionName"
                                    rules={[{ required: false, message: 'Please enter sessionName' }]}
                                >
                                    <Input placeholder="Please enter sessionName" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </> : null}

                <div style={{ marginTop: 24 }}>
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                            Done
                        </Button>
                    )}
                </div>
            </Form>
        )
    }

    return (
        <>
            <Drawer
                title="Create a new AddCandidate"
                width={1000}
                onClose={onClose}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={addCandidate} type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <>
                    <div style={{ marginTop: 20 }}>
                        <Steps current={current} items={items} />
                    </div>

                    <div style={contentStyle}>
                        {addForm(steps)}
                    </div>


                </>

            </Drawer>
        </>
    );
};

export default AddCandidate;