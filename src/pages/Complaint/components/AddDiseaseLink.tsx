import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, Divider, Modal, Table, Tag, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import DiseaseList from './DiseaseList';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { requestDiseaseList, requestDiseaseTypeList, requestGetDiseaseLink, requestGetInvParameterMasterList, requestLinkDisease } from '../services/api';
import { requestGetInvParameter, requestGetInvestigation } from '@/pages/Investigation/services/api';
import { requestGetItem } from '@/pages/MedicalStore/services/api';
import DiseaseLinkedList from './DiseaseLinkedList';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { GetProp } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';


const { Option } = Select;
const { TextArea } = Input;

interface Item {
    key: string;
    medicine: string,
    noOfDays: string,
    noOfTimesPerDay: string,
    qtyPerTimes: string,
    instruction: string,
    advice: string,
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}


const AddDiseaseLink = () => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [linkMedForm] = Form.useForm();
    const [linkTestForm] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([])
    const [diseaseID, setDiseaseID] = useState("-1");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invParameterID, setInvParameterID] = useState([]);
    const [itemList, setItemList] = useState<any>([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;
    const [checkedTest, setCheckedTest] = useState([]);
    const [checkedList, setCheckedList] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);




    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getDiseaseList();
        getInvParameter();
        getItemList()
    }, [])

    const getDiseaseLinkedList = async (diseaseId: any, type: any = 2) => {
        setDiseaseID(diseaseId)
        const staticParams = {
            "diseaseID": diseaseId,
            "userID": -1,
            "formID": -1,
            "type": type
        }
        setLoading(true)
        const res = await requestGetDiseaseLink(staticParams);
        if (res?.isSuccess === true && type === 2) {
            let check: any = [];
            res?.result.map(async (item: any) => {
                const i = itemList.findIndex(x => x.key === item.itemID)
                itemList[i] = {
                    advice: item.advice,
                    commonName: item.commonName,
                    diet: item.diet,
                    diseaseID: item.diseaseID,
                    instruction: item.instruction,
                    isSuccess: item.isSuccess,
                    noOfTimesPerDay: item.noOfTimesPerDay,
                    qtyPerTimes: item.qtyPerTimes,
                    noOfDays: item.noOfDays,
                    key: item.itemID, medicine: item.commonName
                };
                setItemList([...itemList])
                check.push(item.itemID);
            })
            setSelectedRowKeys(check)
            getDiseaseLinkedList(diseaseId, 1)
        }
        if (res?.isSuccess === true && type === 1) {
            const list = res?.result.map((item: any) => {
                return (item.invParameterID);
            })
            setCheckedTest(list)
        }
        else {
            setLoading(true)
        }
        console.log(itemList)
        setLoading(false)
    }
    const getItemList = async () => {
        const staticParams = {
            "itemID": -1,
            "itemCatID": -1,
            "itemSearch": "",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        setLoading(true)
        const res = await requestGetItem(staticParams);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return {
                    key: item.itemID,
                    medicine: item?.itemName,
                    noOfDays: "",
                    noOfTimesPerDay: "",
                    qtyPerTimes: "",
                    instruction: "",
                    advice: "",
                    diet: "",
                    isSuccess: false,
                }
            })
            setItemList(dataMaskForDropdown)
            setLoading(false)
        }
        else {
            setLoading(true)
        }
    }
    const getInvParameter = async () => {
        const params1 = {
            "invParameterID": -1,
            "invGroupID": -1,
            "isActive": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetInvestigation(params1);
        const dataMaskForDropdown = res?.result?.map((item: any) => {
            return { value: item.invParameterID, label: item.invName }
        })
        setInvParameterID(dataMaskForDropdown)
        return dataMaskForDropdown;
        // }
    }
    const getDiseaseList = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "-1",
            "isActive": "-1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: number) => {
                return { value: item.diseaseID, label: item.diseaseName }
            })
            setDiseaseType(dataMaskForDropdown)
        }
    }
    const goBack = () => {
        history.push("/")
    }

    const linkDisease = async (values: any, type: any) => {
        // console.log(values, checkedList)
        if (diseaseID == "-1") { message.error("Please select Disease") }
        else {
            try {
                var typePat = []
                if (type === 2) {
                    typePat = values.filter(function (value: any) {
                        if (selectedRowKeys.find((element: any) => element == value?.key)) {
                            return true; // skip
                        }
                        return false;
                    }).map(function (value: any) {
                        return ({
                            "col1": value?.key,
                            "col2": value?.noOfDays,
                            "col3": value?.noOfTimesPerDay,
                            "col4": value?.qtyPerTimes,
                            "col5": value?.instruction,
                            "col6": value?.advice,
                            "col7": value?.diet,
                            "col8": "",
                            "col9": "",
                            "col10": "",
                            "col11": "",
                            "col12": "",
                            "col13": "",
                            "col14": "",
                            "col15": ""
                        })
                    });
                    linkDisease(checkedTest, 1)
                }
                if (type === 1) {
                    typePat = values.map((item: any) => {
                        return {
                            "col1": item,
                            "col2": "",
                            "col3": "",
                            "col4": "",
                            "col5": "",
                            "col6": "",
                            "col7": "",
                            "col8": "",
                            "col9": "",
                            "col10": "",
                            "col11": "",
                            "col12": "",
                            "col13": "",
                            "col14": "",
                            "col15": ""
                        }
                    })
                }
                const staticParams = {
                    "diseasesID": diseaseID,
                    "lstTypeInv": typePat,
                    "userID": -1,
                    "formID": -1,
                    "type": type
                };
                setLoading(true)
                const msg = await requestLinkDisease({ ...staticParams });
                setLoading(false)
                if (msg?.isSuccess === true) {
                    message.success(msg.msg);
                    getDiseaseLinkedList(diseaseID)
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
    };

    const onEditingRecord = async (value: any, record: any) => {
        console.log(value)
        const i = itemList.findIndex(x => x.key === record.key)
        itemList[i] = { ...itemList[i], ...value }
        // await setItemList([...itemList])
        console.log(itemList, i)
    }
    let timer: any;

    const waitTime = 1000;

    function doneTyping(value: any, record: any) {
        onEditingRecord(value, record);
        console.log(`The user is done typing: ${value}`);
    }
    const onChangeEdit = (value: any, record: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            doneTyping(value, record);
        }, waitTime);
    }

    const columns = [
        {
            title: 'Medicine',
            dataIndex: 'medicine',
            key: 'medicine',
            width: '19%',
        },
        {
            title: 'No of Days',
            dataIndex: 'noOfDays',
            key: 'noOfDays',
            width: '10%',
            // editable: true,
            render: (_: any, record: any) => <Input
                onInputCapture={() => console.log("onInputCapture")}
                // onBlur={(e: any) => console.log("onBlur", e.target.value)}
                min={1}
                type='number'
                onBlur={(e: any) => onEditingRecord({ "noOfDays": e.target.value }, record,)}
                size='small' disabled={record.isSuccess === false} defaultValue={record.noOfDays}></Input>,
        },
        {
            title: 'No of Times/Day',
            dataIndex: 'noOfTimesPerDay',
            key: 'noOfTimesPerDay',
            width: '10%',
            editable: true,
            render: (_: any, record: any) => <Input min={1} size='small' type='number'
                onBlur={(e: any) => onEditingRecord({ "noOfTimesPerDay": e.target.value }, record,)}
                disabled={record.isSuccess === false}
                defaultValue={record.noOfTimesPerDay}></Input>,
        },
        {
            title: 'Qty PerTimes',
            dataIndex: 'qtyPerTimes',
            key: 'qtyPerTimes',
            editable: true,
            width: '10%',
            render: (_: any, record: any) => <Input min={1} size='small' type='number'
                onBlur={(e: any) => onEditingRecord({ "qtyPerTimes": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.qtyPerTimes}></Input>,
        },
        {
            title: 'Instruction',
            dataIndex: 'instruction',
            key: 'instruction',
            width: '19%',
            editable: true,
            render: (_: any, record: any) => <TextArea size='small' autoSize
                onBlur={(e: any) => onEditingRecord({ "instruction": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.instruction}></TextArea>,
        },
        {
            title: 'Advice',
            dataIndex: 'advice',
            key: 'advice',
            width: '17%',
            editable: true,
            render: (_: any, record: any) => <TextArea size='small' autoSize
                onBlur={(e: any) => onEditingRecord({ "advice": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.advice}></TextArea>,
        },
        {
            title: 'Diet',
            dataIndex: 'diet',
            key: 'diet',
            width: '15%',
            editable: true,
            render: (_: any, record: any) => <TextArea size='small' autoSize
            onBlur={(e: any) => onEditingRecord({ "diet": e.target.value }, record,)}
                disabled={record.isSuccess === false} defaultValue={record.diet}></TextArea>,
        },
    ];
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys, selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            onSelectChange(selectedRowKeys)
        },
        onSelect: (record, selected, selectedRows) => {
            const i = itemList.findIndex(x => x.key === record.key)
            itemList[i] = { ...record, isSuccess: selected }
            setItemList([...itemList])

            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            const arr = itemList.map((item: any) => {
                return {
                    ...item,
                    isSuccess: selected
                }
            })
            setSelectedRowKeys(selectedRows);
            setItemList(arr)
        },
    };

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());//.toLowerCase()

    const onChangeCheck: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any) => {
        setCheckedTest(checkedValues);
        console.log(checkedValues, checkedTest)
    };
    
    const EditableCell: React.FC<EditableCellProps> = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps

    }) => {
        const inputNode = <Input min={1} type={dataIndex == "noOfDays" ? 'number' : 'text'} size='small' />;

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    const linkDiseaseMedicineForm = () => {
        return (
            <Row>
                <Card
                    title="Medicine"
                    style={{ width: '70%', boxShadow: '2px 2px 2px #4874dc' }}
                    extra={[]}
                >
                    <Form
                        form={linkMedForm}
                        component={false}>
                        <Table
                            scroll={{ y: 470 }}
                            rowSelection={rowSelection}
                            rowClassName="editable-row"
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            size='small'
                            dataSource={itemList}
                            columns={columns}
                            pagination={false}
                        />
                    </Form>
                    <Col style={{ justifyContent: 'flex-end' }}>
                        <Button onClick={() => linkDisease(itemList, 2)} style={{ width: 100 }} type="primary" htmlType="submit">
                            Link
                        </Button>
                        <Button onClick={goBack}
                            style={{ marginLeft: 10, width: 100, }} type="default" >
                            Cancel
                        </Button>
                    </Col>
                </Card>

                <Card
                    title="Test Parameter"
                    style={{ width: '30%', boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <Col style={{ height: 500, overflow: 'auto' }}>
                        <Checkbox.Group style={{ width: '100%', }} options={invParameterID}
                            onChange={onChangeCheck}
                            value={checkedTest}
                        />
                    </Col>
                </Card>
            </Row>
        )
    }

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    style={{ height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                    title={<Space>
                        <Typography>{"Link Disease Test/Medicine"}</Typography>
                        <Select
                            style={{ width: 400 }}
                            showSearch
                            filterOption={filterOption}
                            placeholder="Select Disease"
                            onChange={(t: any) => getDiseaseLinkedList(t)}
                            options={diseaseType}
                        />
                    </Space>}
                >
                    <Spin tip="Please wait..." spinning={loading}>
                        <div style={contentStyle}>
                            <Space direction="horizontal" size="middle" style={{ display: 'flex', }}>
                                {linkDiseaseMedicineForm()}
                            </Space>
                        </div>
                    </Spin>
                </Card>
            </Space>
        </PageContainer>
    );
};

export default AddDiseaseLink;