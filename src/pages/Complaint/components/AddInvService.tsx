import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message, Steps, theme, Spin, Typography, Card, Checkbox, Divider, Modal, InputNumber, Tree, TreeProps } from 'antd';
import { requestAddService, requestDiseaseTypeList, requestGetInvGroup, requestGetInvParameterMasterList, requestServiceList, requestSpecialList } from '../services/api';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl } from '@umijs/max';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import InvServiceList from './InvServiceList';
import { dateFormat } from '@/utils/constant';
import { convertDate } from '@/utils/helper';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;


interface DataNode {
    title: string;
    key: string;
    isLeaf?: boolean;
    children?: DataNode[];
}

const initTreeData: DataNode[] = [
    { title: 'Node1', key: '0' },
    { title: 'Expand to load', key: '1' },
];



const AddInvService = () => {
    const formRef = useRef<any>();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [diseaseType, setDiseaseType] = useState<any>([])
    const [isActive, setIsActive] = useState(true);
    const [isExpand, setIsExpand] = useState(1);
    const [specialList, setSpecialist] = useState([]);
    const [groupList, setGroupList] = useState<DataNode[]>();
    const [ServiceID, setServiceID] = useState<any>(-1);
    const [invArr, setInvArr] = useState("0");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const investigationListRef = useRef();
    const [defExpandedKeys, setDefExpandedKeys] = useState<any>(["1"]);
    const [defCheckedKeys, setDefCheckedKeys] = useState<any>([]);
    const [totalRate, setTotalRate] = useState<any>(0);

    const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
        list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, []),
                };
            }
            return node;
        });

    const contentStyle: React.CSSProperties = {
        // lineHeight: '260px',
        // textAlign: 'center',
        color: token.colorTextTertiary,
        borderRadius: token.borderRadiusLG,
        // marginTop: 20,
        // height: 350
    };


    useEffect(() => {
        getInvGroup();
    }, [])

    const getInvGroup = async () => {
        const params = {
            "invGroupID": -1,
            "discountParameterID": -1,
            "isActive": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetInvGroup(params);
        // console.log(res);
        if (res?.result?.length > 0) {
            const dataMaskForDropdown = res?.result?.map((item: any, index: any) => {
                return {
                    key: `${item.invGroupID}`, title: item.invGroupName, disableCheckbox: true,
                }
            })
            setGroupList(dataMaskForDropdown)
            console.log(defExpandedKeys)

            // setDefExpandedKeys(groups)
        }
    }
    const getInvParameter = async (id: any) => {
        const params1 = {
            "invParameterID": -1,
            invGroupID: id,
            "isActive": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetInvParameterMasterList(params1);
        // console.log(res);
        // if (res?.result?.length > 0) {
        const dataMaskForDropdown = res?.result?.map((item: any) => {
            return { key: item.invParameterID, title: item.invName }
        })
        return dataMaskForDropdown;
        // }
    }

    const goBack = () => {
        history.push("/")
    }
    const getServiceList = async (ServiceID: any = -1, type: any = 1) => {
        const params = {
            ServiceID,
            type
        }
        const res = await requestServiceList(params);
        if (type == 3) {
            const groups = res?.result?.map((item: any) => {
                return item?.groupID.trim()
            })
            const invParams = res?.result?.map((item: any) => {
                return item?.invParameterID + " "
            })
            setDefCheckedKeys(invParams)
            setDefExpandedKeys(groups)
            setInvArr(invParams.toString().trim())
        }
        if (res.result.length > 0) {
            const data = res?.result[0]
            setIsActive(data?.isActive);
            setServiceID(data?.serviceID)

            form?.setFieldsValue({
                serviceName: data?.serviceName,
                serviceCost: data?.serviceCost,
                invGroupID: data?.m39_InvGroupID,
                sgstPercent: data?.sgstPercent,
                cgstPercent: data?.cgstPercent,
                serviceTo: dayjs(data?.serviceTo),
                serviceFrom: dayjs(data?.serviceFrom),
            });
            if (type == 1) getServiceList(params.ServiceID, 3)
        }
    }
    const addService = async (values: any, serviceID: number = -1, type: any = 1) => {
        console.log(values, serviceID)
        values['isActive'] = values.isActive;
        const { dateRange } = values;
        // values['diseaseTypeID'] = values.diseaseTypeID ? values.diseaseTypeID.toString() : "-1";
        let serviceFrom = convertDate(values.serviceFrom);
        let serviceTo = convertDate(values.serviceTo);
        try {
            const staticParams = {
                serviceID,
                // "serviceName": "string",
                // "serviceFrom": "2023-11-25T11:33:01.276Z",
                // "serviceTo": "2023-11-25T11:33:01.276Z",
                // "isActive": true,
                // "serviceCost": 0,
                // "cgstPercent": 0,
                // "sgstPercent": 0,
                serviceTo,
                serviceFrom,
                "invParameter": invArr,
                "userID": 0,
                "formID": -1,
                "type": type
            };
            console.log(values, staticParams)
            setLoading(true)
            const msg = await requestAddService({ ...values, ...staticParams });
            setLoading(false)
            if (msg.isSuccess === true) {
                form.resetFields();
                setServiceID(-1)
                message.success(msg.msg);
                getInvGroup()
                getServiceList()
                return;
            } else {
                message.error(msg.msg);
            }

        } catch (error) {
            setLoading(false)
            console.log({ error });
            message.error('please try again');
        }
    };
    const onChange = (e: CheckboxChangeEvent) => {
        formRef.current?.setFieldsValue({
            isActive: e.target.checked
        })
        setIsActive(e.target.checked)
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setDefExpandedKeys(expandedKeysValue);
        // setAutoExpandParent(false);
    };
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys, info: any) => {
        const rate = info && info?.checkedNodes?.map((item: any) => {
            return (item?.invRate)
        })

        const totalRate = rate.reduce((a: number, b: number) => parseInt(a) + parseInt(b))
        setTotalRate(totalRate)

        form.setFieldsValue({ serviceCost: totalRate })

        const d = removeDuplicates(checkedKeys)
        setInvArr(d.toString().trim())
        setDefCheckedKeys(checkedKeys);
    };
    function removeDuplicates(arr: any[]) {
        return [...new Set(arr)];
    }

    const onLoadData = ({ key, children }: any) =>
        new Promise<void>(async (resolve) => {
            const params = {
                "invParameterID": -1,
                invGroupID: parseInt(key, 10) ? parseInt(key, 10) : 1,
                "isActive": -1,
                "formID": -1,
                "type": 1
            }
            // console.log(loadedKeys)
            setTimeout(async () => {
                const res = await requestGetInvParameterMasterList(params);
                if (res?.result?.length > 0) {
                    const dataMaskForDropdown = res?.result?.map((item: any) => {
                        // setDefCheckedKeys(defCheckedKeys.push(item.invParameterID))
                        return {
                            key: `${item.invParameterID} `, title: `${item.invName}    @${item.invRate} ₹/-`,
                            isLeaf: true, invRate: item.invRate
                        }
                    })
                    setTimeout(() => {
                        if (dataMaskForDropdown.length > 0)
                            setGroupList((origin) =>
                                updateTreeData(origin, key, dataMaskForDropdown),
                            );
                        resolve();
                    }, 1000);
                }
                else {
                    setGroupList((origin) => updateTreeData(origin, key, []))
                    resolve();
                    message.error("NO INVESTIGATION PARAMETER FOUND FOR THIS GROUP");
                }
            }, 1000);

        });
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());//.toLowerCase()

    const onEditRecord = (data: any) => {
        console.log(data)
        getServiceList(data, 1)
    }
    const addForm = () => {
        return (
            <Form
                style={{}}
                layout="vertical"
                // hideRequiredMark
                form={form}
                onFinish={(values) => addService(values, ServiceID)}
                initialValues={{
                }}
            >
                {/* Basic Information */}
                <>
                    <div className="gutter-example">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="serviceName"
                                    label="Battery of Test Name"
                                    rules={[{ required: true, message: 'Please enter service name' }]}
                                // initialValue={institute}
                                >
                                    <Input size={'large'} placeholder="Please enter service name" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="serviceFrom"
                                    label="Service From"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <DatePicker
                                        format={'DD-MMM-YYYY'}
                                        size="large"
                                        style={{ width: '100%' }}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                    />
                                    {/* <RangePicker
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                        size={'large'}
                                    /> */}
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="serviceTo"
                                    label="Service To"
                                    rules={[{ required: true, message: 'Please select' }]}
                                >
                                    <DatePicker
                                        size="large"
                                        format={'DD-MMM-YYYY'}
                                        style={{ width: '100%' }}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                    />
                                </Form.Item>
                            </Col>


                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="serviceCost"
                                    label="Cost"
                                    rules={[{ required: true, message: 'Please enter cost' }]}
                                >
                                    <Input type='number' size={'large'} placeholder="Please enter cost" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="cgstPercent"
                                    rules={[
                                        { required: true, message: 'Please Enter SGST Percent' },
                                        {
                                            pattern: /^[0-9\b]+$/,
                                            message: 'Please Enter a Valid SGST Percent',
                                        }]}
                                    label="CGST %"
                                >
                                    <InputNumber size={'large'}
                                        style={{ width: '100%' }}
                                        placeholder="Please enter CGST Percent"
                                        // formatter={(value) => `${value}%`}
                                        // parser={(value) => value!.replace('%', '')}
                                        min={0}
                                        max={100} 
                                        maxLength={3}/>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    name="sgstPercent"
                                    label="SGST %"
                                    rules={[{ required: true, message: 'Please enter SGST Percent' },
                                    {
                                        pattern: /^[0-9\b]+$/,
                                        message: 'Please Enter a Valid SGST Percent',
                                    }]}
                                >
                                    <InputNumber size={'large'} placeholder="Please enter SGST Percent"
                                        style={{ width: '100%' }}
                                        // formatter={(value: any) => `${value}%`}
                                        // parser={(value) => value!.replace('%', '')}
                                        min={0}
                                        max={100} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Col className="gutter-row" span={8}>
                            <Form.Item
                                name="invParameter"
                                valuePropName="checked"
                                // initialValue={true}
                                label={"Investigation Parameter"}
                                rules={[{ required: false, message: 'Please select' }]}
                            >
                                {defExpandedKeys && <Tree
                                    checkable
                                    onExpand={onExpand}
                                    loadData={onLoadData}
                                    height={140}
                                    rootStyle={{ width: 400 }}
                                    // defaultExpandedKeys={defExpandedKeys}
                                    // defaultCheckedKeys={defCheckedKeys}
                                    expandedKeys={defExpandedKeys}
                                    // autoExpandParent={autoExpandParent}
                                    onCheck={onCheck}
                                    // onSelect={onSelect}
                                    checkedKeys={defCheckedKeys}
                                    // selectedKeys={selectedKeys}
                                    treeData={groupList}
                                />}
                            </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                name="isActive"
                                valuePropName="checked"
                                initialValue={true}
                                label=""
                                rules={[{ required: false, message: 'Please select' }]}
                            >
                                <Checkbox>isActive</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col style={{ justifyContent: 'flex-end' }}>
                            <Button style={{ padding: 5, width: 100, height: 40 }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={goBack}
                                style={{ marginLeft: 10, padding: 5, width: 100, height: 40 }} type="default" >
                                Cancel
                            </Button>
                        </Col>
                    </div>
                </>
            </Form>
        )
    }

    return (
        <PageContainer
            title=" "
            style={{}}>
            <Space direction="horizontal">
                <Row>
                    <Col span={12}>


                        <Card
                            style={{ width: '100%', height: '100%', boxShadow: '2px 2px 2px #4874dc' }}
                            title="Create Investigation Service"
                        // extra={[
                        //     <Button key="rest" onClick={() => {
                        //         history.push("/complaints/DiseaseList")
                        //     }}
                        //     >List</Button>,
                        // ]}
                        >
                            <Spin tip="Please wait..." spinning={loading}>
                                <div style={contentStyle}>
                                    {addForm()}
                                </div>
                            </Spin>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <InvServiceList refresh={loading}
                            onEditRecord={onEditRecord}
                            ref={investigationListRef} />
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
};

export default AddInvService;