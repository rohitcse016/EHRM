import React, { useRef, useState } from 'react';
import './index.css';
import { Button, Select, Space, Modal, Typography } from 'antd';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { requestGetCandidateList } from './services/api';
import { EditOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import ViewCandidate from './components/ViewCandidate';
import EditCandidate from './components/EditCandidate';

const { Option } = Select;
const { confirm } = Modal;
const { Title, Text, Link } = Typography;


const Candidate: React.FC = () => {
  const [openEditCandidate, setOpenEditCandidate] = useState(false);
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [openViewCandidate, setOpenViewCandidate] = useState(false);
  const actionRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'Candidate Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Email',
      dataIndex: 'emailID',
      valueType: 'textarea',
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo',
      sorter: true,
    },
    {
      title: 'panNo',
      dataIndex: 'panNo',
    },
    {
      title: 'Inst. Name',
      dataIndex: 'instName',
      sorter: true,
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
    setOpenEditCandidate(true);
  };

  const onView = (record: any) => {
    console.log(record)
    setSelectedRows(record)
    setOpenViewCandidate(true);
  };

  const onDelete = (record: any) => {
    setSelectedRows(record)
    showDeleteConfirm();
  };

  const addCandidate = () => {
    setSelectedRows({});
    setIsEditable(false)
    setOpenAddCandidate(true);
  };

  const onCloseAddCandidate = () => {
    setOpenAddCandidate(false);
  };

  const onCloseEditCandidate = () => {
    setOpenEditCandidate(false);
  };

  const onCloseViewCandidate = () => {
    setOpenViewCandidate(false);
  };

  const onOpenViewCandidate = () => {
    setOpenViewCandidate(true)
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

  return (
    <PageContainer
    header={{
      title: ``,
    }}
    // header={{
    //   title: <Space direction="vertical">
    //     <Title level={3}>{"Candidate List"}</Title>
    //   </Space>,
    //   breadcrumb: {
    //     items: [],
    //   },
    // }}
    >
      <ProTable<API.RuleListItem, API.PageParams>
        actionRef={actionRef}
        rowKey="key"
        search={false}
        request={async (

        ) => {
          // Here you need to return a Promise, and you can transform the data before returning it
          // If you need to transform the parameters you can change them here

          const params = {
            "candidateID": "-1",
            "uniqueNo": "",
            "emailID": "",
            "mobileNo": "",
            "dob": "",
            "panNo": "",
            "aadhaarNo": "",
            "genderID": "-1",
            "stateID": "-1",
            "districtID": "-1",
            "cityID": "-1",
            "areaID": "-1",
            "searchText": "",
            "userID": "-1",
            "formID": "-1",
            "type": "1"
          }

          const msg = await requestGetCandidateList(params);
          console.log(msg.data)
          return Promise.resolve({
            data: msg.data,
            success: true,
          });
        }}

        columns={columns}
      />

      <EditCandidate
        visible={openEditCandidate}
        onClose={onCloseEditCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
        onSaveSuccess={reloadTable}
      />
      <ViewCandidate
        visible={openViewCandidate}
        onClose={onCloseViewCandidate}
        isEditable={isEditable}
        selectedRows={selectedRows}
      />
    </PageContainer>
  );
};

export default Candidate;