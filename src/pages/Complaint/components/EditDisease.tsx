import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';


const { Option } = Select;


const EditDisease = ({ visible,  selectedRows}: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([{ value: "1", label: "Type 1" }])
    const [rateType, setRateType] = useState<any>([])
    const [institute, setInstitute] = useState<any>([])


    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        //getComplaintType();
    }, [])

    const getComplaintType = async () => {
        const res = await requestGetRoomType({});
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.roomTypeID, label: item.roomTypeName }
            })
            setDiseaseType(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const addDisease = async (values: any) => {
        console.log(values);
        try {
            const staticParams = {
                // "diseaseTypeID": "string",
                // "diseaseTypeName": "string",
                // "diseaseTypeCode": "string",
                // "specialTypeID": "string",
                "sortOrder": 1,
                "diseasesID": "-1",
                "isActive": "1",
                "formID": -1,
                "type": 1

            };

            setLoading(true)
            const msg = await requestAddDisease({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                form.resetFields();
                message.success(msg.msg);
                // onSaveSuccess(msg);
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


    const addForm = () => {
        return (
            <Form
                layout="vertical"
                // hideRequiredMark
                form={form}
                onFinish={addDisease}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                            <Form.Item
                                initialValue={selectedRows?.diseaseTypeName}
                                name="diseaseTypeName"
                                label="Disease name"
                                rules={[{ required: true, message: 'Please enter disease name' }]}
                            >
                                <Input size={'large'} placeholder="Please enter disease type name" />
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="diseaseTypeID"
                                label="Disease Type"
                                rules={[{ required: true, message: 'Please select disease type' }]}
                            >
                                <Select
                                    size={'large'} 
                                    placeholder="Complaint Type"
                                    optionFilterProp="children"
                                    options={diseaseType}
                                />
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="diseaseTypeCode"
                                label="Disease code"
                                rules={[{ required: true, message: 'Please enter disease code' }]}
                            >
                                <Input size={'large'} placeholder="Please enter disease code" />
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="specialTypeID"
                                label="Special type"
                                rules={[{message: 'Please enter special type' }]}
                            >
                                <Input size={'large'} placeholder="Please enter special type" />
                            </Form.Item>
                        </Col>
                            
                        </Row>
                        <Col style={{justifyContent:'flex-end'}}>
                            <Button style={{padding:5,width:100,height:40}}  type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button  onClick={goBack}
                                style={{marginLeft:10, padding:5,width:100,height:40}} type="default" >
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
            <Card
                style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                title="Create a new disease master"
                extra={[
                    <Button key="rest" onClick={() => {
                        history.push("/complaints/DiseaseList")
                    }}
                    >List</Button>,
                ]}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {addForm()}
                    </div>
                </Spin>
            </Card>
        </PageContainer>
    );
};

export default EditDisease;