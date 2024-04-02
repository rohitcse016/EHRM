import React, { useEffect, useRef, useState } from 'react';
import './styles/AddComplaint.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, InputNumber } from 'antd';
import { requestGetComplaintType, requestGetRateType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import ComplaintList from './ComplaintList';
import { CheckboxChangeEvent } from 'antd/es/checkbox';



const { Option } = Select;


const AddComplaint = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [complaintType, setComplaintType] = useState<any>([{ value: "1", label: "Type 1" }])
    const [complaintTypeID, setComplaintTypeID] = useState<any>("-1")
    const [rateType, setRateType] = useState<any>([])
    const [institute, setInstitute] = useState<any>([])
    const [isActive, setIsActive] = useState(true);



    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getComplaintType();
        // getRateType();
    }, [])

    const getComplaintType = async () => {
        const staticParams = {
            "complaintTypeID": "-1",
            "isActive": "1",
            "type": "1"
        }
        const res = await requestGetComplaintType(staticParams);
        // console.log(res.result);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.complaintTypeID, label: item.complaintTypeName }
            })
            setComplaintType(dataMaskForDropdown)
            // console.log(dataMaskForDropdown)
        }
    }

    const getRateType = async () => {
        const res = await requestGetRateType({});
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { label: item.rateTypeName, value: item.rateTypeID }
            })
            setRateType(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }


    const addComplaint = async (values: any) => {
        console.log(values);
        values['isActive'] = values.isActive.toString();
        try {
            const staticParams = {
                "complaintTypeID": complaintTypeID,
                // "complaintTypeName": "",
                // "complaintTypeCode": "1", 
                // "isActive": "1",
                "sortOrder": "",
                "formID": -1,
                "type": 1,
            };

            setLoading(true)
            const msg = await requestAddComplaint({ ...values, ...staticParams });
            console.log(msg.msg, msg.isSuccess);
            setLoading(false)
            if (msg.isSuccess === true) {
                message.success(msg.msg);
                form.resetFields();
                setComplaintTypeID("-1")
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

    const onChangeServiceStatus = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isService: e.target.checked ? "true" : "false"
        })
        setIsActive(e.target.checked)
        // setVatApplicable(e.target.checked)

    };
    const setEditField = (data:any) => {
        form.setFieldsValue({
            complaintTypeName:data?.complaintTypeName,
            complaintTypeID:data?.complaintTypeID,
            complaintTypeCode:data?.complaintTypeCode,
            isActive:data?.isActive=="true" ? true : false,
        })
        window.scrollTo(0, 0)
        setComplaintTypeID(data?.complaintTypeID)
    };

    const addForm = () => {
        return (
            <Form
                ref={formRef}
                layout="vertical"
                form={form}
                onFinish={addComplaint}
                initialValues={{
                }}
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}  >
                                <Form.Item
                                    // required={true}
                                    name="complaintTypeName"
                                    label="Complaint Name"
                                    rules={[{ required: true, message: 'Please enter complaint name' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter complaint name" />
                                </Form.Item>
                            </Col>
                            {/* <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="complaintTypeID"
                                    label="Complaint Type ID"
                                    rules={[{ required: true, message: 'Please enter complaint typeId' }]}>
                                    <Input  maxLength={4} size={'large'}  placeholder="Please enter complaint typeId" />
                                </Form.Item>
                            </Col> */}
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="complaintTypeCode"
                                    label="Complaint Code"
                                    rules={[{ required: true, message: 'Please enter complaint code' }]}
                                >
                                    <Input size={'large'} placeholder="Please enter complaint code" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Col className="gutter-row" span={2}>
                            <Form.Item
                                name="isActive"
                                // label="Is this a service"
                                rules={[{ required: true, message: 'Please check' }]}
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Checkbox >IsActive</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={goBack} style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>

                </>
            </Form>
        )
    }

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                    title="Create a New Complaint"
                // extra={[
                //     <Button key="rest" onClick={() => {
                //         history.push("/complaints/list")
                //     }}
                //     >List</Button>,
                // ]}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>
                <ComplaintList refresh={loading}
                    editRecord={(data:any)=>setEditField(data)} />
            </Space>
        </PageContainer>
    );
};

export default AddComplaint;