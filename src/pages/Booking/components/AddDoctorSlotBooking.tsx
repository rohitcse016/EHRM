import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme, Spin, InputNumber, Card, Space, Modal, Checkbox, Divider, InputRef, Table, message, TimePicker } from 'antd';
import { PageContainer, EditableProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { requestGetSection, requestGetUserList } from '@/services/apiRequest/dropdowns';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import { DatePicker, Radio } from 'antd';
import { dateFormat } from '@/utils/constant';
import { convertDate, convertTime } from '@/utils/helper';
import dayjs from 'dayjs';
import { requestAddPatDocAppointments } from '../services/api';
import DoctorSlotBookingList from './DoctorSlotBookingList';

const { RangePicker } = DatePicker;


const { Option } = Select;

const gridStyle: React.CSSProperties = {
    textAlign: 'center',
};


const AddDoctorSlotBooking = () => {
    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [sections, setSections] = useState<any>([])
    const [doctorList, setDoctorList] = useState<any>([])
    const { token } = theme.useToken();
    const [slots, setSlots] = useState([
        {
            id: "1",
            name: "Slot 1",
            timeRange: "",
            week: [
                {
                    id: "0",
                    name: "All",
                    selected: false
                },
                {
                    id: "1",
                    name: "Sun",
                    selected: false
                },
                {
                    id: "2",
                    name: "Mon",
                    selected: false
                },
                {
                    id: "3",
                    name: "Tue",
                    selected: false
                },
                {
                    id: "4",
                    name: "Wed",
                    selected: false
                },
                {
                    id: "5",
                    name: "Thu",
                    selected: false
                },
                {
                    id: "6",
                    name: "Fri",
                    selected: false
                },
                {
                    id: "7",
                    name: "Sat",
                    selected: false
                }
            ]
        },
        {
            id: "2",
            name: "Slot 2",
            timeRange: "",
            week: [
                {
                    id: "0",
                    name: "All",
                    selected: false
                },
                {
                    id: "1",
                    name: "Sun",
                    selected: false
                },
                {
                    id: "2",
                    name: "Mon",
                    selected: false
                },
                {
                    id: "3",
                    name: "Tue",
                    selected: false
                },
                {
                    id: "4",
                    name: "Wed",
                    selected: false
                },
                {
                    id: "5",
                    name: "Thu",
                    selected: false
                },
                {
                    id: "6",
                    name: "Fri",
                    selected: false
                },
                {
                    id: "7",
                    name: "Sat",
                    selected: false
                }
            ]
        },
        {
            id: "3",
            name: "Slot 3",
            timeRange: "",
            week: [

                {
                    id: "0",
                    name: "All",
                    selected: false
                },
                {
                    id: "1",
                    name: "Sun",
                    selected: false
                },
                {
                    id: "2",
                    name: "Mon",
                    selected: false
                },
                {
                    id: "3",
                    name: "Tue",
                    selected: false
                },
                {
                    id: "4",
                    name: "Wed",
                    selected: false
                },
                {
                    id: "5",
                    name: "Thu",
                    selected: false
                },
                {
                    id: "6",
                    name: "Fri",
                    selected: false
                },
                {
                    id: "7",
                    name: "Sat",
                    selected: false
                }
            ]
        }
    ]);

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    useEffect(() => {
        getSectionList();
    }, [])

    const getSelectDay = (week: any, slotId: number) => {
        return week.filter((day: any) => {
            return day.selected &&day.id !='0';
        }).map((day: any) => {
            return {
                rowID: day.id,
                rowValue: slotId
            }
        })
    }

    const formSubmit = async (values: any) => {
        const { dateRange, slots } = values;

        let slotFromDate = convertDate(dateRange[0]);
        let slotToDate = convertDate(dateRange[1]);

        //slot 1
        const fromHrs = convertTime(slots[0].timeRange[0]);
        const toHrs = convertTime(slots[0].timeRange[1]);
        const slot1Week = getSelectDay(slots[0].week, slots[0].id);
        // slot 2
        const fromHrs2 = convertTime(slots[1].timeRange[0]);
        const toHrs2 = convertTime(slots[1].timeRange[1]);
        const slot2Week = getSelectDay(slots[1].week, slots[1].id);
        // slot 3
        const fromHrs3 = convertTime(slots[2].timeRange[0]);
        const toHrs3 = convertTime(slots[2].timeRange[1]);
        const slot3Week = getSelectDay(slots[2].week, slots[2].id);

        const lstType_row = [...slot1Week, ...slot2Week, ...slot3Week];

        const params = {
            userSlotID: -1,
            docUserID: values?.docUserID,
            noOfSlotPerHrs: values?.noOfSlotPerHrs,
            slotFromDate,
            slotToDate,
            fromHrs,
            toHrs,
            isActive: true,
            isForDelete: true,
            userWeekSlotID: "-1",
            formID: -1,
            type: 1,
            fromHrs2,
            toHrs2,
            fromHrs3,
            toHrs3,
            lstType_row
        }
        console.log({
            params
        }, values);


        try {
            setLoading(true)
            const response = await requestAddPatDocAppointments(params);
            setLoading(false)
            console.log(response);

            if (response?.isSuccess) {
                message.success(response?.msg);
                form.resetFields();
                // if (investigationListRef.current) {
                //     investigationListRef.current.getList();
                // }
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }

    }

    const goBack = () => {
        history.push("/")
    }


    const getDoctorList = async (value: any, item: any) => {
        const params = {
            "CommonID": item.value,
            "Type": 3,
        }
        const res = await requestGetUserList(params);
        console.log(res)
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.userID, label: item.userName }
            })
            setDoctorList(dataMaskForDropdown)
        }
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
            })
            setSections(dataMaskForDropdown)
            console.log(sections)
        }
    }



    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onEditRecord = (data: any) => {
        // getInvParameter(data?.invParameterID)
    }
    const setAllDays = (data: any, checked: any, day: any) => {
        const formValues=form.getFieldValue("slots")
        if (day.key == 0) {
            const week = formValues[data].week.map((item: any) => {
                if(checked == true) return { ...item, selected: true }
                else return { ...item, selected: false }
            })
            const updated=formValues.map((item: any) => {
                return(
                    item.id==formValues[data].id ? {...item,week} :{...item}
                )
            })
            console.log("slots", { week: week }, updated)
            form.setFieldValue("slots",updated)
        }
    }

    const formList = () => {
        return (
            <>
                <Form.List
                    initialValue={slots}
                    name="slots">
                    {(slotsData, { add, remove }) => (
                        <Space style={{}}>

                            {slotsData.map(({ key, name, ...restField }) => (
                                <Card
                                    size="small"
                                    title={slots[key]['name']}
                                    key={key}
                                >
                                    {/* Nest Form.List */}
                                    <Form.Item label="Week">
                                        <Form.List name={[name, 'week']}>
                                            {(weekData, subOpt) => (
                                                <div style={{}}>
                                                    {weekData.map((day) => (
                                                        <Space key={day.key} size={[8, 16]} wrap>
                                                            <Form.Item
                                                                noStyle
                                                                valuePropName="checked"
                                                                label="aa"
                                                                name={[day.name, 'selected']}>
                                                                <Checkbox onChange={(e) => setAllDays(name, e.target.checked, day)}>{slots[key]['week'][day.key]['name']}</Checkbox>
                                                            </Form.Item>
                                                        </Space>
                                                    ))}
                                                </div>
                                            )}
                                        </Form.List>
                                    </Form.Item>

                                    <Form.Item label="From/To Time" name={[name, 'timeRange']} >
                                        <TimePicker.RangePicker
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>



                                </Card>
                            ))}
                        </Space>
                    )}
                </Form.List>
            </>
        )
    }

    const addForm = () => {
        return (
            <Form
                ref={formRef}
                layout="vertical"
                form={form}
                onFinish={formSubmit}
                preserve={true}
                scrollToFirstError={true}
            >
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="sectionId"
                                    label="Specialization"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        showSearch
                                        filterOption={filterOption}
                                        placeholder="Specialization"
                                        optionFilterProp="children"
                                        options={sections}
                                        size={'large'}
                                        onChange={(value, item) => {
                                            getDoctorList(value, item)
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item
                                    name="docUserID"
                                    label="Doctor"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <Select
                                        showSearch
                                        filterOption={filterOption}
                                        placeholder="Doctor"
                                        optionFilterProp="children"
                                        options={doctorList}
                                        size={'large'}
                                    />
                                </Form.Item>
                            </Col>

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
                            <Col className="gutter-row" span={4}>

                                <Form.Item
                                    label="No Of Slot Per Hrs"
                                    name={'noOfSlotPerHrs'}
                                    rules={[{ required: true, message: 'Please enter' }]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="No Of Slot Per Hrs"
                                        size={'large'}
                                    />

                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col className="gutter-row" span={24}>
                                {formList()}
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col style={{ justifyContent: 'flex-end', marginTop: 20 }}>
                                <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button onClick={goBack} style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </>
            </Form>
        )
    }

    return (
        <PageContainer>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title="Create Doctor Slot"
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            {addForm()}
                        </div>
                    </Spin>
                </Card>

                <DoctorSlotBookingList />
            </Space>
        </PageContainer>
    );
};

export default AddDoctorSlotBooking;