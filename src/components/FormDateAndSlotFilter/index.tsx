import React, { useState, useEffect } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel, useParams } from '@umijs/max';
import { Card, Col, Form, Row, DatePicker, Typography, Select, Button } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import moment from 'moment';
import { requestGetSlot } from '@/services/apiRequest/dropdowns';
import { convertDate } from '@/utils/helper';
import { getAvailableRoomDate, setAvailableRoomDate } from '@/utils/common';

const { RangePicker }: any = DatePicker;
const { Title, Text, Link } = Typography;



const FormDateAndSlotFilter: React.FC = ({ bookingToDate, bookingFromDate, selectedSlot, onSubmit }: any) => {

  const [slots, setSlots] = useState<any>([{ label: `All`, value: -1 }])

  const [form] = Form.useForm();
  const { id } = useParams();
  const dateFormat = 'DD-MM-YYYY';

  useEffect(() => {
    getSlot();
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      date: [dayjs(bookingFromDate, dateFormat), dayjs(bookingToDate, dateFormat)],
      slotID: selectedSlot
    });
  }, [bookingFromDate, bookingToDate])

  const getSlot = async () => {
    const res = await requestGetSlot();
    if (res?.data?.length > 0) {
      const dataMaskForDropdown = res?.data?.map((item: any) => {
        return { label: `${item.slotName} - [${item.slotFromTime} ${item.slotToTime}]`, value: item.slotID }
      })
      let addAll = [...slots]
      setSlots([...addAll, ...dataMaskForDropdown])
    }
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().subtract(1, 'day');
  };

  const onSubmitDateRange = async (values: any) => {
    console.log({ values });
    let fromDate = convertDate(values?.date[0]);
    let toDate = convertDate(values?.date[1]);
    const data: any = { fromDate, toDate, slotId: values?.slotID };
    console.log({ data })
    setAvailableRoomDate(data)
    onSubmit(data)
  }

  return (
    <Card bordered={false} style={{}}>
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        initialValues={
          {
            date: [dayjs(bookingFromDate, dateFormat), dayjs(bookingToDate, dateFormat)],
            slotID: selectedSlot
          }
        }
        onFinish={onSubmitDateRange}
      >

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="date"
              label="Booking Date"
              rules={[{ required: true, message: 'Please select booking Date' }]}
            >
              <RangePicker
                size="large"
                disabledDate={disabledDate}
                format={'DD-MMM-YYYY'}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="slotID"
              label="Slot"
              rules={[{ required: true, message: 'Please select Slot' }]}
            >
              <Select
                size="large"
                placeholder="Slot"
                optionFilterProp="children"
                options={slots}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ marginTop: "9%" }}>
              <Button
                size='large'
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  )
};

export default FormDateAndSlotFilter;
