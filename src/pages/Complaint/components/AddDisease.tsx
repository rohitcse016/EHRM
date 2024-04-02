import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, Divider, Modal, Upload } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestDiseaseList, requestDiseaseTypeList, requestSpecialList } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import DiseaseList from './DiseaseList';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { RcFile } from 'antd/es/upload';


const { Option } = Select;


const AddDisease = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [capacity, setCapacity] = useState(1);
    const [form] = Form.useForm();
    const [typeForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([])
    const [isActive, setIsActive] = useState(true);
    const [specialList, setSpecialist] = useState([]);
    const [data, setData] = useState([]);
    const [diseaseID, setDiseaseID] = useState("-1");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [diseaseDoc, addDiseaseDoc] = useState<any>("");



    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getSpecialType();
        getDiseaseType();
    }, [])

    const getSpecialType = async () => {
        const res = await requestSpecialList({});
        // console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.diseaseTypeID, label: item.diseaseTypeName }
            })
            setSpecialist(dataMaskForDropdown)
            form.setFieldsValue({
                specialTypeID: "1"
            })
        }
    }
    const getDiseaseType = async () => {
        const params = {
            "diseaseTypeID": -1,
            "specialTypeID": -1,
            "isActive": -1,
            "type": 1
        }
        const res = await requestDiseaseTypeList(params);
        console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: number) => {
                return { value: item.diseaseTypeID, label: item.diseaseTypeName }
            })
            setDiseaseType(dataMaskForDropdown)
            // console.log(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const addDisease = async (values: any, type: number = 1) => {
        console.log(diseaseDoc)
        values['isActive'] = values.isActive.toString();
        // values['diseaseTypeID'] = values.diseaseTypeID ? values.diseaseTypeID.toString() : "-1";
        try {
            const staticParams = {
                // "diseaseTypeID": values['diseaseTypeID'] ? values['diseaseTypeID'] : "-1",
                // "diseaseTypeName": "string",
                // "diseaseTypeCode": " string",
                "specialTypeID": "1",
                // "isActive": isActive.toString(),
                "sortOrder": 1,
                "diseasesID": diseaseID,
                "diseasesImage": diseaseDoc?.docBase64,
                "formID": -1,
                "type": type

            };
            console.log(values, staticParams)
            setLoading(true)
            const msg = await requestAddDisease({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                message.success(msg.msg);
                setDiseaseID("-1")
                setIsModalOpen(false);
                getDiseaseType();
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
    const onChange = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isActive: e.target.checked
        })
        setIsActive(e.target.checked)
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const onUpload = (info: any) => {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as RcFile, async (url) => {
                // console.log(url, info.file.name)
                addDiseaseDoc({ docBase64: url, docName: info.file.name })
            })
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }

    }

    const setEditField = (data: any) => {
        form.setFieldsValue({
            diseaseTypeName: data?.diseaseName,
            diseaseTypeCode: data?.diseaseCodeICD,
            diseaseTypeID: data?.diseaseTypeID,
            specialTypeID: data?.specialTypeID,
            isActive: data?.isActive,
        })
        window.scrollTo(0, 0)
        setDiseaseID(data?.diseaseID)
    };
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());//.toLowerCase()
    const addForm = () => {
        return (
            <Form
                layout="vertical"
                // hideRequiredMark
                form={form}
                onFinish={(values) => addDisease(values, 2)}
                initialValues={{
                    isActive: true
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="diseaseTypeName"
                                    label="Disease name"
                                    rules={[{ required: true, message: 'Please enter disease name' }]}
                                // initialValue={institute}
                                >
                                    <Input size={'large'} placeholder="Please enter disease type name" />
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
                                    name="diseaseTypeID"
                                    label="Disease type"
                                    rules={[{ required: true, message: 'Please select disease type' }]}
                                >
                                    <Select
                                        showSearch
                                        filterOption={filterOption}
                                        size={'large'}
                                        placeholder="Select Disease Type"
                                        options={diseaseType}
                                        dropdownRender={(menu) => (
                                            <>
                                                <Space style={{ padding: 4 }}>
                                                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                                                        Add New
                                                    </Button>
                                                </Space>
                                                <Divider style={{ margin: '8px 0' }} />
                                                {menu}
                                            </>
                                        )}
                                    />

                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="diseasesImage"
                                    label="Select Image"
                                    rules={[{ required: false, message: 'Please Select Image' }]}
                                >
                                    <Upload
                                        onChange={onUpload}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>

                        </Row>
                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="isActive"
                                valuePropName="checked"
                                //initialValue={true}
                                // rules={[{ required: false, message: 'Please select isActive' }]}
                                label=""
                                rules={[{ required: false, message: 'Please select' }]}
                            >
                                <Checkbox>isActive</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={goBack}
                                style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>
                    <Modal
                        title="Add new Disease Type"
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={[
                        ]}>
                        <Form
                            onFinish={(v) => addDisease(v = { isActive: true, diseaseTypeID: '-1', ...v }, 1)}>

                            <Form.Item
                                name="diseaseTypeName"
                                label="Disease Type Name"
                                rules={[{ required: true, message: 'Please enter disease code' }]}
                            >
                                <Input size={'large'} placeholder="Please enter disease code" />
                            </Form.Item>
                            <Form.Item
                                name="DiseaseTypeCode"
                                label="Disease Type Code"
                                rules={[{ required: true, message: 'Please enter disease code' }]}
                            >
                                <Input size={'large'} placeholder="Please enter disease code" />
                            </Form.Item>
                            <Form.Item
                                name="specialTypeID"
                                label="Special type"
                                rules={[{ required: true, message: 'Please enter special type' }]}
                            >
                                <Select
                                    showSearch
                                    size={'large'}
                                    placeholder="Select Special Type"
                                    options={specialList}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button style={{ marginLeft: 10 }} onClick={handleCancel}
                                type="default" >
                                Cancel
                            </Button>
                        </Form>
                    </Modal>
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
                    title="Create a new disease master"
                // extra={[
                //     <Button key="rest" onClick={() => {
                //         history.push("/complaints/DiseaseList")
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
                <DiseaseList
                    refresh={loading}
                    editRecord={(data: any) => setEditField(data)} />
            </Space>
        </PageContainer>
    );
};

export default AddDisease;