import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Modal, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card } from 'antd';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history, type IRoute } from 'umi';
import { requestAddPatDocAppointments, requestGetPatDocAppointment } from '../services/api';
import { activeStatus, dateFormat } from '@/utils/constant';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const DoctorSlotBookingList = React.forwardRef((props) => {
    const [form] = Form.useForm();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };


    const columns: ColumnsType<any> = [
        {
            title: 'Doctor',
            dataIndex: 'docUserName',
            key: 'docUserName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'No. of Slots',
            dataIndex: 'noOfSlotPerHrs',
            key: 'noOfSlotPerHrs',
        },
        {
            title: 'From date',
            dataIndex: 'displaySlotFromDate',
            key: 'displaySlotFromDate',
        },
        {
            title: 'To Date',
            key: 'displaySlotToDate',
            dataIndex: 'displaySlotToDate',

        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size={'small'} onClick={() => {
                        // props?.onEditRecord(record)
                        const { dateRange, isActive } = formFilter.getFieldsValue()
                        let slotFromDate = convertDate(dateRange[0]);
                        let slotToDate = convertDate(dateRange[1]);
                        console.log({ isActive })
                        history.push(`/booking/doctor-slot-booking-details/${record.docUserID}/${record.userSlotID}/${slotFromDate}/${slotToDate}/${isActive}`)
                    }}>
                        View
                    </Button>
                    <Button size={'small'} key="1" type="primary" danger onClick={() => { showDeleteConfirm(record) }}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];


    const showDeleteConfirm = (data: any) => {
        console.log(data)
        confirm({
            title: 'Are you sure delete this Slot?',
            icon: <ExclamationCircleFilled />,
            content: `Slot From ${data?.displaySlotFromDate} to ${data?.displaySlotToDate}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                submitDeleteAll(data);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };


    const submitDeleteAll = async (data: any) => {
        const { userSlotID, docUserID, displaySlotFromDate, displaySlotToDate } = data;
        console.log(docUserID, userSlotID)

        const { dateRange, isActive } = formFilter.getFieldsValue()
        let slotFromDate = convertDate(dateRange[0]);
        let slotToDate = convertDate(dateRange[1]);

        const requestParams = {
            userSlotID: userSlotID,
            docUserID: docUserID,
            noOfSlotPerHrs: 3,
            slotFromDate: moment(slotFromDate).format(dateFormat),
            slotToDate: moment(slotToDate).format(dateFormat),
            fromHrs: '00:00:00',
            toHrs: '00:00:00',
            isActive: false,
            isForDelete: true,
            userWeekSlotID: '',
            formID: -1,
            type: 3,
            fromHrs2: '00:00:00',
            toHrs2: '00:00:00',
            fromHrs3: '00:00:00',
            toHrs3: '00:00:00',
            lstType_row: []
        }

        try {
            setLoading(true)
            const response = await requestAddPatDocAppointments(requestParams);
            setLoading(false)
            console.log(response);

            if (response?.isSuccess) {
                message.success(response?.msg);
                const formValue = formFilter.getFieldsValue()
                filterSubmit(formValue)
                // history.push('/booking/doctor-slot-booking');
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }



    const filterSubmit = async (values: any) => {
        const { dateRange, isActive } = values;

        console.log({ dateRange, isActive });

        try {

            let slotFromDate = convertDate(dateRange[0]);
            let slotToDate = convertDate(dateRange[1]);

            const params = {
                userSlotID: -1,
                docUserID: -1,
                slotFromDate,
                slotToDate,
                isActive,
                sectionID: -1,
                fromHrs: '',
                toHrs: '',
                showAll: 1,
                userID: -1,
                formID: -1,
                mainType: 1,
                type: 1
            }
            setLoading(true)
            const response = await requestGetPatDocAppointment({ ...params });
            setLoading(false)
            const dataMask = response?.result?.map((item: any, index: string) => {
                return { key: index.toString(), ...item };
            });
            setList(dataMask)
            if (!response?.isSuccess) {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }

    }

    const filterForm = () => {
        return (
            <Form
                layout="vertical"
                form={formFilter}
                onFinish={filterSubmit}
                preserve={true}
                scrollToFirstError={true}
                initialValues={
                    {
                        dateRange: [dayjs(), dayjs()],
                        isActive: -1
                    }
                }
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="dateRange"
                                    label="From - To Date"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <RangePicker
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="isActive"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Status"
                                        optionFilterProp="children"
                                        options={activeStatus}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Button style={{ padding: 5, width: 100, height: 38, marginTop: 30 }} type="primary" htmlType="submit">
                                    Filter
                                </Button>
                            </Col>
                        </Row>



                        <Row gutter={16}>

                        </Row>
                    </div>
                </>
            </Form>
        )
    }


    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card
                title="Filter"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <Spin tip="Please wait..." spinning={loading}>
                    <div style={contentStyle}>
                        {filterForm()}
                    </div>
                </Spin>
            </Card>
            <Card
                title="Appointment List"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >

                <div style={contentStyle}>
                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={list}
                            expandable={{
                                expandedRowRender: (record) => <div>
                                    <Space>
                                        <Card
                                            size="small"
                                            title={'Slot 1'}
                                        >
                                            <div>
                                                <ProDescriptions
                                                    dataSource={record}
                                                    bordered={true}
                                                    size={'small'}
                                                    columns={[
                                                        {
                                                            title: 'From Hours',
                                                            dataIndex: 'displayFromHrs',
                                                            span: 3
                                                        },
                                                        {
                                                            title: 'To Hours',
                                                            dataIndex: 'displayToHrs',
                                                            span: 3
                                                        }
                                                    ]}
                                                />
                                            </div>
                                        </Card>
                                        <Card
                                            size="small"
                                            title={'Slot 2'}
                                        >
                                            <div>
                                                <ProDescriptions
                                                    dataSource={record}
                                                    bordered={true}
                                                    size={'small'}
                                                    columns={[
                                                        {
                                                            title: 'From Hours',
                                                            dataIndex: 'displayFromHrs2',
                                                            span: 3
                                                        },
                                                        {
                                                            title: 'To Hours',
                                                            dataIndex: 'displayToHrs2',
                                                            span: 3
                                                        }
                                                    ]}
                                                />
                                            </div>
                                        </Card>
                                        <Card
                                            size="small"
                                            title={'Slot 3'}
                                        >
                                            <div>
                                                <ProDescriptions
                                                    dataSource={record}
                                                    bordered={true}
                                                    size={'small'}
                                                    columns={[
                                                        {
                                                            title: 'From Hours',
                                                            dataIndex: 'displayFromHrs3',
                                                            span: 3
                                                        },
                                                        {
                                                            title: 'To Hours',
                                                            dataIndex: 'displayToHrs3',
                                                            span: 3
                                                        }
                                                    ]}
                                                />
                                            </div>
                                        </Card>
                                    </Space>
                                </div>,
                                rowExpandable: (record) => record.name !== 'Not Expandable',
                            }}
                        />
                    </Spin>
                </div>
            </Card>
        </Space>

    );
});

export default DoctorSlotBookingList;