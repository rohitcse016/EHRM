import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvUnit } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';


const { Option } = Select;


const AddInvUnit = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
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

    const addInvUnit = async (values: any) => {
        console.log(values);
        try {
            const staticParams = {
                // "invUnitID": "string",
                // "invUnitName": "string",
                // "invUnitCode": "string",
                // "invUnitType": "string",
                "isActive": true,
                "formID": -1,
                "type": 1

            };

            setLoading(true)
            const msg = await requestAddInvUnit({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === "True") {
                form.resetFields();
                onClose();
                message.success(msg.msg);
                onSaveSuccess(msg);
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
                onFinish={addInvUnit}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                            <Form.Item
                                name="invUnitID"
                                label="Investigation unit id"
                                rules={[{ required: true, message: 'Please enter investigation unit id' }]}
                            // initialValue={institute}
                            >
                                <Input style={{height: 40,fontSize:16}} placeholder="Please enter investigation unit id" />
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                            <Form.Item
                                name="invUnitType"
                                label="Investigation unit Type"
                                rules={[{ required: true, message: 'Please select investigation type' }]}
                            >
                                <Select
                                    size={'large'}
                                    placeholder="Complaint Type"
                                    optionFilterProp="children"
                                    options={diseaseType}
                                />
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                            <Form.Item
                                name="invUnitCode"
                                label="investigation unit code *"
                                rules={[{ required: true, message: 'Please enter investigation code' }]}
                            >
                                <Input size={'large'} placeholder="Please enter investigation code" />
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                            <Form.Item
                                name="invUnitName"
                                label="investigation unit name *"
                                rules={[{ required: true, message: 'Please enter investigation unit name' }]}
                            >
                                <Input size={'large'} placeholder="Please enter investigation unit name" />
                            </Form.Item>
                        </Col>
                            
                        </Row>
                        <Col style={{justifyContent:'flex-end'}}>
                            <Button size={'large'}  type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button  onClick={goBack}
                                size={'large'}
                                style={{marginLeft:10}} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>
                </>
            </Form>
        )
    }

    return (
        <PageContainer style={{backgroundColor:'#4874dc',height: 120, }}>
            <Card
                style={{ height: '100%', width: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                title="Create a new disease master"
                bodyStyle={{ paddingBottom: 80 }}
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

export default AddInvUnit;