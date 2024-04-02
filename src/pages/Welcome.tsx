import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col } from 'antd';
import { getUserInLocalStorage, getUserType } from '@/utils/common';
import { requestGetCandidateList } from './Candidate/services/api';
import { AlipayOutlined, UserOutlined } from '@ant-design/icons';
const { Title, Text, Link } = Typography;

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [patientData, setPatientData] = useState<any>();

  useEffect(() => {
    // getUserDetails();
  }, [])

  const getUserDetails = async () => {
    const { verifiedUser } = getUserInLocalStorage();

    const params = {
      "candidateID": verifiedUser?.userID,
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
      "userID": verifiedUser?.userID,
      "formID": "-1",
      "type": "2"
    }
    const msg = await requestGetCandidateList(params);
    setSelectedRows(msg.data[0])
  }

  return (
    <PageContainer
      header={{
        title: ``,
        breadcrumb: {
          items: [],
        },
      }}
    >
      {/* {getUserType() === "Admin" ? 
                <PatientDetailsCommon patData={patientData}
                onChange={(value: any) => setPatientData(value)} /> : null} */}
    </PageContainer>
  );
};

export default Welcome;
