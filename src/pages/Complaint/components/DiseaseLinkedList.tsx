import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Card, Typography, Popconfirm, Checkbox, InputRef } from 'antd';
import { requestGetComplaintType, requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestAddComplaint, requestAddDisease, requestAddInvParameter, requestDiseaseList, requestDiseaseTypeList, requestGetDiseaseLink } from '../services/api';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

const { Option } = Select;

interface Item {
    key: string;
    name: string;
    isActive: any;
    address: string;
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


const DiseaseLinkedList = ({ refresh, editRecord }: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [complaintList, setComplaintList] = useState<any>([])
    const [linkedList, setLinkedList] = useState<any>([])
    const { token } = theme.useToken();
    const [editingKey, setEditingKey] = useState('');
    const [diseaseType, setDiseaseType] = useState<any>([])

    const isEditing = (record: Item) => record.key === editingKey;

    useEffect(() => {
        getDiseaseLinkedList();
        getDiseaseType();
    }, [refresh])

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };
    const getDiseaseType = async () => {
        const params = {
            "diseaseTypeID": -1,
            "specialTypeID": -1,
            "isActive": -1,
            "type": 1
        }
        const res = await requestDiseaseTypeList(params);
        console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: number) => {
                return { value: item.diseaseTypeID, label: item.diseaseTypeName }
            })
            setDiseaseType(dataMaskForDropdown)
        }
    }

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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'commonName',
            key: 'commonName',
            // width: '35%',
            ...getColumnSearchProps('complaintTypeName'),
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '15%',
            render: (text: any) =>
                <Tag color={text == "true" ? 'success' : 'error'}>{text == "true" ? 'Active' : 'InActive'}</Tag>,
            editable: true
        },
        {
            title: 'Instruction',
            dataIndex: 'instruction',
            key: 'instruction',
        },
        {
            title: 'Action',
            key: 'action',
            width: '25%',
            render: (_: any, record: any) => {
                // console.log({record:record});
                const editable = isEditing(record);
                return editable ? (
                    <span style={{ width: 60, }}>
                        <Typography.Link onClick={() => saveComplaint(record?.key)} style={{ marginRight: 8 }}>
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

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        console.log(record)
        editRecord(record)
    };

    const cancel = () => {
        setEditingKey('');
    };


    const getDiseaseLinkedList = async () => {
        const staticParams = {
            "diseaseID": 6,
            "userID": -1,
            "formID": -1,
            "type": 2
        }
        setLoading(true)
        const res = await requestGetDiseaseLink(staticParams);
        if (res?.result.length > 0) {
            setLinkedList(res?.result)
        }
        else {
            setLoading(true)
        }
        setLoading(false)
    }
    const handleChangeFilter = (data: any) => {
        console.log(data)
    }
    return (
        // <PageContainer
        //     style={{ backgroundColor: '#4874dc', height: 120 }}
        // >
        <Card
            title="Disease Linked List"
            style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
            <div style={contentStyle}>
                <Col span={8}>
                    <label>{'Select Disease'}</label><br />
                    <Select
                        style={{ width: '95%' }}
                        onChange={handleChangeFilter}
                        placeholder={"Select"}
                        options={diseaseType}
                    />
                </Col>
                <Spin tip="Please wait..." spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={linkedList}
                        pagination={{
                            onChange: cancel,
                        }}
                    />
                </Spin>
            </div>
        </Card>
        // </PageContainer>
    );
};

export default DiseaseLinkedList;