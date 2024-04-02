import { Button, Card, Col, Form, Input, Row, DatePicker, message, Table, Typography, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { requestAddExperience, requestGetEmployee, requestGetQual } from "../services/api";
import { convertDate } from "@/utils/helper";
import moment from "moment";
import { FormOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import { PageContainer } from "@ant-design/pro-components";






const AddExperience = ({ visible, onClose, onSaveSuccess, selectedRows, empId }: any) => {
    const [form1] = Form.useForm();
    const [experience, setExperience] = useState<any>();
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [indusExpID, setIndusExpID] = useState("-1")

    useEffect(() => {
        getEmployeeSearch();
    }, [])

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'employerName',
        },
        {
            title: 'Designation',
            dataIndex: 'desig',
        },
        {
            title: 'Responsibility',
            dataIndex: 'responsibility',
        },
        {
            title: 'Gross Salary',
            dataIndex: 'grossSalary',
        },
        {
            title: 'From',
            dataIndex: 'periodFrom',
            render: (text: any) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>
        },
        {
            title: 'To',
            dataIndex: 'periodTo',
            render: (text: any) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" size={"small"} onClick={() => setEditField(record)} icon={<FormOutlined />} />
                </Space>
            ),
        },
    ];
    const setEditField = (data: any) => {
        setIndusExpID(data?.indusExpID)
        form1.setFieldsValue({
            qualID: data?.m22_QualID,
            employerName: data?.employerName,
            desig: data?.desig,
            natureType: data?.natureType,
            expYear: data?.expYear,
            expMonth: data?.expMonth,
            expDay: data?.expDay,
            periodInMonth: data?.periodInMonth,
            period: [dayjs(data?.periodFrom), dayjs(data?.periodTo)],
            responsibility: data?.responsibility,
            supervisionPerson: data?.supervisionPerson,
            grossSalary: data?.grossSalary,
        })
        window.scrollTo(0, 0)
    };
    const getEmployeeSearch = async () => {
        setTableLoading(true);
        const params = {
            "empID": empId,
            "empCode": "",
            "userID": -1,
            "formID": -1,
            "type": 6
        }
        const response = await requestGetEmployee({ ...params });
        setTableLoading(false)

        if (response?.isSuccess && response?.result.length > 0) {
            setExperience(response?.result)
        }
    }

    const addExperience = async (values: any) => {
        values['passingYear'] = values.label ? values.label : "2020";
        values['periodFrom'] = convertDate(values?.period[0]);
        values['periodTo'] = convertDate(values?.period[1]);
        try {
            const staticParams = {
                "empID": empId,
                "indusExpID": indusExpID,
                "userID": -1,
                "formID": -1,
                "type": indusExpID === "-1" ? 1 : 2
            };
            setLoading(true)
            const msg = await requestAddExperience({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form1.resetFields();
                setIndusExpID("-1")
                getEmployeeSearch();
                message.success(msg.msg);
                return;
            } else {
                setLoading(false)
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    }
    return (
        <PageContainer>

            <Form
                form={form1}
                onFinish={addExperience}
                layout="vertical"
            >
                <Card>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name={'employerName'}
                                label="Employer Name"
                                rules={[{ required: false, message: 'Please Enter Employer Name' }]}
                            >
                                <Input placeholder="Please Enter Employer Name" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'desig'}
                                label="Designation"
                                rules={[{ required: false, message: 'Please Enter The Designation Name' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Designation Name" />

                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'natureType'}
                                label="Nature Type"
                                rules={[{ required: false, message: 'Please Enter Nature Type' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Nature Type" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="expYear"
                                label="Experience Year"
                                rules={[{ required: false, message: 'Please Enter Experience Year' }]}
                            >
                                <Input placeholder="Please Enter Experience Year" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="expMonth"
                                label="Experience Month"
                                rules={[{ required: false, message: 'Please Enter Experience Month' }]}
                            >
                                <Input placeholder="Please Enter Experience Month" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="expDay"
                                label="Exp Day"
                                rules={[{ required: false, message: 'Please Enter Exp Day' }]}
                            >
                                <Input placeholder="Please Enter Exp Day" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="periodInMonth"
                                label="periodInMonth"
                                rules={[{ required: false, message: 'Please Enter Period InMonth' }]}
                            >
                                <Input placeholder="Please Enter Period InMonth" />
                                {/* <Select
                                    labelInValue
                                    placeholder="Please Enter Period InMonth"
                                    options={passingYear}
                                /> */}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="period"
                                label="Period"
                                rules={[{ required: true, message: 'Please Select Range' }]}
                            >
                                <RangePicker
                                    format={'DD-MMM-YYYY'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="responsibility"
                                label="responsibility"
                                rules={[{ required: false, message: 'Please Enter Responsibility' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Responsibility" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="supervisionPerson"
                                label="Supervision Person"
                                rules={[{ required: false, message: 'Please Enter Supervision Person' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Supervision Person" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="grossSalary"
                                label="Gross Salary"
                                rules={[{ required: false, message: 'Please Enter Gross Salary' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Gross Salary" />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginTop: 30 }} span={5}>
                            <Button loading={loading} htmlType="submit" type="primary">
                                {indusExpID == "-1" ? 'Add' : 'Update'}
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Form>

            <Spin spinning={tableLoading}>
                <Table dataSource={experience}
                    columns={columns}
                />
            </Spin>
        </PageContainer>
    )
}
export default AddExperience;