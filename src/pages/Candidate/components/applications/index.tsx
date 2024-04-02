import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, DatePicker, Dropdown, Form, Input, List, Menu, Row, Select, Slider, Tooltip, Typography, message } from 'antd';
// import numeral from 'numeral';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from '@umijs/max';
import type { ListItemDataType } from './data.d';
import { queryFakeList } from './service';
import { requestGetCity, requestGetDistrict, requestGetRoomType, requestGetState } from '@/services/apiRequest/dropdowns';
import { requestGetInstituteList } from '@/pages/Institute/services/api';

// import styles from './style.less';

const { Option } = Select;
const { Text, Link } = Typography;

export function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const CardInfo: React.FC<{
  activeUser: React.ReactNode;
  newUser: React.ReactNode;
  contact: React.ReactNode;
}> = ({ activeUser, newUser, contact }) => (
  <div className='cardInfo'>
    <div>
      <p>{activeUser}</p>
    </div>
    <div>
      <p>{contact}</p>
      <p>{newUser}</p>
    </div>
  </div>
);

export const Applications: FC<Record<string, any>> = () => {

  const [state, setState] = useState<any>([])
  const [district, setDistrict] = useState<any>([])
  const [city, setCity] = useState<any>([])

  const [roomType, setRoomType] = useState<any>([])
  const [roomTypeId, setRoomTypeId] = useState<string>("-1")
  const [roomCapacityTo, setRoomCapacityTo] = useState<string>("0")
  const [roomCapacityfrom, setRoomCapacityFrom] = useState<string>("0")
  const [roomRateFrom, setRoomRateFrom] = useState<string>("0")
  const [roomRateTo, setRoomRateTo] = useState<string>("0")
  const [searchText, setSearchText] = useState<string>("")
  const [instituteList, setInstituteList] = useState<any>([])
  const { initialState, setInitialState } = useModel('@@initialState');
  // const { data, loading, run } = useRequest((values: any) => {
  //   console.log('form data', values);
  //   return queryFakeList({
  //     count: 8,
  //   });
  // });

  console.log(initialState)



  // const list = data?.list || [];
  var list: ListItemDataType[] | undefined = [];



  useEffect(() => {
    getRoomType();
    getInstituteList({ searchText: "", roomTypeID: "-1", roomRateTo:"0",roomRateFrom:"0",roomCapacityTo:"0",roomCapacityfrom:"0" });
  }, [])
  const getState = async () => {
    const res = await requestGetState();
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { value: item.stateID, label: item.stateName }
      })
      console.log({ dataMaskForDropdown })
      setState(dataMaskForDropdown)
    }
  }
  const getCity = async (value: any, item: any) => {
    const res = await requestGetCity(item);
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { value: item.cityID, label: item.cityName }
      });
      setCity(dataMaskForDropdown);
    }
  }
  const getDistrict = async (value: any, item: any) => {
    const res = await requestGetDistrict(item);
    if (res.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return { value: item.districtID, label: item.districtName }
      })
      setDistrict(dataMaskForDropdown)
    }
  }

  const { RangePicker } = DatePicker;
  const dateFormat = 'DD/MMM/YYYY';
  const getRoomType = async () => {
    const res = await requestGetRoomType({});
    if (res?.length > 0) {
      const dataMaskForDropdown = res?.map((item: any) => {
        return ({ label: item.roomTypeName, value: item.roomTypeID })
      })
      setRoomType(dataMaskForDropdown)
    }
  }
  const getInstituteList = async ({roomTypeID,roomRateTo,roomRateFrom,roomCapacityTo,roomCapacityfrom}:any) => {
    // console.log({ valuese: values })
    try {
      const params = {
        instituteID: "-1",
        searchText: searchText,
        mobileNo: "",
        emailID: "",
        phoneNo: "",
        stateID: "-1",
        districtID: "-1",
        cityID: "-1",
        areaID: "-1",
        smallerESTDDate: '2023-08-16T09:53:27.751Z',
        smallerThanRank: "0",
        greatorThanFaculty: "0",
        greatorThanStudent: "0",
        roomTypeID: roomTypeID,
        roomCapacityfrom: roomCapacityfrom,
        roomCapacityTo: roomCapacityTo,
        roomRateFrom: roomRateFrom,
        roomRateTo: roomRateTo,
        userID: "-1",
        formID: "-1",
        type: "1",
      }
      const msg = await requestGetInstituteList(params);
      if (msg.isSuccess === true)
        setInstituteList(msg.data.institutelist2s)
      list = msg?.data.institutelist2s || [];
      console.log(msg.data.institutelist2s)
    } catch (error) {
      console.log({ error });
      message.error('please try again');
    }
  };
 

  const itemMenu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
          3d menu item
        </a>
      </Menu.Item>
    </Menu>
  );
  const onChange = (value: number | [number, number]) => {
    console.log('onChange: ', value);
  };

  const onRoomRateChange = (value: string | [number, number]) => {
    console.log('onAfterChange: ', value[0]);
    setRoomRateFrom(value[0].toString())
    setRoomRateTo(value[1].toString())
    getInstituteList({roomRateFrom:value[0].toString(),roomRateTo:value[1].toString(),searchText: searchText, roomTypeID: roomTypeId, roomCapacityTo:roomCapacityTo,roomCapacityfrom:roomCapacityfrom});
  };
  const onRoomCapacityChange = (value: any | [number, number]) => {
    console.log('onAfterChange: ', value[0]);
    setRoomCapacityFrom(value[0].toString())
    setRoomCapacityTo(value[1].toString())
    getInstituteList({roomCapacityfrom:value[0].toString(),roomCapacityTo:value[1].toString(),roomRateFrom:roomRateFrom,roomRateTo:roomRateTo,searchText: searchText, roomTypeID: roomTypeId});
  };
  const onTextChange = (value: any) => {
    setSearchText(value.target.value)
  };
  const selectRoomType = (value: string) => {
    setRoomTypeId(value.toString())
    getInstituteList({roomCapacityfrom:roomCapacityfrom,roomCapacityTo:roomCapacityTo,roomRateFrom:roomRateFrom,roomRateTo:roomRateTo,searchText: searchText, roomTypeID: value.toString()});

  };
  const getDetails = (item: any) => {
    localStorage.setItem('instituteId', JSON.stringify(item.instituteID));
    setTimeout(() => {
      history.push("../booking/institute-details", "item");
    }, 100)
    console.log(item)
  };

  return (
    <Row>
      <Col span={6}>
        <Card bordered={false}>
          <Form
            onFinish={getInstituteList}
            onValuesChange={(_, values) => {
              // run(values);
            }}
          >
            <Col >
              <h4>Room Rate</h4>
              <Slider onChange={onChange} onAfterChange={onRoomRateChange} min={100} max={1000} range={{ draggableTrack: true }} defaultValue={[100, 350]} />
              <h4>Room Capacity</h4>
              <Slider onAfterChange={onRoomCapacityChange} min={100} max={1000} range={{ draggableTrack: true }} defaultValue={[100, 300]} />

              <h4>Room Type</h4>
                  
              <Form.Item {...formItemLayout} name="roomTypeID"   style={{ width: '100%'}}>
                <Select
                popupMatchSelectWidth={false }
                  // style={{ width: '100%' }}
                  onSelect={selectRoomType}
                  showSearch
                  placeholder="Room Type"
                  optionFilterProp="children"
                  options={roomType}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <h4>Search</h4>
              <Form.Item style={{ border: "1px solid grey", borderRadius: 8 }} >
                <Input
                  onChange={onTextChange}
                  bordered={false}
                  placeholder="Search"
                />
              </Form.Item>
              <Row>
              <Button style={{width:100}} type="primary" htmlType="submit" shape="default" icon={<SearchOutlined />} />
              </Row>
            </Col>
          </Form>
        </Card>
      </Col>
      <Col span={18}>
        <List
          size="large"
          // loading={loading}
          dataSource={instituteList}
          renderItem={(item: any) => (
            <List.Item
            // style={{width:"100%",backgroundColor:'blue'}}
            >
              <Card
                onClick={() => getDetails(item)}
                style={{ width: "100%" }}
                hoverable
                bodyStyle={{ paddingBottom: 10, width: "100%" }}
                actions={[
                  // <Tooltip key="download" title="download">
                  //   <DownloadOutlined />
                  // </Tooltip>,

                ]}
              >
                <Card.Meta avatar={<Avatar size="small" src={"item.avatar"} />} title={item?.instituteName} />
                <div className='cardItemContent'>
                  <CardInfo
                    activeUser={`#InstituteID : ${item?.instituteID}`}
                    newUser={`Institute Address : ${item?.instituteAddress}`}
                    contact={`Contact : ${item?.mobileNo}`}
                  />
                  <Link href={item?.website} target={item?.website}>
                    {item?.website}
                  </Link>

                </div>
              </Card>
            </List.Item>
          )}
        />
      </Col>

    </Row>
  );
};

export default Applications;
