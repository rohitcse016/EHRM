import { Button, Card, Col, Form, Input, Row, DatePicker, message, Space, Select, Checkbox, Table, Typography, Spin } from "antd";
import { useEffect, useState } from "react";
import { requestAddFamily, requestGetEmployee } from "../services/api";
import { convertDate } from "@/utils/helper";
import moment from "moment";
import { FormOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import { PageContainer } from "@ant-design/pro-components";




const AddFamily = ({ visible, onClose, onSaveSuccess, selectedRows, empId, gender,relation }: any) => {
    const [familyForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [memberID, setMemberID] = useState("-1")
    const [familyList, seFamilyList] = useState<any>([])


    useEffect(() => {
        getEmployeeSearch();
    }, [])
    const columns = [
        {
            title: 'Member Name',
            dataIndex: 'member',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Relation',
            dataIndex: 'relation',
        },
        {
            title: 'isMarried',
            dataIndex: 'isMarried',
            render: (text: any) => <Typography>{text == "1" ? "Yes" : "No"}</Typography>
        },
        {
            title: 'isNominee',
            dataIndex: 'isNominee',
            render: (text: any) => <Typography>{text == "1" ? "Yes" : "No"}</Typography>
        },
        {
            title: 'DOB',
            dataIndex: 'memDOB',
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
        setMemberID(data?.memberID)
        familyForm.setFieldsValue({
            member: data?.member,
            genderID: data?.m05_GenderID,
            relationID: data?.m21_RelationID,
            age: data?.age,
            isEmployed: data?.isEmployed,
            isNominee: data?.isNominee,
            isMarried: data?.isMarried,
            ageAsOn: dayjs(data?.ageAsOn),
            memDOB: dayjs(data?.memDOB),
        })
        window.scrollTo(0, 0)
        // setDiseaseID(data?.diseaseID)
    };
    const getEmployeeSearch = async () => {
        setTableLoading(true);
        console.log(empId)
        const params = {
            "empID": empId,
            "empCode": "",
            "userID": -1,
            "formID": -1,
            "type": 5
        }
        const response = await requestGetEmployee({ ...params });
        // setEmployeeDetails(response?.result)
        setTableLoading(false)

        if (response?.isSuccess && response?.result.length > 0) {
            seFamilyList(response?.result)
            setTableLoading(false)
        }
    }

    const addFamilyItem = async (values: any) => {
        console.log(values)
        // values['isActive'] = values.isActive.toString();
        values['memDOB'] = convertDate(values?.memDOB);
        values['isNominee'] = values?.isNominee ? Number(values?.isNominee).toString() : "0";
        values['isMarried'] = values?.isMarried ? Number(values?.isMarried).toString() : "0";
        values['isEmployed'] = values?.isEmployed ? Number(values?.isEmployed).toString() : "0";
        try {
            const staticParams = {
                "empID": empId,
                "memberID": memberID,
                "userID": -1,
                "formID": -1,
                "type": memberID == "-1" ? 1 : 2
            };
            setLoading(true)
            const msg = await requestAddFamily({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                familyForm.resetFields();
                setMemberID("-1");
                getEmployeeSearch();
                message.success(msg.msg);
                return;
            } else {
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
                form={familyForm}
                onFinish={addFamilyItem}
                layout="vertical"
            >
                <Card>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name={'member'}
                                label="Member Name"
                                rules={[{ required: false, message: 'Please Enter Member Name' },
                                ]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Member Name" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'genderID'}
                                label="Gender"
                                rules={[{ required: false, message: 'Please Select Gender' }]}
                            >
                                <Select
                                    placeholder="Please choose the Gender"
                                    options={gender}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'relationID'}
                                label="Relation"
                                rules={[{ required: false, message: 'Please Select The Relation' }]}
                            >
                                <Select
                                    placeholder="Please Select The Relation"
                                    options={relation}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'age'}
                                label="Age"
                                rules={[{ required: false, message: 'Please Enter The age' }]}
                            >
                                <Input type='number' max={100} placeholder="Please Enter The Age" />
                            </Form.Item>
                        </Col>
                        <Form.Item
                            name={'isEmployed'}
                            label="isEmployed"
                            valuePropName="checked"
                            rules={[{ required: false, message: 'Please Check isEmployed' }]}
                        >
                            <Checkbox>isEmployed</Checkbox>

                        </Form.Item>
                        <Form.Item
                            name={'isNominee'}
                            label="isNominee"
                            valuePropName="checked"
                            rules={[{ required: false, message: 'Please Check isNominee' }]}
                        >
                            <Checkbox>isNominee</Checkbox>

                        </Form.Item>
                        <Form.Item
                            valuePropName="checked"
                            name={'isMarried'}
                            label="isMarried"
                            rules={[{ required: false, message: 'Please Check isMarried' }]}
                        >
                            <Checkbox>isMarried</Checkbox>

                        </Form.Item>
                        <Col span={6}>
                            <Form.Item
                                name={'ageAsOn'}
                                label="Age As On"
                                rules={[{ required: false, message: 'Please Select Date ageAsOn' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format={'DD-MMM-YYYY'}
                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'memDOB'}
                                label="DOB"
                                rules={[{ required: false, message: 'Please Select The DOB' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format={'DD-MMM-YYYY'}
                                    // disabledDate={(current) => {
                                    //     let customDate = moment().format("YYYY-MM-DD");
                                    //     return current && current > dayjs().subtract(12, 'year');
                                    // }}
                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginTop: 30 }} span={5}>
                            <Button loading={loading} htmlType="submit" type="primary">
                                {memberID == "-1" ? 'Add' : 'Update'}
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Form>
            <Spin spinning={tableLoading}>
                <Table columns={columns} dataSource={familyList} ></Table>
            </Spin>
        </PageContainer>
    )
}
export default AddFamily;