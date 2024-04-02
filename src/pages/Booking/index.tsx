import React, { useRef, useState } from 'react';
import './index.css';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Modal, Tag } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProList
} from '@ant-design/pro-components';
import { history } from 'umi';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { requestGetInstituteList } from '../Institute/services/api';
const { Option } = Select;
const { confirm } = Modal;


type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};


const Booking: React.FC = () => {

  const [instituteList, setInstituteList] = useState<any>([])


  return (
    <PageContainer>
      <ProList<GithubIssueItem>
        toolBarRender={() => {
          return [
            <Button key="3" type="primary">
              BT
            </Button>,
          ];
        }}
        search={{
          filterType: 'light',
        }}
        rowKey="name"
        headerTitle="Institution List"
        pagination={{
          pageSize: 5,
        }}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'user',
            title: 'user',
          },
          avatar: {
            dataIndex: 'avatar',
            search: false,
          },
          description: {
            dataIndex: 'title',
            search: false,
          },
          subTitle: {
            dataIndex: 'labels',
            render: (_, row) => {
              return (
                <Space size={0}>
                  {row.labels?.map((label: { name: string }) => (
                    <Tag color="blue" key={label.name}>
                      {label.name}
                    </Tag>
                  ))}
                </Space>
              );
            },
            search: false,
          },
          actions: {
            render: (text, row) => [
              <Button key="3" type="primary" onClick={()=>{
                // 
                history.push('/booking/institute-details');
              }}>
                View
              </Button>,
            ],
            search: false,
          },
          status: {
            // Self-extended fields, mainly used for filtering, not displayed in the list
            title: 'state',
            valueType: 'select',
            valueEnum: {
              all: { text: 'all', status: 'Default' },
              open: {
                text: 'unsolved',
                status: 'Error',
              },
              closed: {
                text: 'solved',
                status: 'Success',
              },
              processing: {
                text: 'Solving',
                status: 'Processing',
              },
            },
          },
        }}
      />
    </PageContainer>
  );
};

export default Booking;