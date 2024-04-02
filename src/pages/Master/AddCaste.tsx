import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { history } from "@umijs/max";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  theme,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { SearchProps } from "antd/es/input";
import React, { useEffect, useRef, useState } from "react";
import { requestAddCaste, requestGetCasteList } from "./services/api";

const { Option } = Select;
const { Search } = Input;

const AddCaste = ({
  visible,
  onClose,
  onSaveSuccess,
  selectedRows,
  instituteId,
}: any) => {
  const formRef = useRef<any>();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const actionRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [view, setView] = useState(false);
  const [casteID, setCasteID] = useState("-1");
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [param, setParam] = useState<any>({ keyword: "" });

  const contentStyle: React.CSSProperties = {
    // lineHeight: '260px',
    // textAlign: 'center',
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    // marginTop: 20,
    // height: 350
  };

  useEffect(() => {
    // getSpecialType();
    // getDiseaseType();
  }, []);

  const goBack = () => {
    history.push("/");
  };

  const addCaste = async (values: any, type: number = 1) => {
    // values['isActive'] = values.isActive.toString();
    // values['diseaseTypeID'] = values.diseaseTypeID ? values.diseaseTypeID.toString() : "-1";
    try {
      const staticParams = {
        casteID: casteID,
        // "casteName": "",
        // "casteCode": "",
        isActive: values.isActive,
        userID: -1,
        formID: -1,
        type: casteID == "-1" ? 1 : 2,
      };
      console.log(values, type, view);
      setLoading(true);
      const msg = await requestAddCaste({ ...values, ...staticParams });
      setLoading(false);
      if (msg.isSuccess === true) {
        form.resetFields();
        message.success(msg.msg);
        setCasteID("-1");
        setIsModalOpen(false);
        reloadTable();
        return;
      } else {
        message.error(msg.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log({ error });
      message.error("please try again");
    }
  };
  const onChange = (e: CheckboxChangeEvent) => {
    formRef.current?.setFieldsValue({
      isActive: e.target.checked,
    });
    setIsActive(e.target.checked);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setCasteID("-1");
    setIsModalOpen(false);
  };
  const setEditField = (data: any, isEdit: any = false) => {
    setCasteID(data.casteID);
    setView(isEdit);
    showModal();
    form.setFieldsValue({
      casteName: data?.casteName,
      casteCode: data?.casteCode,
      isActive: data?.isActive,
      casteID: data?.casteID,
    });
    // window.scrollTo(0, 0)
    // setDiseaseID(data?.diseaseID)
  };
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label.toLowerCase() ?? "").includes(input.toLowerCase()); //.toLowerCase()
  const onSearch: SearchProps["onSearch"] = (value, record) => {
    setParam({ keyword: value });
  };

  const reloadTable = () => {
    actionRef.current.reload();
  };
  const addForm = () => {
    return (
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        // onOk={handleCancel}
        // okText= 'Save'
        footer=""
      >
        {view ? (
          <div>
            <ProDescriptions
              dataSource={data}
              bordered={true}
              size={"small"}
              // columns={[
              //   {
              //     title: "Caste Name",
              //     dataIndex: "casteName",
              //     span: 3,
              //   },
              //   {
              //     title: "Caste Code",
              //     dataIndex: "casteCode",
              //     span: 3,
              //   },
              //   {
              //     title: "isActive",
              //     dataIndex: "isActive",
              //     span: 3,
              //   },
              // ]}
            />
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="casteCode"
                label="Caste code"
                
              >
                <Input size={"large"} placeholder="Please Enter Caste Code" />
              </Form.Item>
            </Col>
          </div>
        ) : (
          <Form
            layout="vertical"
            // hideRequiredMark
            form={form}
            onFinish={(values) => addCaste({ ...values, casteID: casteID })}
            initialValues={{
              isActive: true,
            }}
          >
            {/* Basic Information */}
            <>
              <div className="gutter-example">
                <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      name="casteName"
                      label="Caste Name"
                      rules={[
                        { required: true, message: "Please Enter Caste" },
                      ]}
                      // initialValue={institute}
                    >
                      <Input size={"large"} placeholder="Please Enter Caste" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      name="casteCode"
                      label="Caste code"
                      rules={[
                        { required: true, message: "Please Enter Caste Code" },
                      ]}
                    >
                      <Input
                        size={"large"}
                        placeholder="Please Enter Caste Code"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="isActive"
                    valuePropName="checked"
                    //initialValue={true}
                    // rules={[{ required: false, message: 'Please select isActive' }]}
                    label=""
                    rules={[{ required: false, message: "Please select" }]}
                  >
                    <Checkbox>isActive</Checkbox>
                  </Form.Item>
                </Col>
                <Col style={{ justifyContent: "flex-end" }}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button
                    danger
                    onClick={handleCancel}
                    style={{ marginLeft: 10 }}
                    type="default"
                  >
                    Cancel
                  </Button>
                </Col>
              </div>
            </>
          </Form>
        )}
      </Modal>
    );
  };
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: "Caste Name",
      dataIndex: "casteName",
    },
    {
      title: "Caste Code",
      dataIndex: "casteCode",
    },
    {
      title: "isActive",
      dataIndex: "isActive",
      render: (_: any, record: any) => (
        <div>
          <Switch
            size="small"
            checked={record?.isActive}
            onChange={(v) => addCaste({ ...record, isActive: v }, 2)}
          />
          <Tag
            icon={<CheckCircleOutlined />}
            color={record?.isActive == true ? "success" : "error"}
          >
            {record?.isActive == true ? "Active" : "InActive"}
          </Tag>
        </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size={"small"}
            onClick={() => setEditField(record, true)}
            icon={<EyeOutlined />}
          />
          <Button
            type="primary"
            size={"small"}
            onClick={() => setEditField(record)}
            icon={<EditOutlined />}
          />
          {/* <Button type="primary" danger size={"small"} onClick={() => onDelete(record)} icon={<DeleteOutlined />} /> */}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title=" " style={{}}>
      {/* <Space direction="vertical" size="middle" style={{ display: 'flex' }}> */}
      {addForm()}
      <Row
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#dae1f3",
          paddingInline: 10,
          padding: 10,
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
        }}
      >
        <Col>
          <Row>
            {/* <Typography style={{ fontSize: 28 }}>{"Employees"}</Typography> */}
            <Search
              placeholder="search text"
              onSearch={onSearch}
              enterButton={
                <Button
                  onClick={reloadTable}
                  style={{ backgroundColor: "#3f51b5" }}
                  icon={<SearchOutlined style={{ color: "white" }} />}
                />
              }
            ></Search>
          </Row>
        </Col>
        <Col>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              style={{
                borderRadius: 48,
                backgroundColor: "#3f51b5",
                width: "48px",
                height: "48px",
              }}
              onClick={showModal}
              icon={<PlusOutlined style={{ color: "white" }} />}
            />
            ,
            <Button
              onClick={reloadTable}
              style={{
                borderRadius: 48,
                backgroundColor: "#3f51b5",
                width: "48px",
                height: "48px",
              }}
              icon={<ReloadOutlined style={{ color: "white" }} />}
            ></Button>
          </div>
        </Col>
      </Row>
      <ProTable<API.RuleListItem, API.PageParams>
        params={param}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        request={async (param: any, sort, filter) => {
          console.log(param, sort, filter);
          const params = {
            casteID: "-1",
            userID: "-1",
            formID: "-1",
            type: "1",
          };
          const res = await requestGetCasteList(params);
          setData(res?.result);
          let obj = res.result.filter(
            (o) => o.casteName.toLowerCase() >= param?.keyword
          );

          console.log(res?.result, obj, param.keyword);
          return Promise.resolve({
            data: obj,
            success: true,
          });
        }}
        columns={columns}
        toolbar={{ settings: [] }}
      />
    </PageContainer>
  );
};

export default AddCaste;
