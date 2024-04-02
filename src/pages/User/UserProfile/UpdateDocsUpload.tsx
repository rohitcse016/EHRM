import React, { useState, useEffect } from 'react';
import { FileAddOutlined, FileImageOutlined, LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Upload, Space, Avatar, Image, List, Row, Col, Skeleton, Button, Typography, Form, Card } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { getUserInLocalStorage } from '@/utils/common';
import { addCandidateDoc, getCandidateDoc, requestGetCandidateList, requestGetDocuments } from '@/pages/Candidate/services/api';


const { Title } = Typography;

const getBase64 = async (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
        message.error('Image must smaller than 10MB!');
    }
    return isJpgOrPng && isLt2M;
};

const UpdateDocsUpload: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const { verifiedUser }: any = getUserInLocalStorage();
    const [docsList, setDocsList] = useState<any>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [docName, setDocName] = useState<any>("")
    const [docList, setDocList] = useState<any>([])
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem("user") as string);


    useEffect(() => {
        getOnlinePatient();
    }, [])

    const getOnlinePatient = async (type: any = 2) => {
        const { verifiedUser } = getUserInLocalStorage();

        const params = {
            "onlinePatientID": verifiedUser?.userID,
            "userID": -1,
            "formID": -1,
            "type": type
        }
        const res = await requestGetCandidateList(params);
        if (res.isSuccess = true) {
            setDocList(res.result3)
        }
    }

    const downloadDoc = async (item: any) => {
        const params = {
            fileName: item.a11_OnlinePatientID + "_" + item.docID,
            filePath: ""
        }
        const res1 = await requestGetDocuments(params);
        //window.location.href = `data:application/octet-stream;base64,${res1.result}`;
        if (res1.isSuccess == true) {
            fetch(window.location.href)
                .then(resp => resp.blob())
                .then(blob => {
                    const url = `data:application/octet-stream;base64,${res1.result}`;
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = prompt("Enter filename and extension (e.g. myImage.jpg):", window.location.href.split('\/').pop() === "" ? window.location.hostname + ".html" : item.docName);
                    document.body.appendChild(a);
                    if (a.download !== "null") {
                        a.click();
                        alert('Your file ' + a.download + ' has downloaded!');
                    }
                    window.URL.revokeObjectURL(url);
                })
                .catch(() => alert('Could not download file.'));
        }
        else {
            message.error("File Not Found")
        }
        // window.location.href = file;
        //console.log(res1)
    }
    const previewDoc = async (item: any) => {
        const params = {
            fileName: item.a11_OnlinePatientID + "_" + item.docID,
            filePath: ""
        }
        const res1 = await requestGetDocuments(params);
        if (res1.isSuccess == true) {
            setImageUrl(`data:image/png;base64,${res1.result}`)
            if (res1.result.startsWith("JVB")) {
                window.open(`data:application/pdf;base64,${res1.result}`);
            }
        }
        else {
            message.error("File Not Found")
        }
        // window.location.href = file;
        //console.log(res1)
    }

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    const onUpload = (info: any) => {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        if (info.file.status === 'done') {
            const getValue = getBase64(info.file.originFileObj as RcFile, async (url) => {
                // console.log(url, info.file.name)
                const param = {
                    "fileName": info.file.name,
                    "data": url
                }
                // const res = await requestFileUpload(param);
                // if (res.isSuccess == true)
                //     message.success(`${res.msg}`);
                // else
                //     message.error(`Some Error Occurred`);
            })
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }

    }
    const addPatientDoc = async (values: any) => {
        var re = /(?:\.([^.]+))?$/;
        var ext = re?.exec(docName)[1];
        console.log(values)

        const params = {
            "onlinePatientID": user?.verifiedUser?.userID,
            "slNo": 1,
            "docName": docName,
            "docExt": ext,
            "docPath": "",
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        // const res = await requestAddOnlinePatDoc(params);

        // // console.log(res.result['0'].docID);

        // if (res?.isSuccess == true) {
        //     const param1 = {
        //         "fileName": res?.result['0']?.docID,
        //         "data": values.docBase64
        //     }
        //     const res1 = await requestFileUpload(param1);

        //     if (res1.isSuccess == true) {
        //         message.success(res1.msg)
        //         getOnlinePatient()
        //     }
        //     else
        //         message.error(res1.msg)
        // }
    }

    return (
        <>
            <Form
                layout={'vertical'}
                form={form}
                onFinish={async (values) => {
                    addPatientDoc(values)
                }}>
                <Row>

                    <Form.Item
                        name="docBase64"
                        getValueFromEvent={(v) => getBase64(v.file.originFileObj as RcFile, (url) => {
                            form.setFieldsValue({ docBase64: url })
                            setDocName(v.file.name)
                        })}
                        label=""
                        rules={[{ required: false, message: 'Please Enter PhoneAC' }]}
                    >
                        <Upload
                            maxCount={1}
                        >
                            <Button icon={<FileAddOutlined />}>Attach</Button>
                        </Upload>
                    </Form.Item>
                    <Button htmlType='submit'>Submit</Button>
                </Row>

            </Form>
            <List
                dataSource={docList}
                renderItem={(item) => (
                    <Card style={{ boxShadow: '2px 2px 2px #4874dc', marginTop: 8 }} key={item.docID}>
                        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Row>
                                <Image
                                    onClick={() => previewDoc(item)}
                                    preview={{
                                        imageRender: () => (
                                            <Image
                                                width="50%"
                                                src={imageUrl}
                                                preview={false}
                                            />
                                        )
                                    }}
                                    width={50}
                                    height={50}
                                    style={{ borderRadius: 10 }}
                                    src={item.docExt=="pdf" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/391px-PDF_file_icon.svg.png"
                                        :item.docExt=="png"||item.docExt=="jpg" ? "https://img.freepik.com/free-photo/yellow-flower-green-background_1340-31703.jpg?t=st=1703678882~exp=1703682482~hmac=db2ea321b3844d6f0b22893020850a836e62bc82f64fc2dba66c956d77360baa&w=360"
                                        :"noImage"    
                                    }
                                        />
                                <Typography style={{ marginLeft: 10 }}>{item.docName}</Typography>
                            </Row>
                            <Button onClick={() => downloadDoc(item)}>Download</Button>
                        </Row>
                    </Card>
                )}
            />


        </>
    );
};

export default UpdateDocsUpload;