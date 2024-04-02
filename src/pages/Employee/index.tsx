import React, { useRef, useState } from 'react';
import { Button, Select, Space, Modal, Typography, Table, Input, Row, Col, Tag } from 'antd';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { EditOutlined, ExclamationCircleFilled, EyeOutlined, FilterOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { requestGetEmployeeList } from './services/api';
import { SearchProps } from 'antd/es/input';
import EmployeeFilter from '@/components/Filters/EmployeeFilter';
import moment from 'moment';
import { history } from '@umijs/max';


const { Option } = Select;
const { confirm } = Modal;
const { Search } = Input;
const { Title, Text, Link } = Typography;


const Employee: React.FC = () => {
  const [openEditEmployee, setOpenEditEmployee] = useState(false);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [openViewEmployee, setOpenViewEmployee] = useState(false);
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [openEmployeeFilter, setOpenEmployeeFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>({ keyword: "" });

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'Employee Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Department',
      dataIndex: 'department',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Email',
      dataIndex: 'emailID',
      valueType: 'textarea',
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo',
    },
    {
      title: 'Joining Date',
      dataIndex: 'doj',
      render: (text: any) => <Typography>{moment(text).format('DD MMM YYYY')}</Typography>,
      sorter: true,
    },
    {
      title: <Col><Row>isApproved</Row>
                {/* <Row><Tag color={'success'}>{'Appvd'}</Tag>
                <Tag color={'error'}>{'Not Appvd'}</Tag>
                <Tag >{'All'}</Tag>
                </Row> */}
              </Col>,
      dataIndex: 'isApproved',
      render: (text: any) => <Tag color={text==true ? 'success' : "error"}>{text==true ? 'Approved' : 'Not Approved'}</Tag>,
      filters: [{ text: <Tag color={'success'}>{'Approved'}</Tag>, value: true },{ text: <Tag color={'error'}>{'Not Approved'}</Tag>, value: false }]
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size={"small"} onClick={() => onView(record)} icon={<EyeOutlined />} />
          <Button type="primary" size={"small"} onClick={() => onEdit(record)} icon={<EditOutlined />} />
          {/* <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} /> */}
        </Space>
      ),
    },
  ];

  const onEdit = (record: any) => {
    setSelectedRows(record)
    setIsEditable(true)
    setOpenEditEmployee(true);
    history.push(
      `/employee/registration`,
      {empCode:record.empCode}
    )
  };

  const onView = (record: any) => {
    console.log(record)
    setSelectedRows(record)
    setOpenViewEmployee(true);
  };

  const onDelete = (record: any) => {
    setSelectedRows(record)
    showDeleteConfirm();
  };

  const addEmployee = () => {
    history.push(
      `/employee/registration`
    )
    setSelectedRows({});
    setIsEditable(false)
    setOpenAddEmployee(true);
  };

  const onCloseAddEmployee = () => {
    setOpenAddEmployee(false);
  };

  const onCloseEditEmployee = () => {
    setOpenEditEmployee(false);
  };

  const onCloseViewEmployee = () => {
    setOpenViewEmployee(false);
  };

  const onOpenViewEmployee = () => {
    setOpenViewEmployee(true)
  }

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const reloadTable = () => {
    actionRef.current.reload();
  }
  const onSearch: SearchProps['onSearch'] = (value: any, _e, info) => setParams({ keyword: value });

  const onCloseEmployeeFilter = () => {
    setOpenEmployeeFilter(false);
  };
  const onFilter = async (value: any) => {
    console.log('onFilter', value);
    await setParams(value);
    reloadTable()
    // await searchPatient(value)
    setOpenEmployeeFilter(false);
  }

  return (
    <PageContainer
      header={{
        title: ``,
      }}
    // header={{
    //   title: <Space direction="vertical">
    //     <Title level={3}>{"Employee List"}</Title>
    //   </Space>,
    //   breadcrumb: {
    //     items: [],
    //   },
    // }}
    >
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
            <Search placeholder="search text" onSearch={onSearch} enterButton={
              <Button
                onClick={reloadTable}
                style={{ backgroundColor: '#3f51b5' }}
                icon={<SearchOutlined style={{ color: 'white' }} />} />
            } ></Search>
          </Row>
        </Col>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{ borderRadius: 48, backgroundColor: '#3f51b5', width: '48px', height: '48px' }}
              onClick={addEmployee}
              icon={<PlusOutlined style={{ color: 'white' }} />}
            />,
            <Button onClick={reloadTable} style={{ borderRadius: 48, backgroundColor: '#3f51b5', width: '48px', height: '48px' }}
              icon={<ReloadOutlined style={{ color: 'white' }} />} ></Button>
            <Button onClick={() => { setOpenEmployeeFilter(true); }} style={{ borderRadius: 48, backgroundColor: '#3f51b5', width: '48px', height: '48px' }}
              icon={<FilterOutlined style={{ color: 'white' }} />} ></Button>
          </div>
        </Col>
      </Row>
      <ProTable<API.RuleListItem, API.PageParams>
        params={params}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        request={async (params: any, sort, filter) => {
          console.log(params,sort,filter)
          // Here you need to return a Promise, and you can transform the data before returning it
          // If you need to transform the parameters you can change them here

          const param = {
            "empID": -1,
            "empCode": params?.keyword,
            "empName": params?.keyword,
            "mobileNo": "",
            "emailID": "",
            "genderID": -1,
            "bloodGroupID": -1,
            "maritalStatusID": -1,
            "empCategoryID": -1,
            "empTypeID": -1,
            "deptID": -1,
            "desigID": -1,
            "workingStatusID": -1,
            "shiftID": -1,
            "isApproved": filter?.isApproved?.length==1 ? Number(filter?.isApproved[0]) :-1,
            "userID": "-1",
            "formID": "-1",
            "type": "1"
          }

          const msg = await requestGetEmployeeList({ ...param,...params });
          return Promise.resolve({
            data: msg.result,
            success: msg.isSuccess,
          });
        }}

        columns={columns}

        // headerTitle={''}
        toolbar={{
          // search: {
          //   enterButton: <Button style={{ backgroundColor: '#3f51b5' }} icon={<SearchOutlined style={{ color: 'white' }} />} />,
          //   onSearch: (value: string) => {
          //     alert(value);
          //   },
          // },
          actions: [
            // <Button
            //   key="primary"
            //   type="primary"
            //   style={{ borderRadius: 50, backgroundColor: '#3f51b5' }}
            //   onClick={() => {
            //     alert('add');
            //   }}
            //   icon={<PlusOutlined />}
            // />,
          ],
          settings: [
            // {
            //   icon: <Button style={{ borderRadius: 50, backgroundColor: '#3f51b5' }} icon={<ReloadOutlined style={{ color: 'white' }} />} />,
            //   tooltip: 'Reload',
            // },
          ]
        }}
        // rowSelection={{
        //   selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        //   // defaultSelectedRowKeys: [1],
        // }}
      />
      <EmployeeFilter
        visible={openEmployeeFilter}
        onClose={onCloseEmployeeFilter}
        onFilter={onFilter}
        loading={loading}
      />
      {/* <EditEmployee
        visible={openEditEmployee}
        onClose={onCloseEditEmployee}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      />
      <ViewEmployee
        visible={openViewEmployee}
        onClose={onCloseViewEmployee}
        isEditable={isEditable}
        selectedRows={selectedRows}
      /> */}
    </PageContainer>
  );
};

export default Employee;