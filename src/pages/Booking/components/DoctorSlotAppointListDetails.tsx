import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Modal, theme, Spin, Card } from 'antd';
import { requestGetRateType, requestGetRoomType } from '@/services/apiRequest/dropdowns';
import { requestGetInstituteList } from '@/pages/Institute/services/api';
import {
    ActionType,
    FooterToolbar,
    PageContainer,
    ProColumns,
} from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { FormattedMessage, history } from '@umijs/max';
import { convertDate, convertTime } from '@/utils/helper';
import { activeStatus, activeStatusOnly, dateFormat } from '@/utils/constant';
import { requestAddPatDocAppointments, requestGetPatDocAppointment } from '../services/api';
import dayjs from 'dayjs';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { FilterConfirmProps } from 'antd/es/table/interface';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const DoctorSlotAppointListDetails = React.forwardRef((props) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { token } = theme.useToken();
    const [list, setList] = useState([]);
    const [selectedRowsState, setSelectedRows] = useState<any>([]);
    const [result, setResult] = useState<any[]>([]);
    const actionRef = useRef<ActionType>();
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isActive, setIsActive] = useState("");
    const [selectedIsActive, setSelectedIsActive] = useState(0);
    const [userSlotId, setUserSlotId] = useState("");
    const [docUserID, setDocUserID] = useState("");

    const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
    };

    useEffect(() => {
        const docUserID = history.location.pathname.split('/')[3];
        const userSlotId = history.location.pathname.split('/')[4];
        const fromDate = history.location.pathname.split('/')[5];
        const toDate = history.location.pathname.split('/')[6];
        const isActive = history.location.pathname.split('/')[7];
        setUserSlotId(userSlotId)
        setDocUserID(docUserID)
        setFromDate(fromDate)
        setToDate(toDate)
        setIsActive(fromDate)
        console.log({ fromDate, toDate, isActive, docUserID, userSlotId })
        const data = { fromDate, toDate, isActive, docUserID, userSlotId };
        getList(data);
    }, [])
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
    const columns: ProColumns<any>[] = [
        {
            title: 'Name',
            dataIndex: 'userName',
            key: 'userName',
            render: (text) => <a>{text}</a>,
            ...getColumnSearchProps('userName'),
        },
        {
            title: 'Slot Date',
            dataIndex: 'displaySlotDate',
            key: 'displaySlotDate',
        },
        {
            title: 'Slot From Time',
            key: 'displaySlotFromTime',
            dataIndex: 'displaySlotFromTime',

        },
        {
            title: 'Free',
            key: 'isFree',
            dataIndex: 'isFree',
            render: (text) => <a>{text ? <Tag color="green">Yes</Tag> : <Tag color="magenta">No</Tag>}</a>,
        },
        {
            title: 'Active',
            key: 'isActive',
            dataIndex: 'isActive',
            render: (text) => <a>{text ? <Tag color="green">Yes</Tag> : <Tag color="magenta">No</Tag>}</a>,
        }
    ];

    useEffect(() => {

    }, [])

    const getList = async ({ fromDate, toDate, isActive, docUserID, userSlotId }: any) => {
        try {
            const staticParams = {
                userSlotID: userSlotId,
                docUserID: docUserID,
                slotFromDate: fromDate,
                slotToDate: toDate,
                isActive: isActive,
                sectionID: -1,
                fromHrs: '',
                toHrs: '',
                showAll: 0,
                userID: -1,
                formID: -1,
                mainType: 1,
                type: 2
            };

            setLoading(true)
            const response = await requestGetPatDocAppointment({ ...staticParams });
            setLoading(false)
            const data = response?.result.map((item: any, index: number) => {
                return { key: index + 1, ...item }
            });
            setList(data);
            if (!response?.isSuccess) {
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



    const submitDelete = async () => {


        const userWeekSlotID = selectedRowsState.map((row: any) => {
            return row.userWeekSlotID
        })

        console.log({ userWeekSlotID: userWeekSlotID.toString() });

        const requestParams = {
            userSlotID: userSlotId,
            docUserID: docUserID,
            noOfSlotPerHrs: 3,
            slotFromDate: fromDate,
            slotToDate: toDate,
            fromHrs: '00:00:00',
            toHrs: '00:00:00',
            isActive: selectedIsActive == 0 ? false : true,
            isForDelete: false,
            userWeekSlotID: userWeekSlotID.toString(),
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
                history.push('/booking/doctor-slot-booking');
            } else {
                message.error(response?.msg);
            }
        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error(error);
        }
    }

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: any) => {
            const rowIndex = list.findIndex((item) => item.key === record.key);
            return {
                disabled: !record.isFree//enable first 2 rows only
            };
        }
    };

    const handleChangeStatus = (value: { value: string; label: React.ReactNode }) => {
        console.log({ value });
        setSelectedIsActive(value)
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

    
    
    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure delete this Slot?',
            icon: <ExclamationCircleFilled />,
            content: `Slot From ${moment(fromDate).format(dateFormat)} to ${moment(toDate).format(dateFormat)}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                submitDelete();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };


    return (
        <PageContainer
        >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title={`Slot From ${moment(fromDate).format(dateFormat)} to ${moment(toDate).format(dateFormat)}`}
                    style={{ boxShadow: '2px 2px 2px #4874dc' }}
                >
                    <div style={contentStyle}>
                        <Table
                            rowSelection={{
                                type: selectionType,
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={list}
                        />
                    </div>
                </Card>
            </Space>
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
                            <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                            <FormattedMessage id="pages.searchTable.item" defaultMessage="item" />
                        </div>
                    }
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Status"
                        optionFilterProp="children"
                        options={activeStatusOnly}
                        size={'middle'}
                        defaultValue={selectedIsActive}
                        onChange={handleChangeStatus}
                    />
                    <Button type="primary"
                        onClick={async () => {
                            showDeleteConfirm()
                        }}
                    >
                        <label>Submit</label>
                    </Button>
                </FooterToolbar>
            )}
        </PageContainer>

    );
});

export default DoctorSlotAppointListDetails;

function handleReset(clearFilters: () => void): void {
    throw new Error('Function not implemented.');
}
