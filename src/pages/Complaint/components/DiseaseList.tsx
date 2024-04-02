import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Checkbox, Form, Input, InputNumber, InputRef, Popconfirm, Select, Space, Table, Tag, Typography, message } from 'antd';
import { requestAddDisease, requestDiseaseList, requestDiseaseTypeList, requestSpecialList } from '../services/api';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';


interface Item {
    key: string;
    name: string;
    age: number;
    address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Edward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'select';
    record: Item;
    index: number;
    children: React.ReactNode;
}


const DiseaseList: React.FC = ({editRecord,refresh }:any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const formRef = useRef<any>();
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const [diseaseList, setDiseaseList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [isActive, setIsActive] = useState(true);
    const [specialList, setSpecialist] = useState([]);
    const [diseaseTypeList, setDiseaseTypeList] = useState([]);

    type DataIndex = keyof DataType;
    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        console.log(record)
        editRecord(record)
        // form.setFieldsValue({ diseaseName: '', isActive: '', diseaseTypeName: '', ...record });
        // setEditingKey(record.key);
    };
    const onChangeServiceStatus = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isService: e.target.checked ? "true" : "false"
        })
        setIsActive(e.target.checked)
        // setVatApplicable(e.target.checked)
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
        const inputNode = inputType === 'text' ?
            <Checkbox checked={isActive} onChange={onChangeServiceStatus}>IsActive</Checkbox>
            : inputType === 'select' ? 
            <Select
                placeholder="Select"
                options={specialList}
            /> : <Input />;

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
    const cancel = () => {
        setEditingKey('');
    };
    useEffect(() => {
        getDiseaseList();
    }, [refresh])
    
    useEffect(() => {
        getSpecialType();
    }, [])

    const getDiseaseList = async () => {
        const params = {
            "diseaseID": "-1",
            "diseaseTypeID": "-1",
            "specialTypeID": "-1",
            "isActive": "-1",
            "type": 1
        }
        const res = await requestDiseaseList(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: string) => {
                return { key: index, ...item }
            })
            const dataMaskTypeId = res?.result?.map((item: any, index: string) => {
                return { value:item.diseaseID,label:item.diseaseCodeICD}
            })
            setDiseaseList(dataMaskForDropdown)
            setDiseaseTypeList(dataMaskTypeId)
        }
    }
    const getDiseaseTypeList = async () => {
        const params = {
            "diseaseTypeID": -1,
            "specialTypeID": -1,
            "isActive": -1,
            "type": 1
        }
        const res = await requestDiseaseTypeList(params);
        if (res.result.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: string) => {
                return { key: index, ...item }
            })
            setDiseaseList(dataMaskForDropdown)
            console.log(dataMaskForDropdown);
        }
    }
    const getSpecialType = async () => {
        const res = await requestSpecialList({});
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any) => {
                return { value: item.diseaseTypeID, label: item.diseaseTypeName }
            })
            setSpecialist(dataMaskForDropdown)
        }
    }

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const saveDisease = async (key: any) => {
        const editValues = (await form.validateFields()) as Item;
        const index: any = diseaseList.find((item) => key === item.key);
        editValues['isActive'] =editValues.isActive.toString();
        // console.log(index.diseaseID);
        try {
            const staticParams = {
                "DiseaseTypeCode":editValues?.diseaseCodeICD,
                // "SpecialTypeID":editValues?.specialTypeName,
                "diseaseTypeName":editValues?.diseaseName,
                "diseaseTypeID":editValues?.specialTypeId,
                // "isActive": "1",
                "sortOrder": 1,
                "diseasesID": index?.diseaseID,
                "formID": -1,
                "type": 2
            };
            // console.log(editValues, index);
            setLoading(true)
            const msg = await requestAddDisease({ ...editValues, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                setEditingKey('');
                message.success(msg.msg);
                getDiseaseList()
                return;
            } else {
                message.error(msg.msg);
                setEditingKey('');

            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };


    const columns = [
        {
            title: 'Name',
            dataIndex: 'diseaseName',
            key: 'diseaseName',
            // render: (text) => <a>{text}</a>,
            editable: true,
            width: '25%',
            ...getColumnSearchProps('diseaseName'),
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            editable: true,
            width: '15%',
            render: (text: any) => 
            <Tag color={text == true ? 'success' : 'error'}>{text == true ? 'Active' : 'InActive'}</Tag>,

        },
        {
            title: 'Disease Code ICD',
            dataIndex: 'diseaseCodeICD',
            key: 'diseaseCodeICD',
            editable: true,
            width: '20%'
        },
        {
            title: 'Disease Type',
            key: 'diseaseTypeName',
            dataIndex: 'diseaseTypeName',
            editable: true,
            width: '20%'
        },
        {
            title: 'Special Type Name',
            key: 'specialTypeId',
            dataIndex: 'specialTypeName',
            editable: true,
            width: '20%'
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            width: '10%',
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span style={{ width: 60, }}>
                        <Typography.Link onClick={() => saveDisease(record?.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link style={{ width: 100 }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'isActive' ? 'text' :
                    col.key === 'specialTypeId' ? 'select': 'string',
                dataIndex: col.key,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form
            // initialValues={{diseaseTypeID:diseaseList?.diseaseTypeID}}
            form={form}
            component={false}>
            <Card
                title="Disease List"
                style={{ boxShadow: '2px 2px 2px #4874dc' }}
            >
                <Table
                    size='small'
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}

                    dataSource={diseaseList}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Card>
        </Form>
    );
};

export default DiseaseList;