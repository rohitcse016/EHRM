import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, FilterOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Typography, Form, Input, Row, Select, Space, message, theme, Card, Radio, Modal, Tabs, TabsProps, InputNumber, Spin, Checkbox, CheckboxProps } from 'antd';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PatientFilter from '@/components/Filters/PatientFilter';
import { RadioChangeEvent } from 'antd/lib';
import { getUserInLocalStorage, getUserType } from '@/utils/common';
import { requestAddPatRequest } from '@/pages/Booking/services/api';
import moment from 'moment';
import { requestGetPatientSearch } from '@/pages/Patient/services/api';
import { dateFormat } from '@/utils/constant';
import { requestGetPatientDailyCount, requestGetPatientSearchOPIP } from '../services/api';
import AddUpdatePatientCase from './AddUpdatePatientCase';
import { requestGetSection, requestGetUserList, requestVPreEmpType } from '@/services/apiRequest/dropdowns';
import dayjs from 'dayjs';
import '../services/styles.css'

const { Option } = Select;
const { Title, Text } = Typography;



const options = [
    { label: 'New Visit', value: 1 },
    { label: 'Follow Up Visit', value: 2 },
    { label: 'Visit Status Update', value: 3 },
];



const ReceptionSearch = React.forwardRef((props) => {
    const [filterForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [loadingCheckin, setLoadingCheckin] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [preEmpType, setGetVPreEmpType] = useState([]);
    const [value1, setValue1] = useState('New Visit');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientDailyCount, setPatientDailyCount] = useState({});
    const [selectedType, setSelectedType] = useState(1);
    const [patientCheckInData, setPatientCheckInData] = useState({});
    const [selectedPreEmpType, setSelectedPreEmpType] = useState(-1);
    const [selectedPreEmpTypeError, setSelectedPreEmpTypeError] = useState(false);
    const [selectedPatientData, setSelectedPatientData] = useState({});
    const [selectedTab, setSelectedTab] = useState('1');
    const [isDateFilterMandatory, setIsDateFilterMandatory] = useState(true);
    const [sections, setSections] = useState<any>([])
    const [doctorList, setDoctorList] = useState<any>([{ value: -1, label: "All" }])


    const onChange = (key: string) => {
        setSelectedTab(key)
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'General',
            children: '',
        },
        {
            key: '2',
            label: 'Allergic',
            children: '',
        },
        {
            key: '3',
            label: 'Battery Service',
            children: '',
        },
    ];

    const columns: ColumnsType<any> = [
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
            render: (text) => <a>{text}</a>,
            fixed: 'left',
        },
        {
            title: 'Name',
            dataIndex: 'candName',
            key: 'candName',
            fixed: 'left',
            width:'20%',
            render: (_, record) => <Row style={{justifyContent:'space-between'}}>
                <Typography>{record?.candName}</Typography>
                {record?.isVIP &&<Tag color={"green"}>{"Vip" }</Tag>}
            </Row>,
        },
        {
            title: 'Case No',
            dataIndex: 'patientCaseNo',
            key: 'patientCaseNo',
        },
        // {
        //     title: 'PreEmp Type',
        //     dataIndex: 'vPreEmpType',
        //     render: (text) => <a>{text}</a>,
        //     key: 'vPreEmpType',
        // },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Gender',
            dataIndex: 'genderName',
            key: 'genderName',
        },
        {
            title: 'Blood Group',
            dataIndex: 'bloodGroup',
            key: 'bloodGroup',
        },
        {
            title: 'Mobile No',
            dataIndex: 'curMobileNo',
            key: 'curMobileNo',
        },
        // {
        //     title: 'Email',
        //     dataIndex: 'email',
        //     key: 'email',
        // },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">

                    <Button size={'small'} type='primary' onClick={() => {
                        if (selectedPreEmpType !== -1 || selectedType !== 1) {
                            setSelectedPreEmpTypeError(false)
                            patientCheckIn(record)
                        } else {
                            setSelectedPreEmpTypeError(true)
                        }
                    }}>
                        Check In
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getVPreEmpType();
        getPatientDailyCount();
        getSectionList();
        filterForm.setFieldsValue({
            fromToDate: [dayjs(moment(), dateFormat), dayjs(moment(), dateFormat)],
            patientPhoneNo: '',
            fromDate: '1900-11-21T12:47:26.406Z',
            toDate: '2023-12-21T12:47:26.406Z',
            patientCaseID: -1,
            patientCaseNo: '',
            patientID: -1,
            patientNo: '',
            patientUIDNo: '',
            caseTypeID: -1,
            sectionID: -1,
            consultantDocID: -1,
            patientFileNo: '',
            patientName: '',
            patientMobile: '',
            patientPhone: '',
            userID: -1,
            formID: -1,
            type: 1,
            preEmpTypeID: -1
        })
    }, [])

    useEffect(() => {
        console.log("doctorList->", { doctorList })
    }, [doctorList])

    const onSelectPreEmp = (value: any) => {
        setSelectedPreEmpType(value)
        setSelectedPreEmpTypeError(false)
    }

    const patientCheckIn = async (patientData: any) => {
        setSelectedPatientData(patientData)
        const params = {
            patientCaseID: patientData?.patientCaseID,
            patientCaseNo: '',
            patientID: patientData?.patientID,
            patientNo: '',
            patientUIDNo: '',
            caseTypeID: -1,
            sectionID: -1,
            consultantDocID: -1,
            patientFileNo: '',
            patientName: '',
            patientMobile: '',
            patientPhone: '',
            fromDate: '2022-12-14T11:47:55.610Z',
            toDate: '2023-12-14T11:47:55.610Z',
            userID: -1,
            formID: -1,
            type: 6,
            preEmpTypeID: selectedPreEmpType
        }
        console.log({ params });
        console.log({ selectedType, patientData })
        if (selectedType === 2 || selectedType === 3) {
            setSelectedPreEmpType(patientData?.vPreEmpType)
        }
        setLoadingCheckin(true)
        const response = await requestGetPatientSearchOPIP(params);
        setLoadingCheckin(false)
        setPatientCheckInData(response)


        if (!response?.isSuccess) {
            message.error(response?.msg);
        }

        showModal()
    }

    const getSectionList = async () => {
        const params = {
            "sectionID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetSection(params);

        if (res.result.length > 0) {

            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.sectionID, label: item.sectionName }
            });
            dataMaskForDropdown.unshift({ value: -1, label: "All" });
            setSections(dataMaskForDropdown)
        }
    }

    const getDoctorList = async (value: any, item: any) => {
        const params = {
            "CommonID": item.value,
            "Type": 3,
        }

        const res = await requestGetUserList(params);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.userID, label: item.userName }
            })
            console.log({ doctorList })
            const doc = [...doctorList, ...dataMaskForDropdown]
            console.log({ doc })
            setDoctorList(doc)
        }
    }

    const getPatientDailyCount = async () => {
        try {
            setLoading(true)
            const staticParams = {
                curDate: moment().format(dateFormat),
                cntTypeID: -1,
                userID: -1,
                formID: -1,
                type: 1
            }
            const response = await requestGetPatientDailyCount({ ...staticParams });
            setLoading(false)
            setPatientDailyCount(response?.result?.[0])

            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const patientSearch = () => {
        return (
            <>
                {selectedType === 1 ? <>
                    <Title level={5}>Case Type</Title>
                    <Select
                        label="Preemp Type"
                        size={'middle'}
                        placeholder="Case Type"
                        style={{ width: 300, marginTop: -10 }}
                        options={preEmpType}
                        onChange={data => onSelectPreEmp(data)}
                    />
                    <br />
                    {selectedPreEmpTypeError ? <Text style={{ marginTop: 20 }} type="danger">Selection required</Text> : null}

                </> : null}


                <div style={{ marginTop: 10 }}> <Table
                // rowClassName={(record, index) => record.isVIP=== true ?  'table-row-dark': 'table-row-light'}

                size='small' scroll={{ x: 1000 }} columns={columns} dataSource={list} /></div>
            </>
        )
    }

    const getVPreEmpType = async () => {
        const params = {
        }
        const res = await requestVPreEmpType(params);

        if (res.result.length > 0) {

            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.preEmpTypeID, label: item.preEmpTypeName }
            });
            // dataMaskForDropdown.unshift({ value: -1, label: "All" });
            setGetVPreEmpType(dataMaskForDropdown)
        }
    }

    const onPressSectionList = (value: any, item: any) => {
        getDoctorList(value, item)
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        }
    };
    /* eslint-enable no-template-curly-in-string */

    const onFinishPatForm = async (values: any) => {
        if (!values.fromToDate) {
            values['fromDate'] = '1900-01-21';
            values['toDate'] = moment(new Date()).format('YYYY-MM-DD');
        } else {
            values['fromDate'] = moment(values.fromToDate[0]).format('YYYY-MM-DD');
            values['toDate'] = moment(values.fromToDate[1]).format('YYYY-MM-DD');
        }

        console.log({ isDateFilterMandatory })

        if (!isDateFilterMandatory) {
            values['fromDate'] = '1900-01-01';
            values['toDate'] = '1900-01-01';
        }

        const params = {
            ...values,
            patientID: -1,
            userID: -1,
            patientCaseID:'-1',
            formID: -1,
            type: +selectedType
        }
        console.log(params);
        const response = await requestGetPatientSearchOPIP(params);
        setLoading(false)
        setList(response?.result)

        if (response?.isSuccess) {
        } else {
            message.error(response?.msg);
        }
    };

    const onChangeDateFilterMandatory: CheckboxProps['onChange'] = (e) => {
        setIsDateFilterMandatory(e.target.checked)
    };

    const handleResetFilter = async () => {
        await filterForm.resetFields();
        await filterForm.setFieldsValue({
            fromToDate: [dayjs(moment(), dateFormat), dayjs(moment(), dateFormat)],
            patientPhoneNo: '',
            fromDate: '1900-11-21T12:47:26.406Z',
            toDate: '2023-12-21T12:47:26.406Z',
            patientCaseID: -1,
            patientCaseNo: '',
            patientID: -1,
            patientNo: '',
            patientUIDNo: '',
            caseTypeID: -1,
            sectionID: -1,
            consultantDocID: -1,
            patientFileNo: '',
            patientName: '',
            patientMobile: '',
            patientPhone: '',
            userID: -1,
            formID: -1,
            type: 1,
            preEmpTypeID: -1
        });
        console.log(filterForm.getFieldsValue())
        onFinishPatForm(filterForm.getFieldsValue())
        // onFilter(filterForm.getFieldValue());
    }
    const handleChangeFilter = (value: any) => { }

    const filterVisitForm = () => {
        return (
            <Form
                form={filterForm}
                onFinish={onFinishPatForm}
                validateMessages={validateMessages}
                layout="vertical"
                size={'medium'}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="fromToDate" label="From/To Date" rules={[{ required: false }]}>
                            <DatePicker.RangePicker
                                format={dateFormat}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Checkbox checked={isDateFilterMandatory} onChange={onChangeDateFilterMandatory}>Date filter required</Checkbox>

                    </Col>
                </Row>

                {/* <Row gutter={16}>

                    <Col span={24} style={{ marginTop: 15 }}>
                        <Form.Item name="patientCaseID" label="Patient Case" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col>
                </Row> */}

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="patientCaseNo" label="Patient Case No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientNo" label="PatientNo" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="patientName" label="Patient Name" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientUIDNo" label="Patient UID No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="caseTypeID" label="Case Type" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={[{ value: -1, label: "All" }]}
                                defaultValue={-1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="sectionID" label="Specialization" rules={[{ required: false }]}>
                            <Select
                                showSearch
                                options={sections}
                                defaultActiveFirstOption={true}
                                onChange={onPressSectionList}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="consultantDocID" label="Doctor" rules={[{ required: false }]}>
                            <Select
                                onChange={handleChangeFilter}
                                options={doctorList}
                                defaultActiveFirstOption={true}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientFileNo" label="Patient File No" rules={[{ required: false }]}>
                            <InputNumber style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="patientMobile" label="Patient Mobile No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="patientPhone" label="Patient Phone No" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" loading={loading} htmlType="submit">
                        Filter
                    </Button>
                    <Button onClick={()=>handleResetFilter()} style={{marginLeft:20}} type="primary">
                            Clear
                        </Button>
                </Form.Item>
            </Form >
        )
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const model = () => {
        return (
            <Modal title={selectedPatientData?.candName}
                open={isModalOpen}
                width={1000}
                height={300}
                style={{ top: 20 }}
                onOk={() => handleCancel()}
                onCancel={() => handleCancel()}
                footer={[]}
            >
                {/* <Tabs defaultActiveKey={1} items={items} onChange={onChange} /> */}
                <AddUpdatePatientCase
                    patientData={selectedPatientData}
                    checkinData={patientCheckInData}
                    selectedTab={selectedTab}
                    preEmpType={selectedPreEmpType}
                    selectedType={selectedType}
                    handleCancel={() => handleCancel()} />
            </Modal>
        )
    }

    const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
        console.log('radio3 checked', value);
        setSelectedType(value);
    };


    return (
        <>
            <div style={{ marginBottom: 10 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <Row>
                                <Col span={12}>
                                    <h3>Registration</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patReg}</h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <Row>
                                <Col span={12}>
                                    <h3>New</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patNewCase}</h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <Row>
                                <Col span={12}>
                                    <h3>Revisit</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patRevisit}</h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bodyStyle={{ padding: 10 }} bordered={false}>
                            <Row>
                                <Col span={12}>
                                    <h3>Checkout</h3>
                                </Col>
                                <Col span={12}>
                                    <h3 style={{ textAlign: 'end' }}>{patientDailyCount?.patCheckOut}</h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Row gutter={8}>
                <Col span={14}>

                    <Card>
                        <Spin spinning={loadingCheckin} >
                            {patientSearch()}
                        </Spin>
                    </Card>
                </Col>
                <Col span={10}>
                    <Card>
                        <Radio.Group options={options} onChange={onChange3} value={selectedType} />
                        <div style={{ marginTop: 20 }}>
                            {filterVisitForm()}
                        </div>
                    </Card>
                </Col>
            </Row>
            {model()}
        </>
    );
});

export default ReceptionSearch;