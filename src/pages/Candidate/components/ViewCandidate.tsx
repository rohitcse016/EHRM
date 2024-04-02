import { Drawer, Divider, Select, Space, Button, } from 'antd';

import { useEffect, useRef, useState } from 'react';
import '../styles/viewCandidate.css'

const moment = require('moment');
import dayjs from 'dayjs';
import { ProFormInstance } from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';

const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const ViewCandidate = ({ visible, onClose, selectedRows,editCandidate }: any) => {
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
    const editCandidateView = () => {
        editCandidate(true)
    }


    return (
        <>
            <Drawer
                title={`Candidate #${selectedRows?.candidateID}`}
                width={1000}
                onClose={onClose}
                open={visible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    editCandidate&&<Space>
                        <Button type="primary" onClick={editCandidateView}>
                            Edit
                        </Button>
                    </Space>
                }

            >
                <Divider orientation="left"><h4>Basic Information</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[
                        {
                            title: '#ID',
                            dataIndex: 'candidateID',
                            span: 3
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
                            dataIndex: 'mobileNo',
                            span: 2
                        },
                        {
                            title: 'Email ID',
                            dataIndex: 'emailID',
                            span: 2
                        },
                        {
                            title: 'DOB',
                            key: 'date',
                            dataIndex: 'dob',
                            valueType: 'date',
                            fieldProps: {
                                format: 'DD-MM-YYYY',
                            },
                        },
                    ]}
                />

                <Divider orientation="left"><h4>Identity Information</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[

                        {
                            title: 'PAN No',
                            dataIndex: 'panNo',
                            span: 2
                        },
                        {
                            title: 'Aadhaar No',
                            dataIndex: 'aadhaarNo',
                            span: 2
                        },
                        {
                            title: 'Marital Status',
                            dataIndex: 'maritalStatusName',
                            span: 2
                        },
                        {
                            title: 'Gender',
                            dataIndex: 'genderName',
                            span: 2
                        }

                    ]}
                />

                <Divider orientation="left"><h4>Institution Information</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[
                        {
                            title: 'Inst Unique ID',
                            dataIndex: 'instUiqueID',
                            span: 3
                        },
                        {
                            title: 'Inst. Name',
                            dataIndex: 'instName',
                            span: 3
                        },
                        {
                            title: 'Inst. Address',
                            dataIndex: 'instAddress',
                            span: 3
                        },

                        {
                            title: 'Branch Name',
                            dataIndex: 'branchName',
                            span: 3
                        },
                        {
                            title: 'Other Branch Name',
                            dataIndex: 'otherBranchName',
                            span: 3
                        },

                    ]}
                />


                <Divider orientation="left"><h4>Address Information</h4></Divider>
                <ProDescriptions
                    dataSource={selectedRows}
                    bordered={true}
                    size={'small'}
                    columns={[

                        {
                            title: 'State',
                            dataIndex: 'stateName',
                            span: 3
                        },

                        {
                            title: 'District',
                            dataIndex: 'districtName',
                            span: 3
                        },
                        {
                            title: 'City',
                            dataIndex: 'cityName',
                            span: 3
                        },
                        {
                            title: 'Area',
                            dataIndex: 'areaName',
                            span: 3
                        },
                        {
                            title: 'Landmark',
                            dataIndex: 'landmark',
                            span: 3
                        },
                        {
                            title: 'Candidate Address',
                            dataIndex: 'candidateAddress',
                            span: 3
                        }

                    ]}
                />

            </Drawer>
        </>
    );
};

export default ViewCandidate;