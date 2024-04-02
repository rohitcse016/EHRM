import { Drawer, Divider, Select, Table, } from 'antd';

import { useEffect, useRef, useState } from 'react';


const moment = require('moment');
import dayjs from 'dayjs';
import { ProFormInstance } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const ViewUser = ({ visible, onClose, selectedRows }: any) => {
    const formRef = useRef<ProFormInstance>();

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        marginTop: 60,
        height: 300,
    };


    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }

    const desigcolumns = [
        {
          title: 'Designation Name',
          dataIndex: 'desigName',
         
        },
        {
          title: 'Designation Code',
          dataIndex: 'desigCode',
          
        },
        {
          title: 'Designation Type',
          dataIndex: 'desigType',
         
        },
        {
          title: 'Status',
          colSpan: 2,
          dataIndex: 'isActive',
         
        },
      ];

      const packagecolumns = [
        {
          title: 'Package Name',
          dataIndex: 'packageName',
         
        },
        {
          title: 'Package URL',
          dataIndex: 'packageURL',
          
        },
      ];
      const rolecolumns = [
        {
          title: 'Package Name',
          dataIndex: 'roleName',
         
        },
      
      ];

      const sectioncolumns = [
        {
          title: 'Section Name',
          dataIndex: 'sectionName',
         
        },
        {
          title: 'Section Code',
          dataIndex: 'sectionCode',
          
        },
        {
          title: 'Depth Level',
          dataIndex: 'depthLevel',
         
        },
      ];

    return (
        <>
            <Drawer
                title={`User #${selectedRows?.userID}`}
                width={1000}
                onClose={onClose}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}

            >
                <Divider orientation="left"><h4>Basic Information</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[
                        {
                            title: '#ID',
                            dataIndex: 'userID',
                            span: 2
                        },
                        {
                            title: 'User Code',
                            dataIndex: 'userCode',
                            span: 2
                        },
                        {
                            title: 'Login Name',
                            dataIndex: 'loginName',
                            span: 2
                        },
                        {
                            title: 'Login Password',
                            dataIndex: 'loginPassword',
                            span: 2
                        },
                        {
                            title: 'First Name',
                            dataIndex: 'firstName',
                            span: 3
                        },
                        {
                            title: 'Middle Name',
                            dataIndex: 'middleName',
                            span: 3
                        },
                        {
                            title: 'Last Name',
                            dataIndex: 'lastName',
                            span: 3
                        },
                        {
                            title: 'Mobile No',
                            dataIndex: 'curMobile',
                            span: 2
                        },
                        {
                            title: 'Email ID',
                            dataIndex: 'eMail',
                            span: 2
                        },

                        {
                            title: 'Gender',
                            dataIndex: 'genderName',
                            span: 2
                        },
                        {
                            title: 'DOB',
                            dataIndex: 'dob',
                            span: 2
                        },

                        {
                            title: 'Rank Name',
                            dataIndex: 'rankName',
                            span: 2
                        },
                        
                    ]}
                />



<Divider orientation="left"><h4> Designation </h4></Divider>
<Table columns={desigcolumns} dataSource={selectedRows.desigT} bordered pagination={false}  />

<Divider orientation="left"><h4> Section </h4></Divider>
<Table columns={sectioncolumns} dataSource={selectedRows.sectionT} bordered pagination={false}  />

<Divider orientation="left"><h4> Packages </h4></Divider>
<Table columns={packagecolumns} dataSource={selectedRows.packageT} bordered pagination={false}  />
<Divider orientation="left"><h4> Role </h4></Divider>
<Table columns={rolecolumns} dataSource={selectedRows.roleT} bordered pagination={false}  />


            </Drawer>
        </>
    );
};

export default ViewUser;