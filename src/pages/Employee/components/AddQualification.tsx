import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Table, message } from "antd";
import { useEffect, useState } from "react";
import { requestAddQualification, requestGetEmployee, requestGetQual } from "../services/api";
import Typography from "antd/es/typography/Typography";
import moment from "moment";
import { FormOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";



const AddQualification = ({ visible, onClose, onSaveSuccess, selectedRows, state, district, country, empId }: any) => {
    const [form1] = Form.useForm();
    const [qualificationList, setQualificationList] = useState<any>([]);
    const [qualification, setQualification] = useState<any>([{ value: '1', label: "10+2" }]);
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [empQualID, setEmpQualID] = useState("-1")
    const [passingYear, setPassingYear] = useState<any>([{ value: '1', label: "2022" }, { value: '1', label: "2023" }]);

    useEffect(() => {
        getQualification();
        getEmployeeSearch();
    }, [])

    const columns = [
        {
            title: 'Qualification Name',
            dataIndex: 'qualName',
        },
        {
            title: 'University',
            dataIndex: 'univName',
        },
        {
            title: 'Passing Year',
            dataIndex: 'passingYear',
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
        setEmpQualID(data?.empQualID)
        form1.setFieldsValue({
            qualID: data?.m22_QualID,
            univName: data?.univName,
            collegeName: data?.collegeName,
            districtID: data?.m04_DistrictID,
            countryID: data?.m02_CountryID,
            stateID: data?.m03_StateID,
            noOfAttempt: data?.noOfAttempt,
            subjectOffered: data?.subjectOffered,
            passPercent: data?.passPercent,
            passClass: data?.passClass,
            passingYear: data?.passingYear,
            cgpaRemark: data?.cgpaRemark,
            empQualType: data?.empQualType,
            guideName: data?.guideName,
            markObtained: data?.markObtained,
            maxMark: data?.maxMark,
            cgpa: data?.cgpa,
            cgpaScale: data?.cgpaScale,
        })
        window.scrollTo(0, 0)
        // setDiseaseID(data?.diseaseID)
    };
    const getEmployeeSearch = async () => {
        setTableLoading(true);
        const params = {
            "empID": empId,
            "empCode": "",
            "userID": -1,
            "formID": -1,
            "type": 4
        }
        const response = await requestGetEmployee({ ...params });
        setTableLoading(false)
        setQualificationList(response?.result)
    }
    const getQualification = async () => {
        const params = {
            "qualID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetQual(params);
        let dataMaskForDropdown = []
        if (res?.result.length > 0) {
            dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.qualID, label: item.qualName }
            });
        }
        dataMaskForDropdown.unshift({ value: -1, label: "Select" });
        setQualification(dataMaskForDropdown)
    }
    const addQualification = async (values: any) => {
        console.log(values)
        values['passClass'] = "";
        values['passingYear'] = values?.label ? values?.label : "2020";
        try {
            const staticParams = {
                "empID": empId,
                "empQualID": empQualID,
                "userID": -1,
                "formID": -1,
                "type": empQualID == "-1" ? 1 : 2

            };
            setLoading(true)
            const msg = await requestAddQualification({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form1.resetFields();
                setEmpQualID("-1")
                message.success(msg.msg);
                getEmployeeSearch();
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
                form={form1}
                onFinish={addQualification}
                layout="vertical"
            >
                <Card>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name={'qualID'}
                                label="Qualification"
                                rules={[{ required: false, message: 'Please Select the Qualification' }]}
                            >
                                <Select
                                    placeholder="Please Select Qualification"
                                    options={qualification}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'collegeName'}
                                label="College"
                                rules={[{ required: false, message: 'Please Enter The College Name' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter College Name" />

                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name={'univName'}
                                label="University"
                                rules={[{ required: false, message: 'Please Select University' }]}
                            >
                                <Input maxLength={30} placeholder="Please Select University" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="stateID"
                                label="State"
                                rules={[{ required: false, message: 'Please Choose The State' }]}
                            >
                                <Select
                                    placeholder="Please choose the State"
                                    options={state}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="districtID"
                                label="District"
                                rules={[{ required: false, message: 'Please Choose The District' }]}
                            >
                                <Select
                                    placeholder="Please choose the District"
                                    options={district}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="countryID"
                                label="Country"
                                rules={[{ required: false, message: 'Please Choose The District' }]}
                            >
                                <Select
                                    placeholder="Please choose the District"
                                    options={country}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="passingYear"
                                label="Passing Year"
                                rules={[{ required: false, message: 'Please Choose The Passing Year' }]}
                            >
                                <Select
                                    labelInValue
                                    placeholder="Please Choose Passing Year"
                                    options={passingYear}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="noOfAttempt"
                                label="No Of Attempt"
                                rules={[{ required: false, message: 'Please Enter No Of Attempt' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter No Of Attempt" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="subjectOffered"
                                label="Subject Offered"
                                rules={[{ required: false, message: 'Please Enter Subject Offered' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Subject Offered" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="passPercent"
                                label="Passing Percent"
                                rules={[{ required: false, message: 'Please Enter Passing Percent' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Passing Percent" />
                            </Form.Item>
                        </Col>
                        {/* <Col span={6}>
                            <Form.Item
                                name="passClass"
                                label="passClass"
                                rules={[{ required: false, message: 'Please Enter passClass' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter passClass" />
                            </Form.Item>
                        </Col> */}
                        <Col span={6}>
                            <Form.Item
                                name="maxMark"
                                label="MaxMark"
                                rules={[{ required: false, message: 'Please Enter MaxMark' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter MaxMark" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="markObtained"
                                label="Mark Obtained"
                                rules={[{ required: false, message: 'Please Enter Mark Obtained' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Mark Obtained" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="guideName"
                                label="Guide Name"
                                rules={[{ required: false, message: 'Please Enter Guide Name' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Guide Name" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="empQualType"
                                label="Qualification Type"
                                rules={[{ required: false, message: 'Please Enter Qualification Type' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Qualification Type" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="cgpaRemark"
                                label="Remark"
                                rules={[{ required: false, message: 'Please Enter Remark' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter Remark" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="cgpa"
                                label="CGPA"
                                rules={[{ required: false, message: 'Please Enter CGPA' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter CGPA" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="cgpaScale"
                                label="CGPA Scale"
                                rules={[{ required: false, message: 'Please Enter CGPA Scale' }]}
                            >
                                <Input maxLength={30} placeholder="Please Enter CGPA Scale" />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginTop: 30 }} span={5}>
                            <Button loading={loading} htmlType="submit" type="primary">
                                {empQualID == "-1" ? 'Add' : 'Update'}
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Form>
            <Spin spinning={tableLoading}>
                <Table dataSource={qualificationList} columns={columns} />
            </Spin>
        </PageContainer>
    )
}
export default AddQualification;