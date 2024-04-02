import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Table, message } from "antd";
import { useEffect, useState } from "react";
import Typography from "antd/es/typography/Typography";
import moment from "moment";
import { DeleteOutlined, EyeOutlined, FormOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { requestDeleteRawData, requestGetRawDataForCorrection } from "../services/api";
import { SearchProps } from "antd/es/input";
import { convertDate } from "@/utils/helper";
const { Search } = Input;
import dayjs from 'dayjs';




const EmployeeDataCorrection = ({ visible, onClose, onSaveSuccess, selectedRows, state, district, country, empId }: any) => {
    const [form1] = Form.useForm();
    const [qualificationList, setQualificationList] = useState<any>([]);
    const [qualification, setQualification] = useState<any>([{ value: '1', label: "10+2" }]);
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [empQualID, setEmpQualID] = useState("-1")
    const [attendDate, setAttendDate] = useState([{ value: '1', label: moment() }])
    const [empList, setEmpList] = useState([])
    const [attendList, setAttendList] = useState([])
    const [selectedDate, setSelectedDate] = useState<any>(moment())
    const [params, setParams] = useState<any>({ keyword: "" });

    useEffect(() => {
        // getQualification();
        getRawDataForCorrection(-1, 1, moment());
    }, [])

    const empColumns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
        },
        {
            title: 'emailID',
            dataIndex: 'emailID',
            width:'30%'
            // render: (text: any) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>
        },
        {
            title: 'Action',
            key: 'action',
            width:'15%',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" size={"small"} onClick={() => viewAttendance(record)}
                        icon={<EyeOutlined />} />
                </Space>
            ),
        },
    ];
    const attendColumns = [
        {
            title: 'InOutTime',
            dataIndex: 'inOutTime',
        },
        {
            title: 'Attend Date',
            dataIndex: 'attendDate',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button danger size={"small"}
                        onClick={() => deleteAttendance(record)} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];
    const viewAttendance = (data: any) => {
        getRawDataForCorrection(data?.empID, 3, false)
        // setDiseaseID(data?.diseaseID)
    };
    const onChange = (value: any) => {
        value = moment(value, "DD MMM YYYY").format("YYYY-MM-DD");
        setSelectedDate(value);
        getRawDataForCorrection(-1, 2, value)
    };
    const deleteAttendance = async ({attendID,empID}:any) => {
        setTableLoading(true);
        const params = {
            "empID": empID,
            "attendID": attendID,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const response = await requestDeleteRawData({ ...params });
        setTableLoading(false)
        if (response?.isSuccess) {
            message.success(response.msg)
            viewAttendance({empID:empID})
        }
    }
    const getRawDataForCorrection = async (values: any = "-1", type: any = 1, date: any) => {
        setTableLoading(true);
        const params = {
            "empID": values,
            "attendDate": date ? date : selectedDate,
            "userID": -1,
            "formID": -1,
            "type": type
        }
        const response = await requestGetRawDataForCorrection({ ...params });
        setTableLoading(false)
        if (response.isSuccess) {
            if (type === 1) {
                const dataMask = response?.result.map((item: any) => {
                    return {
                        value: item.attendDate, label: item.attendDate
                    }
                })
                setAttendDate(dataMask)
            }
            if (type === 2) {
                const dataEmp = response?.result.map((item: any) => {
                    return {
                        key: item.empID, ...item
                    }
                })
                setEmpList(dataEmp)
            }
            if (type === 3) {
                const dataEmp = response?.result.map((item: any) => {
                    return {
                        key: item.empID, ...item
                    }
                })
                setAttendList(dataEmp)
            }
        }
    }

    const onSearch: SearchProps['onSearch'] = (value: any, _e, info) => setParams({ keyword: value });

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, patientList?: { label: string; value: string }) =>
        (patientList?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <PageContainer>

            <Card>
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
                        <Select
                            style={{ width: 200 }}
                            showSearch
                            placeholder="Select Date"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={filterOption}
                            options={attendDate}
                        />
                    </Row>
                </Col>
                <Col>
                    <div style={{ display: 'flex', alignItems: 'center' }}>

                    </div>
                </Col>
            </Row>
            <Row>
                <Table size="middle" bordered title={() => 'EMPLOYEE LIST'} style={{ width: '50%' }}
                    dataSource={empList} columns={empColumns} scroll={{ y: 300 }}/>
                <Table size="middle" style={{ width: '50%' }} title={() => 'IN OUT TIME'}
                scroll={{ y: 300 }}
                    dataSource={attendList} columns={attendColumns} />
            </Row>
            </Card>
        </PageContainer>
    )
}
export default EmployeeDataCorrection;