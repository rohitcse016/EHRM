import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, EditOutlined, EyeOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, Divider, Modal, Upload, Table, Tag, Switch } from 'antd';
import { PageContainer, ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { requestAddCaste, requestAddDepartment, requestAddState, requestGetCasteList, requestGetDepartmentList, requestGetStateList } from './services/api';
import { SearchProps } from 'antd/es/input';


const { Option } = Select;
const { Search } = Input;


const AddState = ({ visible, onClose, onSaveSuccess, selectedRows, instituteId }: any) => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const actionRef = useRef<any>();
    const [loading, setLoading] = useState(false)
    const [isActive, setIsActive] = useState(true);
    const [view, setView] = useState([]);
    const [stateID, setStateID] = useState("-1");
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);



    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        // getSpecialType();
        // getDiseaseType();
    }, [])

    const goBack = () => {
        history.push("/")
    }

    const AddState = async (values: any, type: number = 1) => {
        // values['isActive'] = values.isActive.toString();
        // values['diseaseTypeID'] = values.diseaseTypeID ? values.diseaseTypeID.toString() : "-1";
        try {
            const staticParams = {
                "stateID": stateID ,
                // "stateName": "",
                // "stateCode": "",
                "isActive": values.isActive,
                "userID": -1,
                "formID": -1,
                "type": stateID == "-1" ? 1 : 2

            };
            console.log(values, type, view)
            setLoading(true)
            const msg = await requestAddState({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                message.success(msg.msg);
                setStateID("-1")
                setIsModalOpen(false);
                reloadTable()
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
        setView([])
        setStateID("-1")
        setIsModalOpen(false);
    };
    const setEditField = (data: any) => {
        setStateID(data.stateID)
        showModal()
        form.setFieldsValue({
            stateName: data?.stateName,
            stateCode: data?.stateCode,
            isActive: data?.isActive,
            stateID: data?.stateID
        })
        // window.scrollTo(0, 0)
        // setDiseaseID(data?.diseaseID)
    };
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());//.toLowerCase()
    const onSearch: SearchProps['onSearch'] = (value, record) => {
        const currValue = value;
        const filteredData = data.filter((entry: any) =>
            entry.deptName.includes(currValue)
        );
        console.log(filteredData)
        setData(filteredData);
    }

    const reloadTable = () => {
        actionRef.current.reload();
    }
    const addForm = () => {
        return (
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                // onOk={handleCancel}
                // okText= 'Save'
                footer=""
            >
                {view.length>0 ?
                    <ProDescriptions
                        dataSource={view}
                        bordered={true}
                        size={'small'}
                        columns={[
                            {
                                title: 'State Name',
                                dataIndex: 'stateName',
                                span: 3
                            },
                            {
                                title: 'State Code',
                                dataIndex: 'stateCode',
                                span: 3
                            },
                            {
                                title: 'isActive',
                                dataIndex: 'isActive',
                                span: 3
                            },
                        ]}
                    />
                    :
                    <Form
                        layout="vertical"
                        // hideRequiredMark
                        form={form}
                        onFinish={(values) => AddState({...values,stateID:stateID})}
                        initialValues={{
                            isActive: true
                        }}
                    >
                        {/* Basic Information */}
                        <>
                            <div className="gutter-example">
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={12}>
                                        <Form.Item
                                            name="stateName"
                                            label="State Name"
                                            rules={[{ required: true, message: 'Please Enter State' }]}
                                        // initialValue={institute}
                                        >
                                            <Input size={'large'} placeholder="Please Enter State" />
                                        </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        <Form.Item
                                            name="stateCode"
                                            label="State code"
                                            rules={[{ required: true, message: 'Please Enter State Code' }]}
                                        >
                                            <Input size={'large'} placeholder="Please Enter State Code" />
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
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                    <Button
                                        danger
                                        onClick={handleCancel}
                                        style={{ marginLeft: 10, }} type="default" >
                                        Cancel
                                    </Button>
                                </Col>
                            </div>
                        </>
                    </Form>
                }

            </Modal>
        )
    }
    const columns: ProColumns<API.RuleListItem>[] = [
        {
            title: 'State Name',
            dataIndex: 'stateName',
        },
        {
            title: 'State Code',
            dataIndex: 'stateCode',
        },
        {
            title: 'isActive',
            dataIndex: 'isActive',
            render: (_: any, record: any) => <div>
                <Switch size='small' checked={record?.isActive} 
                onChange={(v) => AddState({ ...record, isActive: v }, 2)} />
                <Tag icon={<CheckCircleOutlined />} color={record?.isActive == true ? 'success' : 'error'}>
                    {record?.isActive == true ? 'Active' : 'InActive'}
                </Tag>
            </div>
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" size={"small"} onClick={() => setEditField(record)} icon={<EyeOutlined />} />
                    <Button type="primary" size={"small"} onClick={() => setEditField(record)} icon={<EditOutlined />} />
                    {/* <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} /> */}
                </Space>
            ),
        },
    ];

    return (
        <PageContainer
            title=" "
            style={{}}>
            {/* <Space direction="vertical" size="middle" style={{ display: 'flex' }}> */}
            {addForm()}
            <Row style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#dae1f3',
                paddingInline: 10,
                padding: 10,
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5
            }}>
                <Col>
                    <Row>
                        {/* <Typography style={{ fontSize: 28 }}>{"Employees"}</Typography> */}
                        <Search placeholder="search text" onSearch={(e) => onSearch(e, data)} enterButton={
                            <Button style={{ backgroundColor: '#3f51b5' }} icon={<SearchOutlined style={{ color: 'white' }} />} />
                        } ></Search>
                    </Row>
                </Col>
                <Col>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            style={{ borderRadius: 48, backgroundColor: '#3f51b5', width: '48px', height: '48px' }}
                            onClick={showModal}
                            icon={<PlusOutlined style={{ color: 'white' }} />}
                        />,
                        <Button onClick={reloadTable} style={{ borderRadius: 48, backgroundColor: '#3f51b5', width: '48px', height: '48px' }}
                            icon={<ReloadOutlined style={{ color: 'white' }} />} ></Button>
                    </div>
                </Col>
            </Row>
            <ProTable<API.RuleListItem, API.PageParams>
                actionRef={actionRef}
                rowKey="key"
                search={false}
                request={async (
                ) => {
                    const params = {
                        "stateID": "-1",
                        "userID": "-1",
                        "formID": "-1",
                        "type": "1"
                    }
                    const res = await requestGetStateList(params);
                    setData(res?.result)
                    return Promise.resolve({
                        data: res.result,
                        success: true,
                    });
                }}
                columns={columns}
                toolbar={{ settings: [] }}
            />
        </PageContainer>
    );
};

export default AddState;