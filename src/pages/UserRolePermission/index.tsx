import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
    StepsForm,
} from '@ant-design/pro-components';
import { Button, Col, DatePicker, Drawer, Form,Typography, Input, Row, Select, Space, message, Steps, theme, Spin, InputNumber, Tabs } from 'antd';

import { SetStateAction, useEffect, useRef, useState } from 'react';
import { requestAddUser, requestAddUserFormRight, requestAddUserRolePermission } from './services/api';
import { FormattedMessage, history, SelectLang, useIntl , useModel, Helmet } from '@umijs/max';
const moment = require('moment');
import dayjs from 'dayjs';
import { requestGetArea, requestGetBranch, requestGetCity, requestGetDesignation, requestGetDistrict, requestGetForm, requestGetGender, requestGetMarital, requestGetMmodule, requestGetOrg, requestGetPackages, requestGetRank, requestGetRole, requestGetRoleBAction, requestGetSection, requestGetSectionTree, requestGetState, requestGetUserType } from '@/services/apiRequest/dropdowns';
import { useEmotionCss } from '@ant-design/use-emotion-css';

import { forEach, functions } from 'lodash';
import Checkbox from 'antd/lib/checkbox';
import Card from 'antd/lib/card';
//import jwt from 'jwt-decode'
//import { fetchMenuData, currentUser as queryCurrentUser } from '../services/apiRequest/api';


const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';
const CheckboxGroup = Checkbox.Group;
const plainOptions: string | SetStateAction<any[]> | undefined = [];
const defaultCheckedList: any[] | (() => any[]) = [];
const UserRolePermission = ({ visible, onClose, selectedRows, isEditable, onSaveSuccess, isdrawer  }: any) => {
    const formRef = useRef<ProFormInstance>();
    const { token } = theme.useToken();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState<any>([])
    const [role, setRole] = useState<any>([])
    const [roleBAction, setRoleBAction] = useState<any>([])
 
    const [designation, setDesignation] = useState<any>([])
    const [section, setSection] = useState<any>([])
    const [rank, setRank] = useState<any>([]);
    const [forms, setForms] = useState<any>([]);
    
    const [org, setOrg] = useState<any>([]);
    const [mmodule, setMmodule] = useState<any>([]);
    const [userType, setUserType] = useState<any>([]);

    const [gender, setGender] = useState<any>([])
    const [marital, setMarital] = useState<any>([])
    
    const [isOtpVisible, setOTPVisible] = useState(false);
    const [candidateData, setCandidateData] = useState({});
    const {initialState, setInitialState } = useModel('@@initialState');

    const [input_OrgID,setInput_Org] =useState("1");
    const [input_Packages,setInput_Packages] =useState("-1");
    const [input_Module,setInput_Module] =useState("-1");
    const [input_FormID,setInput_FormID] =useState("-1");
    const [activeTab, setActiveTab] = useState<any>("1");
    
    const contentStyle: React.CSSProperties = {
       
        textAlign: 'center',
        color: token.colorTextTertiary,
        marginTop: 10,
        // height: 300,
        width:"100%"
    };
    const { Title, Text, Link } = Typography;
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
    const onChange = (list: SetStateAction<string[]>) => {
      setCheckedList(list);
    };
    const onCheckAllChange = (e: { target: { checked: any; }; }) => {
      setCheckedList(e.target.checked ? plainOptions : []);
    };
    const initialTabItems = [
      { label: '__     User Form Right', children: '', key: '1' },
      { label: 'User Role Permission', children: '', key: '2' },
  ];
  const [checkboxValues, setCheckboxValues] = useState({});
//   const handleCheckboxChange = (id) => {
//     setCheckboxValues((prevCheckboxValues) => ({
//       ...prevCheckboxValues,
//       [id]: !prevCheckboxValues[id] // Toggle the checkbox value
//     }));
//   };
    useEffect(() => {
        
        console.log("initialState");
        console.log(initialState);
        // getGender()
        // getMarital()
      //   getPackages();
      //   getRole();
      
         getDesignation();
         getSection();
      //  // getRank();
         getForm('-1');
        getOrg();
        // getMmodule();
        // getUserType();

       // getformidbyname()

    }, [])

    useEffect(() => {
        console.log({ selectedRows })
        if (isEditable) {
            formRef.current?.setFieldsValue({
                firstName: selectedRows?.firstName,
                middleName: selectedRows?.middleName,
                lastName: selectedRows?.lastName ? selectedRows?.lastName : "-",
                candPassword: selectedRows?.candPassword ? selectedRows?.candPassword : "-",
                emailID: selectedRows?.emailID,
                mobileNo: selectedRows?.mobileNo,
                dob: dayjs(selectedRows?.dob, dateFormat),
               // panNo: selectedRows?.panNo,
                //aadhaarNo: selectedRows?.aadhaarNo,
                //maritalStatusID: { value: selectedRows?.maritalStatusID, label: selectedRows?.maritalStatusName },
                genderID: { value: selectedRows?.genderID, label: selectedRows?.genderName },

            })
        }
    }, [selectedRows])

    const convertDate = (inputDateString: string) => {
        // Parse the input date string using Moment.js
        const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
        // Format the parsed date in the desired format
        const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        console.log(formattedDate);
        return formattedDate
    }

    const getGender = async () => {
        const res = await requestGetGender();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            setGender(dataMaskForDropdown)
        }
    }

    const getUserType = async () => {
        const res = await requestGetUserType();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.userTypeID, label: item.userTypeName }
            })
            setUserType(dataMaskForDropdown)
        }
    }

    const getRank = async () => {
        const res = await requestGetRank();
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.genderID, label: item.genderName }
            })
            setRank(dataMaskForDropdown)
        }
    }
    const getForm = async (mModuleID) => {
        const staticParams = {
            collegeID: input_OrgID,
            packageID: input_Packages,
            mModuleID:mModuleID,
            formID:"-1"
      };
        const res = await requestGetForm(staticParams);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.formID, label: item.displayName }
            })
            setForms(dataMaskForDropdown)
        }
    }
    const getOrg = async () => {
      const staticParams = {
        collegeID: "0",
        type: "1"
      };
      const res = await requestGetOrg(staticParams);
      if (res.data.length > 0) {
          const dataMaskForDropdown = res?.data?.map((item: any) => {
              return { value: item.orG_ID, label: item.orG_NAME }
          })
          setOrg(dataMaskForDropdown)
      }
  }

  const getMmodule = async (packageID: any) => {
    const staticParams = {
      "orgID": input_OrgID,
      "packageID": packageID,
      "mModuleID": "-1"
    };
    const res = await requestGetMmodule(staticParams);
    if (res.data.length > 0) {
        const dataMaskForDropdown = res?.data?.map((item: any) => {
            return { value: item.mModuleID, label: item.mModuleName }
        })
        setMmodule(dataMaskForDropdown)
    }
}

    const getSection = async () => {
        const staticParams = {
              "sectionID": "-1",
              "type": "1"
        };

        const res = await requestGetSectionTree(staticParams);
        if (res.length > 0) {
            const dataMaskForDropdown = res?.map((item: any) => {
                return { value: item.sectionID, label: item.sectionName , sectionID: item.sectionID, sectionName: item.sectionName , plainSectionName: item.plainSectionName, sectionCode: item.sectionCode, parentSectionID: item.parentSectionID, mainSectionID: item.mainSectionID, parentMainSectionID: item.parentMainSectionID, rowID: item.rowID, depthLevel:item.depthLevel, sectionTree:item.sectionTree, sectionIDTree:item.sectionIDTree }
            })
            setSection(dataMaskForDropdown)
        }
    }
    const getDesignation  = async () => {

        const staticParams = {
            DesigID: "-1",
        };
        const res = await requestGetDesignation(staticParams);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.desigID, label: item.desigName , desigID: item.desigID , desigName: item.desigName , desigCode: item.desigCode , isActive: item.isActive , priority: item.priority , desigType: item.desigType }
            })
            setDesignation(dataMaskForDropdown)
        }
    }

    const getRole  = async () => {
        const staticParams = {
            RoleID: "-1",
        };
        const res = await requestGetRole(staticParams);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.rowID, label: item.rowValue }
            })
            setRole(dataMaskForDropdown)
        }
    }
    const getRoleBAction  = async (inputorg: string,inputpackage: string,inputmodule: string,inputform: string) => {
        const staticParams = {
            orgID: inputorg==""? "-1" : inputorg,
            packageID: inputpackage==""? "-1" :inputpackage,
            mModuleID: inputmodule==""? "-1" :inputmodule,
            formID: inputform==""? "-1" :inputform ,
            type: "1"
        };
        const res = await requestGetRoleBAction(staticParams);
        if (res.data.length > 0) {
            // const dataMaskForDropdown = res?.data?.map((item: any) => {
            //     //plainOptions.push({value: item.roleID+"" , label :  item.roleName+""})
            //     return { value: item.roleID, label: item.roleName }
            // })
            setRoleBAction(res.data)
           console.log(res.data)
           
        }
    }
   
    
    const getPackages  = async () => {
        const staticParams = {
            collegeID: "1",
            packageID: "-1",
            type: "1"
        };


        const res = await requestGetPackages(staticParams);
        if (res.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.packageID, label: item.packageName, packageID: item.packageID, packageName: item.packageName, orgID: item.orgID, packageURL:item.packageURL }
            })
            setPackages(dataMaskForDropdown)
        }
    }



    const getMarital = async () => {
        const res = await requestGetMarital();
        if (res?.data.length > 0) {
            const dataMaskForDropdown = res?.data?.map((item: any) => {
                return { value: item.maritalStatusID, label: item.maritalStatusName }
            })
            console.log({ dataMaskForDropdown })
            setMarital(dataMaskForDropdown)
        }
    }

   
    

      function  getformidbyname (values: string | undefined)   {
        // initialState.data.formRight.leght
        var formid="";
        for (let i = 0; i < initialState.data.formRight.length; i++) {
                console.log(initialState.data.formRight[i]['displayName'])
                if(initialState.data.formRight[i]['displayName']==values)
                {
                    formid=  initialState.data.formRight[i]['formID'];
                }
                // Code to be repeated
          }
        return formid;
        //console.log(initialState.data.formRight.length)
    }

    function  getuserid ()   {
        // initialState.data.formRight.leght

       // const user = jwt(initialState?.currentUser?.verifiedUser.token);
       

       // return user.UserId;
        //console.log(initialState.data.formRight.length)
    }



    const addUserRolePermission =async (values: any) => {
        try {
            
          //  const firstName = event.target.elements.firstName.value;
           
          const roleBAction_array: { roleID: any; bActionId: any; }[]=[];
          roleBAction.forEach((pkg, index) => {
            
                if(roleBAction[index].roleID>0 ){
                 if(roleBAction[index].header1>0){
                    roleBAction_array.push({ roleID: roleBAction[index].roleID, bActionId: roleBAction[1].header1})
                 }
                 if(roleBAction[index].header2>0){
                    roleBAction_array.push({ roleID: roleBAction[index].roleID, bActionId: roleBAction[1].header2})
                 }
                 if(roleBAction[index].header3>0){
                    roleBAction_array.push({ roleID: roleBAction[index].roleID, bActionId: roleBAction[1].header3})
                 }
                 if(roleBAction[index].header4>0){
                    roleBAction_array.push({ roleID: roleBAction[index].roleID, bActionId:roleBAction[1].header4})
                 }
                 if(roleBAction[index].header5>0){
                    roleBAction_array.push({ roleID: roleBAction[index].roleID, bActionId: roleBAction[1].header5})
                 }
                 if(roleBAction[index].header6>0){
                    roleBAction_array.push({ roleID: roleBAction[index].roleID, bActionId: roleBAction[1].header6})
                 }
                 if(roleBAction[index].header7>0){
                    roleBAction_array.push({ roleID: roleBAction[index].roleID, bActionId: roleBAction[1].header7})
                 }
                }
            })

          
          console.log(roleBAction);
          console.log(roleBAction_array);
           
           // const content = event.target.elements.content.value;
           // values['dob'] = convertDate(values['dob']);

            const staticParams = {
                type: "1",
                listBaction:roleBAction_array,
               // Token: initialState?.currentUser?.verifiedUser.token,
            };

            console.log(staticParams);

            setLoading(true)
           
            const msg = await requestAddUserRolePermission({ ...values, ...staticParams } );
            setLoading(false)
            if (msg.isSuccess === true) {
                //formRef.current?.resetFields();
                form.resetFields();
                message.success(msg.msg);
                setRoleBAction([]);
                //setOTPVisible(true);
               // setCandidateData({ ...values, ...staticParams })
               // const urlParams = new URL(window.location.href).searchParams;
                // setTimeout(() => {
                //     history.push(urlParams.get('redirect') || '/list');
                // }, 1000)
                //onClose();
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
    const addUserFormRight =async (values: any) => {
        try {
            
          //  const firstName = event.target.elements.firstName.value;
           
          const formID_array: { rowID: any; rowValue: any; isSelected: any; }[]=[];
          const designstion_array:{rowID:any; rowValue:any; isSelected:any; }[] =[];
const section_array:{rowID:any; rowValue:any; isSelected:any; }[] =[];


          values.formIDRight.forEach((pkg, index) => {

            console.log("sdsfds");
            console.log(forms);
                const filtered = forms.filter((pkge: { formID: string; }) => {
                    return pkge.value === pkg;
                  });
                  formID_array.push({ rowID:  filtered[0].value, rowValue: filtered[0].label, isSelected: true})
            })


            values.desigID.forEach((desig, index) => {
                const filtered = designation.filter((designations: { desigID: string; }) => {
                    return designations.desigID === desig;
                  });
                  designstion_array.push({ rowID: filtered[0].desigID, rowValue: filtered[0].desigName, isSelected: true})
            })

            values.sectionID.forEach((sect, index) => {
                const filtered = section.filter((sections: { sectionID: string; }) => {
                    return sections.sectionID === sect;
                  });
                  section_array.push({ rowID:  filtered[0].sectionID+"", rowValue: filtered[0].sectionName, isSelected: true})
            })

          
          console.log(roleBAction);
           
           // const content = event.target.elements.content.value;
           // values['dob'] = convertDate(values['dob']);

            const staticParams = {
                
                "formID":formID_array,
                "sectionID": section_array,
                "desigID": designstion_array,
                "type": "1",
                "userID": "-1",
                "userFormID": "-1",
               
            };

            console.log(staticParams);

            setLoading(true)
           
            const msg = await requestAddUserFormRight(staticParams);
            setLoading(false)
            if (msg.isSuccess === true) {
                //formRef.current?.resetFields();
                form.resetFields();
                message.success(msg.msg);
                //setOTPVisible(true);
                setCandidateData({ ...values, ...staticParams })
                // const urlParams = new URL(window.location.href).searchParams;
                // setTimeout(() => {
                //     history.push(urlParams.get('redirect') || '/list');
                // }, 1000)
                // onClose();
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
    const numberToBoolean = (num) => {
        return num !== 0;
      };
    const handleChange = async (e: { target: { name: any; checked: any;className:any }; },key: any) => {
        const {name , checked,className} = e.target ;
            console.log(className)
            console.log(key)
        if(name === "allSelect") {
            let tempUser = roleBAction.map((roletem: any) => {
                return {...roletem,isChecked: checked}
            }) ;
            setRoleBAction(tempUser) ;
        }
        else { 
            console.log(name);
            roleBAction[key]['header1']=1;
            e.target.checked=1;
            // let tempUser = roleBAction.map((roletem: { header1: any;rowType: any; }) =>{
            //     if(roletem.rowType=="3")
            //     {

            //      console.log(roletem.header1 );
            //     }
            //      //roletem.header1 === name ? {...roletem, header1: checked} : roleBAction
                
            //     });
            console.log(name);
           // console.log(tempUser)
            setRoleBAction(roleBAction) ;
           // (tempUser) ;
        }
    }
    const handleCheckboxChange = (id: any,header: string) => {
        if(header=="header1"){
        setRoleBAction((prevData) =>
          prevData.map((item) =>
            item.roleID === id ? { ...item, header1: item.header1=="1" ? "0":"1" } : item
          )
        );
        } else  if(header=="header2"){
            setRoleBAction((prevData) =>
              prevData.map((item) =>
                item.roleID === id ? { ...item, header2: item.header2=="1" ? "0":"1" } : item
              )
            );
        } else  if(header=="header3"){
                setRoleBAction((prevData) =>
                  prevData.map((item) =>
                    item.roleID === id ? { ...item, header3: item.header3=="1" ? "0":"1" } : item
                  )
                );
         }  else  if(header=="header4"){
                    setRoleBAction((prevData) =>
                      prevData.map((item) =>
                        item.roleID === id ? { ...item, header4: item.header4=="1" ? "0":"1" } : item
                      )
                    );
        } else  if(header=="header5"){
            setRoleBAction((prevData) =>
              prevData.map((item) =>
                item.roleID === id ? { ...item, header5: item.header5=="1" ? "0":"1" } : item
              )
            );
        } else  if(header=="header6"){
        setRoleBAction((prevData) =>
          prevData.map((item) =>
            item.roleID === id ? { ...item, header6: item.header6=="1" ? "0":"1" } : item
          )
        );
        } else  if(header=="header7"){
        setRoleBAction((prevData) =>
          prevData.map((item) =>
            item.roleID === id ? { ...item, header7: item.header7=="1" ? "0":"1" } : item
          )
         );
        } 
      };

      const handleSelectAll = (header: string) => {
        if(header=="header1"){
        setRoleBAction((prevData) =>
          prevData.map((item) =>
          ({  ...item,
              header1: item.roleID>0? "1":item.header1,
           }) )
        );
        } else  if(header=="header2"){
            setRoleBAction((prevData) =>
            prevData.map((item) =>
            ({  ...item,
                header2: item.roleID>0? "1":item.header2,
             }) )
          );
        } else  if(header=="header3"){
            setRoleBAction((prevData) =>
            prevData.map((item) =>
            ({  ...item,
                header3: item.roleID>0? "1":item.header3,
             }) )
          );
         }  else  if(header=="header4"){
            setRoleBAction((prevData) =>
            prevData.map((item) =>
            ({  ...item,
                header4: item.roleID>0? "1":item.header4,
             }) )
          );
        } else  if(header=="header5"){
            setRoleBAction((prevData) =>
          prevData.map((item) =>
          ({  ...item,
            header5: item.roleID>0? "1":item.header5,
           }) )
        );
        } else  if(header=="header6"){
            setRoleBAction((prevData) =>
            prevData.map((item) =>
            ({  ...item,
                header6: item.roleID>0? "1":item.header6,
             }) )
          );
        } else  if(header=="header7"){
            setRoleBAction((prevData) =>
            prevData.map((item) =>
            ({  ...item,
                header7: item.roleID>0? "1":item.header7,
             }) )
          );
        } 
      };
    const addCandidateForm = () => {
        return (
          

            <>
            <PageContainer style={{width:"100%"}}  header={{
        title: <Space direction="vertical">
           <Title>{'User Management'}</Title> 
        </Space>,
        breadcrumb: {
          items: [],
        },
      }} >
            <Card>
                <Spin tip="Please wait..." spinning={loading}>
            <Form
             form={form}
          //  containerStyle={{alignSelf:'center',width:'100%',marginInline:10}}
               // formRef={formRef}
               onFinish={async (values) => {
                addUserRolePermission(values)
            }}
                // onSubmit={event =>
                //     addCandidate(
                //         event
                        
                //     )
                // }


                // formProps={{
                //     validateMessages: {
                //         required: 'This is required',
                //     },
                // }}
            >
                {/* <StepsForm.StepForm
                    name="basicInformation"
                    title="Basic Details"
                    stepProps={{
                        description: '',
                    }}
                    onFinish={async () => {
                        console.log(formRef.current?.getFieldsValue());
                        return true;
                    }}
                > */}
                    <div style={contentStyle}>
                       
                          <Row gutter={24}>
                      
                       
                              <Col span={12}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                
                                    name="OrgID"
                                    label="Org"
                                    rules={[{ required: true, message: 'Please choose the Org' }]}
                                >
                                    <Select
                                       // mode="multiple"
                                       // allowClear
                                       style= {{ width: '100%',textAlign:'start' }}
                                       onSelect={(e)=>{
                                        console.log(packages)
                                        console.log(e)
                                       
                                        setInput_Org(e)
                                        getPackages();
                                        form?.resetFields(['packageID'])
                                     
                                        getRoleBAction(e,input_Packages,input_Module,input_FormID);
                                        // const filtered = packages.filter((pkge: { packageID: string; }) => {
                                        //     return pkge.packageID === e;
                                        //   });
                                        //   console.log(filtered)
                                       // packages.filter(data => data.id === e)
                                    }}
                                       aria-label="left"
                                        placeholder="Please choose the Org"
                                        options={org}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="packageID"
                                    label="Packages"
                                    rules={[{ required: true, message: 'Please choose the Packages' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Packages"
                                        //mode="multiple"
                                        options={packages}
                                        style= {{ width: '100%',textAlign:'start' }}
                                        onSelect={(e)=>{
                                            console.log(packages)
                                            console.log(e)
                                            form?.resetFields(['mModuleID'])
                                            setInput_Packages(e)
                                            getMmodule(e);
                                            getRoleBAction(input_OrgID,e,input_Module,input_FormID);
                                            // const filtered = packages.filter((pkge: { packageID: string; }) => {
                                            //     return pkge.packageID === e;
                                            //   });
                                            //   console.log(filtered)
                                           // packages.filter(data => data.id === e)
                                        }}
                                    />
                                </Form.Item>
                            </Col> 
                            <Col span={12}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="mModuleID"
                                    label="Module "
                                    rules={[{ required: true, message: 'Please choose the Module' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Module"
                                       // mode="multiple"
                                       style= {{ width: '100%',textAlign:'start' }}
                                        options={mmodule}
                                        onSelect={(e)=>{
                                            console.log(mmodule)
                                            console.log(e)
                                            form?.resetFields(['FormID'])
                                            setInput_Module(e)
                                            getForm(e);
                                            getRoleBAction(input_OrgID,input_Packages,e,input_FormID);
                                            // const filtered = packages.filter((pkge: { packageID: string; }) => {
                                            //     return pkge.packageID === e;
                                            //   });
                                            //   console.log(filtered)
                                           // packages.filter(data => data.id === e)
                                        }}
                                    />
                                </Form.Item>
                            </Col> 
                            <Col span={12}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="FormID"
                                    label="Form"
                                    rules={[{ required: true, message: 'Please choose the Form' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Form"
                                        //mode="multiple"
                                        style= {{ width: '100%',textAlign:'start' }}
                                        options={forms}
                                        onSelect={(e)=>{
                                            // console.log(packages)
                                            // console.log(e)

                                            // const filtered = packages.filter((pkge: { packageID: string; }) => {
                                            //     return pkge.packageID === e;
                                            //   });
                                            //   console.log(filtered)
                                           // packages.filter(data => data.id === e)
                                           getRoleBAction(input_OrgID,input_Packages,input_Module,e);
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            </Row>
                          <Row>
                            <table style={{width:"100%",border: "1px solid black"}}>
                              {/* <thead>
                                <tr style={{border: "1px solid black",fontSize: "2.7vh",fontWeight: "600",background: "#5f9ea0",color: "white",}}>
                                  <td style={{padding: "10px"}}>RoleName</td>
                                  <td>Header1</td>
                                  <td>Header2</td>
                                  <td>Header3</td>
                                  <td>Header4</td>
                                  <td>Header5</td>
                                  <td>Header6</td>
                                  <td>Header7</td>
                                </tr>
                              </thead> */}
                              <tbody style={{color:"#000000"}}>

{ roleBAction.map((val, key) => {
        return ( <>
          { key ==0  ? <tr key={key} style={{border: "1px solid black",fontSize: "2.7vh",fontWeight: "600",background: "#5f9ea0",color: "white",}}>
              
                <td style={{padding: "10px"}}>   {val.roleName} </td>
                <td> {val.header1}   </td>
                
                <td> {val.header2} </td>
                <td> {val.header3} </td>
                <td> {val.header4} </td>
  
                <td > {val.header5} </td>
                <td > {val.header6} </td>
                <td > {val.header7} </td>
                
            </tr> : key ==1  ? <tr key={key} style={{border: "1px solid black",fontSize: "2.7vh",fontWeight: "600",background: "#5f9ea0",color: "white",}}>
              
              <td style={{padding: "10px"}}>   {val.roleName} </td>
              <td>  <input
              type="checkbox"
              checked={roleBAction.every((item) =>  numberToBoolean(parseInt(item.header1)))}
              onChange={()=>handleSelectAll('header1')}
            />   </td>
              
              <td>  <input
              type="checkbox"
              checked={roleBAction.every((item) => numberToBoolean(parseInt(item.header2)))}
              onChange={()=>handleSelectAll('header2')}
            /> </td>
              <td>  <input
              type="checkbox"
              checked={roleBAction.every((item) => numberToBoolean(parseInt(item.header3)))}
              onChange={()=>handleSelectAll('header3')}
            /> </td>
              <td>  <input
              type="checkbox"
              checked={roleBAction.every((item) => numberToBoolean(parseInt(item.header4)))}
              onChange={()=>handleSelectAll('header4')}
            /> </td>

              <td >  <input
              type="checkbox"
              checked={roleBAction.every((item) => numberToBoolean(parseInt(item.header5)))}
              onChange={()=>handleSelectAll('header5')}
            /> </td>
              <td >  <input
              type="checkbox"
              checked={roleBAction.every((item) => numberToBoolean(parseInt(item.header6)))}
              onChange={()=>handleSelectAll('header6')}
            /> </td>
              <td > <input
              type="checkbox"
              checked={roleBAction.every((item) => numberToBoolean(parseInt(item.header7)))}
              onChange={()=>handleSelectAll('header7')}
            /> </td>
              
          </tr>: <tr key={key} style={{background: key==0? '#b4efea' : '#fff'}}>
              
            <td>   {val.roleName  } </td>
            <td> <Input type='checkbox' 
            //    onChange={()=>{  if(roleBAction[key]['header1']=="0"){roleBAction[key]['header1']="1"; } else{ roleBAction[key]['header1']="0"; } console.log(roleBAction); console.log(roleBAction[key]['header1']); console.log(roleBAction);  
            //    console.log(numberToBoolean(parseInt( roleBAction[key]['header1'])));
            //  }} 
            onChange={() => handleCheckboxChange(val.roleID,'header1')}
             checked={numberToBoolean(parseInt(roleBAction[key]['header1']))  ? true : false}    
             
             name='header1' className='header1' />  </td>
            
            <td> <Input type='checkbox'  onChange={() => handleCheckboxChange(val.roleID,'header2')}
             checked={numberToBoolean(parseInt(roleBAction[key]['header2']))  ? true : false}   name='header2' className='header2' /> </td>
            <td> <Input type='checkbox'  onChange={() => handleCheckboxChange(val.roleID,'header3')}
             checked={numberToBoolean(parseInt(roleBAction[key]['header3']))  ? true : false}  name='header3' className='header3' /> </td>
            <td> <Input type='checkbox'  onChange={() => handleCheckboxChange(val.roleID,'header4')}
             checked={numberToBoolean(parseInt(roleBAction[key]['header4']))  ? true : false}  name='header4' className='header4' /> </td>

            <td > <Input type='checkbox'  onChange={() => handleCheckboxChange(val.roleID,'header5')}
             checked={numberToBoolean(parseInt(roleBAction[key]['header5']))  ? true : false}  name='header5' className='header5' /></td>
            <td > <Input type='checkbox'  onChange={() => handleCheckboxChange(val.roleID,'header6')}
             checked={numberToBoolean(parseInt(roleBAction[key]['header6']))  ? true : false}  name='header6' className='header6' /></td>
            <td > <Input type='checkbox'  onChange={() => handleCheckboxChange(val.roleID,'header7')}
             checked={numberToBoolean(parseInt(roleBAction[key]['header7']))  ? true : false}  name='header7' className='header7' /> </td>
            
        </tr> }</>
        )
    })} 
                              </tbody>
                            </table>
                          </Row>
                          <Row>
                            {/* <Col span={12}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    name="sectionT"
                                    label="Section"
                                    rules={[{ required: true, message: 'Please choose the Section' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Please choose the Section"
                                        options={section}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="desigT"
                                    label="Designation"
                                    rules={[{ required: true, message: 'Please choose the Designation' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Please choose the Designation"
                                        options={designation}
                                    />
                                </Form.Item>
                            </Col> */}
                            {/* 
                            */}
                          
                            {/* <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="rankID"
                                    label="Rank"
                                    rules={[{ required: false, message: 'Please choose the Rank' }]}
                                >
                                    <Select
                                        placeholder="Please choose the Rank"
                                      
                                        options={rank}
                                       
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                labelCol={{ span: 24 }}
                                    name="userTypeID"
                                    label="User Type"
                                    rules={[{ required: true, message: 'Please choose the User Type' }]}
                                >
                                    <Select
                                        placeholder="Please choose the User Type"
                                      
                                        options={userType}
                                       
                                    />
                                </Form.Item>
                            </Col> */}


                            <Col span={8}>
                                 <Form.Item
                                 label=" "
                                 labelCol={{ span: 24 }}
                                 >
                                    
                        <Button type="primary" htmlType="submit"> Submit</Button>
                    </Form.Item>
                            </Col>
                        </Row>
                    </div>
                {/* </StepsForm.StepForm> */}

                {/* Identity Proofs */}
               

               
                {/* Address Information */}
  
            </Form>
            </Spin>
</Card>
</PageContainer>
            </>
          
 
        )
    }


    const FormaddUserFormRight = () => {
      return (
        

          <>
          <PageContainer style={{width:"100%"}} >
          <Card>
              <Spin tip="Please wait..." spinning={loading}>
          <Form
           form={form}
        //  containerStyle={{alignSelf:'center',width:'100%',marginInline:10}}
             // formRef={formRef}
             onFinish={async (values) => {
                addUserFormRight(values)
          }}
              
          >
             
                  <div style={contentStyle}>
                     
                        <Row gutter={24}>
                    
                          
                      {/*  <Col span={12}>
                              <Form.Item
                              labelCol={{ span: 24 }}
                                  name="roleT"
                                  label="Role"
                                  rules={[{ required: true, message: 'Please choose the Role' }]}
                              >
                                  <Select
                                      mode="multiple"
                                      allowClear
                                      placeholder="Please choose the Role"
                                      options={roleBAction}
                                  />

           <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  Check all
              </Checkbox>
               <Divider /> 
          <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} /> 
                              </Form.Item>
                          </Col>
                            */}
                           
                         
                          <Col span={12}>
                              <Form.Item
                              labelCol={{ span: 24 }}
                                  name="formIDRight"
                                  label="Form"
                                  rules={[{ required: true, message: 'Please choose the Form' }]}
                              >
                                  <Select
                                      placeholder="Please choose the Form"
                                      mode="multiple"
                                      style= {{ width: '100%', }}
                                      maxTagCount= 'responsive'
                                      options={forms}
                                      onSelect={(e)=>{
                                          // console.log(packages)
                                          // console.log(e)

                                          // const filtered = packages.filter((pkge: { packageID: string; }) => {
                                          //     return pkge.packageID === e;
                                          //   });
                                          //   console.log(filtered)
                                         // packages.filter(data => data.id === e)
                                      }}
                                  />
                              </Form.Item>
                          </Col>
                           <Col span={12}>
                              <Form.Item
                                  labelCol={{ span: 24 }}
                                  name="sectionID"
                                  label="Section"
                                  rules={[{ required: true, message: 'Please choose the Section' }]}
                              >
                                  <Select
                                      mode="multiple"
                                      style= {{ width: '100%', }}
                                      maxTagCount= 'responsive'
                                      allowClear
                                      placeholder="Please choose the Section"
                                      options={section}
                                  />
                              </Form.Item>
                          </Col>
                          <Col span={12}>
                              <Form.Item
                              labelCol={{ span: 24 }}
                                  name="desigID"
                                  label="Designation"
                                  rules={[{ required: true, message: 'Please choose the Designation' }]}
                              >
                                  <Select
                                      mode="multiple"
                                      style= {{ width: '100%', }}
                                      maxTagCount= 'responsive'
                                      allowClear
                                      placeholder="Please choose the Designation"
                                      options={designation}
                                  />
                              </Form.Item>
                          </Col>
                          
                         
                          {/* 
                          */}
                        
                          {/* <Col span={8}>
                              <Form.Item
                              labelCol={{ span: 24 }}
                                  name="rankID"
                                  label="Rank"
                                  rules={[{ required: false, message: 'Please choose the Rank' }]}
                              >
                                  <Select
                                      placeholder="Please choose the Rank"
                                    
                                      options={rank}
                                     
                                  />
                              </Form.Item>
                          </Col>
                          <Col span={8}>
                              <Form.Item
                              labelCol={{ span: 24 }}
                                  name="userTypeID"
                                  label="User Type"
                                  rules={[{ required: true, message: 'Please choose the User Type' }]}
                              >
                                  <Select
                                      placeholder="Please choose the User Type"
                                    
                                      options={userType}
                                     
                                  />
                              </Form.Item>
                          </Col> */}


                          <Col span={12}>
                               <Form.Item
                               label=" "
                               labelCol={{ span: 24 }}
                               >
                                  
                      <Button type="primary" htmlType="submit"> Submit</Button>
                  </Form.Item>
                          </Col>
                      </Row>
                  </div>
              {/* </StepsForm.StepForm> */}

              {/* Identity Proofs */}
             

             
              {/* Address Information */}

          </Form>
          </Spin>
</Card>
</PageContainer>
          </>
        

      )
  }




    return (
        <>
            {/* <Spin tip="Please wait..." spinning={loading}>
                <Row justify="space-around" align="middle">
                  { addCandidateForm() }
                </Row>
            </Spin> */}
               <Tabs
                    tabPosition={'top'}
                    items={initialTabItems}
                    onChange={(activeKey) => setActiveTab(activeKey)}
                />
                <div style={{ marginTop: 30 }}>
                    {activeTab === "1" && FormaddUserFormRight()}
                    {activeTab === "2" && addCandidateForm()}
                </div>
        </>
    );
};



export default UserRolePermission;