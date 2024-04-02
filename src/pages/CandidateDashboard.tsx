import React, { useRef, useState, useEffect } from 'react';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Image, Divider, Space, Avatar, Typography, Row, Col, Progress, Spin, Table, Button, message, Tag } from 'antd';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList } from './Candidate/services/api';
import { DownloadOutlined, InsertRowAboveOutlined, PrinterOutlined, UserOutlined } from '@ant-design/icons';
import Chart from 'react-google-charts';
import { onlinePatientAppoinmentReceipt } from '@/services/apiRequest/api';
const { Title, Text, Link } = Typography;

const CandidateDashboard: React.FC = () => {

  const [selectedRows, setSelectedRows] = useState<Object>({});
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [patientVisits, setPatientVisits] = useState<any>([]);
  const [analysis, setAnalysis] = useState<any>([]);
  const [loading, setLoading] = useState(false)
  const [printDataRecord, setPrintDataRecord] = useState([])
  const [base64Data, setBase64Data] = useState<string>();
  const [showPdf, setShowPdf] = useState<any>(false);


  useEffect(() => {
    getOnlinePatient(1);
    getOnlinePatient(2);
  }, [])

  useEffect(() => {
  }, [loading])

  const getOnlinePatient = async (type: any = 1) => {
    const { verifiedUser } = getUserInLocalStorage();

    const params = {
      "onlinePatientID": verifiedUser?.userID,
      "userID": -1,
      "formID": -1,
      "type": type
    }
    const res = await requestGetCandidateList(params);


    type == 1 ? setSelectedRows(res.result[0]) :
      setAppointmentHistory(res.result)
    setPatientVisits(res?.result1)
    if (type == 2) {
      const dataMaskForDropdown = res?.result2?.map((item: any) => {
        analysis.push([item.yearData, item.visitCount])
      })
    }
    console.log(analysis)
  }
  const columns = [
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Patient No',
      key: 'patientNo',
      dataIndex: 'patientNo',
    },
    {
      title: 'Slot Date',
      dataIndex: 'slotDateVar',
      key: 'slotDateVar',
    },
    {
      title: 'Slot Time',
      dataIndex: 'slotTimeVar',
      key: 'slotTimeVar',
    },
    {
      title: 'Week',
      key: 'weekName',
      dataIndex: 'weekName',
    },
    {
      width: '12%',
      title: 'Slot Expired',
      key: 'isExpired',
      dataIndex: 'isExpired',
      render: (text: any) =>
        <Tag color={text == true ? "error" : "success"}>{text == true ? "Yes" : "No"}</Tag>
    },
    {
      width: '12%',
      title: 'Print',
      key: 'print',
      render: (_: any, record: any) => <PrinterOutlined onClick={() => printData(record)} style={{ fontSize: 25 }} />
    },
  ];
  const columns1 = [
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Patient CaseNo',
      dataIndex: 'patientCaseNo',
      key: 'patientCaseNo',
    },
    {
      title: 'Admission No',
      dataIndex: 'admNo',
      key: 'admNo',
    },
    {
      title: 'Visit Date',
      key: 'actualVisitDateVar',
      dataIndex: 'actualVisitDateVar',
    },
    {
      title: 'Type Name',
      key: 'vPreEmpTypeName',
      dataIndex: 'vPreEmpTypeName',
    },
    {
      width: '12%',
      title: 'Consultancy Paid',
      key: 'isConsultencyPaid',
      dataIndex: 'isConsultencyPaid',
      render: (text: any) =>
        <Tag color={text == false ? "error" : "success"}>{text == true ? "Yes" : "No"}</Tag>
      // <Typography style={{
      //   textAlign: 'center', borderRadius: 10,
      //   backgroundColor: text == false ? '#00FF00' : '#EBEBE4',
      // }}>{text == true ? "Yes" : "No"}</Typography>,
    },
    // {
    //   width: '12%',
    //   title: 'Print',
    //   key: 'print',
    //   render: (_: any, record: any) => <PrinterOutlined onClick={() => {
    //     printData(record)
    //   }} style={{ fontSize: 25 }} />
    // },
  ];
  const data = [
    ["Pizza", "Popularity"],
    ["Visits", 33],
    ["Appointments", 26],
    ["Year", 22],
    ["Sausage", 10], // Below limit.
    ["Anchovies", 9], // Below limit.
  ];

  const printData = async (record: any) => {
    await setTimeout(setPrintDataRecord(record), 3000);
    setLoading(true)

    var printContents = document.getElementById("printData").innerHTML;
    // var WinPrint = window.open('', '', );
    //   WinPrint?.document.write(printContent!);
    //   WinPrint?.document.close();
    //   WinPrint?.focus();
    //   WinPrint?.print();
    //   WinPrint?.close();
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.focus();
    window.print();
    window.close();
    document.body.innerHTML = originalContents;
    setLoading(true);
  }

  const { verifiedUser } = getUserInLocalStorage();
  const syncPatient = async (v: any) => {
    // console.log(v)
    const staticParams = {
      "onlinePatientID": verifiedUser?.userID,
      "patientNo": v?.patientNo,
      "patientCaseNo": "",
      "admNo": -1,
      "userID": -1,
      "formID": -1,
      "type": 1
    }
    // const res = await requestSyncOnlinePatient(staticParams);
    // if (res.isSuccess === true) {
    //   message.success(res.msg);
    //   return;
    // } else {
    //   message.error(res.msg);
    // }

  };
  const printReport = async () => {
    try {
      setLoading(true);
      const staticParams = {
        "onlinePatientID": verifiedUser?.userID,
        "userID": -1, "formID": -1, "type": 2,
        "show": false,
        "exportOption": ".pdf"
      }
      const res = await onlinePatientAppoinmentReceipt(staticParams);
      setBase64Data(res)
      setShowPdf(true)
      if (res.isSuccess === true) {
        setLoading(false)
      }
      setLoading(false)
    } catch (error) {
      console.log({ error });
      message.error('please try again');
      setLoading(false)
    }
  }
  const handleCancel = () => {
    setShowPdf(false);
  };
  const options = {
    title: "Analysis of visits",
    sliceVisibilityThreshold: 0.2, // 20%
  };
  return (
    <PageContainer
      loading={loading}
      header={{
        title: ``,
        breadcrumb: {
          items: [],
        },
      }}
    >
      {console.log(base64Data)}
      <Card>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>

          <Space align="center" size={24}>
            {/* <Avatar size={160} 
              src={selectedRows?.profileImage ?
                            `data:image/png;base64,${selectedRows?.profileImage}`
                        : "https://bootdey.com/img/Content/avatar/avatar6.png"}
            /> */}
            <Progress size={160} type="circle" percent={selectedRows?.profilePercentage}
              format={() => <Avatar size={145}
                //icon={
                // <Image
                //   src={`data:image/png;base64,${selectedRows?.profileImage}`}
                //   width={200}
                // />}
                src={selectedRows?.profileImage ?
                  `data:image/png;base64,${selectedRows?.profileImage}`
                  : "https://bootdey.com/img/Content/avatar/avatar6.png"}
              />} >

            </Progress>
          </Space>
          <Space align="center" size={24}>
            <Title>{`${selectedRows?.fName ? selectedRows?.fName : ""} ${selectedRows?.mName ? selectedRows?.mName : ""} ${selectedRows?.lName ? selectedRows?.lName : ""}`}</Title>
          </Space>
        </div>

        <Divider orientation="left"><h4>Basic Information</h4></Divider>
        <ProDescriptions
          dataSource={selectedRows}
          bordered={true}
          size={'small'}
          columns={[
            {
              title: 'First Name',
              dataIndex: 'fName',
              span: 3
            },
            {
              title: 'Middle Name',
              dataIndex: 'mName',
              span: 3
            },
            {
              title: 'Last Name',
              dataIndex: 'lName',
              span: 3
            },
            {
              title: 'Mobile No',
              dataIndex: 'curMobileNo',
              span: 2
            },
            // {
            //   title: 'Email ID',
            //   dataIndex: 'emailID',
            //   span: 2
            // },
            {
              title: 'DOB',
              key: 'date',
              dataIndex: 'dob',
              valueType: 'date',
              fieldProps: {
                format: 'DD-MMM-YYYY',
              },
            },
          ]}
        />
        <Divider orientation="left"><h4></h4></Divider>
        <Card
          // title="Appointment Data"
          title={<Space style={{ justifyContent: 'space-between', width: '95%' }}>
            <Typography>Appointment List</Typography>
            <Button onClick={() => printReport()}><DownloadOutlined /></Button></Space>}
          style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
          <Spin tip="Please wait..." spinning={loading}>
            <Table
              dataSource={appointmentHistory}
              columns={columns}
              rowClassName="editable-row"
              pagination={{
                // onChange: cancel,
              }}
            />
          </Spin>
        </Card>
        <Divider orientation="left"><h4></h4></Divider>
        <Card
          title="Patient Visits"
          style={{ boxShadow: '2px 2px 2px #4874dc' }}
        >
          <Spin tip="Please wait..." spinning={loading}>
            <Table
              dataSource={patientVisits}
              columns={columns1}
              rowClassName="editable-row"
            // pagination={{
            // onChange: cancel,
            // }}
            />
          </Spin>
        </Card>



        {/* <div  hidden={true} id="printData">
          <h2 style={{ color: "green" }}>EIEHR</h2>
          <table>
            <tbody>
              <tr>
                <th>Patient Name: {selectedRows?.fName}</th>
              </tr>
              <tr>
                <td>Doctor Name: {printDataRecord.doctorName}</td>
              </tr>
              <tr>
                <td>Visit Date: {printDataRecord.slotDateVar}</td>
              </tr>
              
            </tbody>
          </table>
        </div> */}



        <div hidden={true} id="printData">



          <div id="mid">
            <div style={{
              display: 'block',
              border: '1px solid black', borderRadius: 10
            }}>
              <div style={{
                marginLeft: 20,
                marginRight: 20,
              }}>

                <Row style={{ justifyContent: 'center', textAlign: 'center', marginTop: 10 }}>
                  <h2>MultiFacet Systems Software Pvt Ltd</h2>
                </Row>

                <Col style={{ marginTop: 10 }}>
                  <h2>BR Super Specialty Hospital</h2>
                  <h3>{printDataRecord.doctorName}</h3>
                  <h3>{'abc@gmail.com'}</h3>
                  <h3>{'www.multifacet.com'}</h3>
                </Col>
                <Row style={{ justifyContent: 'space-between' }}>
                  {/* <h4>Doctor Name :</h4>
                <h4>{printDataRecord.doctorName}</h4> */}
                  <Divider><h4></h4></Divider>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <h4>Doctor Name :</h4>
                  <h4>{printDataRecord.doctorName}</h4>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <h4>Patient Name :</h4>
                  <h4>{selectedRows?.fName}</h4>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <h4>Patient No :</h4>
                  <h4>{printDataRecord?.patientNo}</h4>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <h4>Slot Date:</h4>
                  <h4>{printDataRecord?.slotDateVar}</h4>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <h4>Slot Time :</h4>
                  <h4>{printDataRecord?.slotTimeVar}</h4>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <h4>Week :</h4>
                  <h4>{printDataRecord?.weekName}</h4>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <h4>Slot Expired :</h4>
                  <h4>{printDataRecord?.isExpired ? "Yes" : "No"}</h4>
                </Row>

                <div id="legalcopy">
                  <p class="legal"><strong>Thank you for being a customer with us!</strong>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div >





        <Divider orientation="left"><h4></h4></Divider>
        <div>
          <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
            height={"400px"}
          />
        </div>
      </Card >
    </PageContainer >
  );
};

export default CandidateDashboard;
