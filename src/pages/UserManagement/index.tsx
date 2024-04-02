import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Typography, Form, Input, Row, Select, Space, Modal, message, InputRef } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';

import { requestAddUser, requestGetUserList, requestGetUserinfo } from './services/api';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';

import ViewUser from './components/ViewUser';
import EditUser from './components/EditUser';
import AddUser from './components/AddUser';
import { FilterConfirmProps } from 'antd/es/table/interface';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import { requestGetDesignation, requestGetSectionTree } from '@/services/apiRequest/dropdowns';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { confirm } = Modal;
interface DataType {
  key: string;
  userName: string;
  eMail: string;
  curMobile: string;
}
type DataIndex = keyof DataType;
const UserManagement: React.FC = () => {
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openViewUser, setOpenViewUser] = useState(false);
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filtertype, setFiltertype] = useState('0');
  const [commonID, setCommonID] = useState('-1');
  const searchInput = useRef<InputRef>(null);
  const [designation, setDesignation] = useState<any>([])
  const [section, setSection] = useState<any>([])
  const [form] = Form.useForm();
  useEffect(() => {

    console.log("initialState");
    console.log(initialState);



    getDesignation();
    getSection();


    // getformidbyname()

  }, [])

  const getSection = async () => {
    const staticParams = {
      "sectionID": "-1",
      "type": "1"
    };

    const res = await requestGetSectionTree(staticParams);
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { value: item.sectionID, label: item.sectionName, sectionID: item.sectionID, sectionName: item.sectionName, plainSectionName: item.plainSectionName, sectionCode: item.sectionCode, parentSectionID: item.parentSectionID, mainSectionID: item.mainSectionID, parentMainSectionID: item.parentMainSectionID, rowID: item.rowID, depthLevel: item.depthLevel, sectionTree: item.sectionTree, sectionIDTree: item.sectionIDTree }
      })
      setSection(dataMaskForDropdown)
    }
  }
  const getDesignation = async () => {

    const staticParams = {
      DesigID: "-1",
    };
    const res = await requestGetDesignation(staticParams);
    if (res.data.length > 0) {
      const dataMaskForDropdown = res?.data?.map((item: any) => {
        return { value: item.desigID, label: item.desigName, desigID: item.desigID, desigName: item.desigName, desigCode: item.desigCode, isActive: item.isActive, priority: item.priority, desigType: item.desigType }
      })
      setDesignation(dataMaskForDropdown)
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

  const columns: ColumnsType<DataType> = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      ...getColumnSearchProps('userName'),
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'eMail',
      ...getColumnSearchProps('eMail'),
      // valueType: 'textarea',
    },
    {
      title: 'Mobile No',
      dataIndex: 'curMobile',
      ...getColumnSearchProps('curMobile'),
      sorter: true,
    },
    // {
    //   title: 'panNo',
    //   dataIndex: 'panNo',
    // },
    // {
    //   title: 'Address',
    //   dataIndex: 'instName',
    //   sorter: true,
    // },
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

  const onEdit = async (record: any) => {
    console.log(record);

    const params = {
      "sectionID": -1,
      "desigID": record.desigID,
      "userID": record.userID,
      "type": 1
    }

    const msg = await requestGetUserinfo(params);
    console.log(msg)
    setSelectedRows(msg.data[0])
    setIsEditable(true)
    setOpenEditUser(true);
  };

  const onView = async (record: any) => {
    console.log(record)

    const params = {
      "sectionID": -1,
      "desigID": record.desigID,
      "userID": record.userID,
      "type": 1
    }

    const msg = await requestGetUserinfo(params);
    console.log(msg.data)
    //  return Promise.resolve({
    //    data: msg.data,
    //    success: true,
    //  });

    console.log(record)
    setSelectedRows(msg.data[0])
    setOpenViewUser(true);
  };

  const onDelete = (record: any) => {
    console.log(record)
    setSelectedRows(record)
    showDeleteConfirm(record.userID);
  };

  const addCandidate = () => {

    setOpenAddUser(true);
    console.log(openAddUser)
    setSelectedRows({});
    setIsEditable(false)

  };

  const onCloseAddCandidate = () => {
    setOpenAddUser(false);
  };

  const onCloseEditCandidate = () => {
    setOpenEditUser(false);
  };

  const onCloseViewCandidate = () => {
    setOpenViewUser(false);
  };

  const onOpenViewCandidate = () => {
    setOpenViewUser(true)
  }

  const delUser = async (userID: any) => {
    try {

      //  const firstName = event.target.elements.firstName.value;



      console.log(userID)
      // const content = event.target.elements.content.value;
      // values['dob'] = convertDate(values['dob']);

      const staticParams = {
        "userID": userID,
        "userTypeID": "-1",
        "rankID": '-1',
        "surName": "",
        "firstName": "",
        "middleName": "",
        "shortName": "",
        "userCode": "",
        "dob": "2023-09-21T06:55:32.722Z",
        "curMobile": "",
        "eMail": "",
        "genderID": '-1',
        "sectionT": [
          {
            "sectionID": 0,
            "sectionNameTree": "",
            "sectionName": "",
            "sectionCode": "",
            "parentSectionID": 0,
            "mainSectionID": 0,
            "depthLevel": 0,
            "rowID": 0,
            "sectionIDTree": ""
          }
        ],
        "desigT": [
          {
            "desigID": 0,
            "desigName": "",
            "desigCode": "",
            "isActive": true,
            "priority": 0,
            "desigType": 0
          }
        ],
        "roleT": [
          {
            "roleID": 0,
            "type": 0
          }
        ],
        "packageT": [
          {
            "orgID": 0,
            "packageID": 0,
            "packageName": "",
            "packageURL": ""
          }
        ],
        "userLogin": "",
        "userPassword": "",
        "type": "3",
        "formID": "1"



      };

      console.log(staticParams);

      setLoading(true)

      const msg = await requestAddUser({ staticParams });
      setLoading(false)
      if (msg.isSuccess === true) {
        //formRef.current?.resetFields();
        message.success(msg.msg);
        //setOTPVisible(true);
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/list');
        //requestForOTP({ ...values, ...staticParams })
        return;
      } else {
        message.error(msg.msg);
      }

    } catch (error) {
      setLoading(false)
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Login failed, please try again!',
      });
      console.log({ error });
      message.error(defaultLoginFailureMessage);
    }
  };



  const showDeleteConfirm = (userID: any) => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
        delUser(userID)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const reloadTable = () => {
    actionRef.current.reload();
  }

  const getuserlist = async (values: any) => {
    try {

      actionRef.current.reload();

    } catch (error) {
      setLoading(false)
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Login failed, please try again!',
      });
      console.log({ error });
      message.error(defaultLoginFailureMessage);
    }
  };


  return (
    <PageContainer


    >

      {/* <Space align="baseline">
        <Button type="primary" onClick={addCandidate} icon={<PlusOutlined />}>
          New Institute User 
        </Button>
      </Space>
      <br />
      <br /> */}


      <Form
        form={form}

        onFinish={async (values) => {
          getuserlist(values)
        }} >
        <Row gutter={24}>
          <Col span={4}>
            <Form.Item
              initialValue={['0']}
              labelCol={{ span: 24 }}
              name="filtertype"
              label="Filter Type"

            // rules={[{ required: true, message: 'Please choose the Designation' }]}
            >
              <Select
                // mode="multiple"
                // style= {{ width: '100%', }}
                // maxTagCount= 'responsive'
                // allowClear
                defaultValue={["0"]}
                placeholder="Please choose the Designation"
                options={[{ value: '0', label: 'All User' }, { value: '1', label: 'Section' }, { value: '2', label: 'Designation' }]}
                onSelect={(e) => {
                  console.log(e)
                  setFiltertype(e);
                }}
              />
            </Form.Item>
          </Col>

          {filtertype == '2' ? <Col span={10}>
            <Form.Item
              labelCol={{ span: 24 }}
              name="desigT"
              label="Designation"

            // rules={[{ required: true, message: 'Please choose the Designation' }]}
            >
              <Select
                // mode="multiple"
                // style= {{ width: '100%', }}
                // maxTagCount= 'responsive'
                // allowClear
                placeholder="Please choose the Designation"
                options={designation}
                onSelect={(e) => {
                  console.log(e);
                  setCommonID(e);
                }}
              />
            </Form.Item>
          </Col> : ""}
          {filtertype == '1' ? <Col span={10}>
            <Form.Item
              labelCol={{ span: 24 }}
              name="sectionT"
              label="Section"

            //rules={[{ required: true, message: 'Please choose the Section' }]}
            >
              <Select
                style={{ width: '100%', }}
                // maxTagCount= 'responsive'
                //   mode="multiple"

                // allowClear
                placeholder="Please choose the Section"
                options={section}
                onSelect={(e) => {
                  console.log(e);
                  setCommonID(e);
                }}
              />
            </Form.Item>
          </Col> : ""}
          <Col span={4}>
            <Form.Item
              label=" "
              labelCol={{ span: 24 }}
            >

              <Button type="primary" htmlType="submit"> Search</Button>
            </Form.Item>
          </Col>
        </Row>

      </Form>



      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={<Space align="baseline">{'User List'}
          <Button type="primary" onClick={addCandidate} icon={<PlusOutlined />}>
            {'New User'}
          </Button>
        </Space>}
        // headerTitle={'Institute User List'}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        request={async (

        ) => {
          // Here you need to return a Promise, and you can transform the data before returning it
          // If you need to transform the parameters you can change them here
          const params = {
            "CommonID": commonID,
            "type": filtertype
          }
          console.log(params);
          const msg = await requestGetUserList(params);
          console.log(msg.data)
          return Promise.resolve({
            data: msg.data,
            success: true,
          });
        }}
        columns={columns}
      />
      <AddUser
        visible={openAddUser}
        onClose={onCloseAddCandidate}
        onSaveSuccess={reloadTable}
        selectedRows={selectedRows}
        //onSaveSuccess={(v)=>(console.log(v))}
      // isdrawer={true}
      />
      <EditUser
        visible={openEditUser}
        onClose={onCloseEditCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      />
      <ViewUser
        visible={openViewUser}
        onClose={onCloseViewCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />
    </PageContainer>
  );
};

export default UserManagement;