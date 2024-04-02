import React, { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Space, Avatar, Image } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { updateCandidateProfileImage } from '@/services/apiRequest/api';
import { getUserInLocalStorage } from '@/utils/common';
import { requestGetCandidateList } from '@/pages/Candidate/services/api';

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

const UpdateProfileImage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const { verifiedUser }: any = getUserInLocalStorage();
    const [selectedRows, setSelectedRows] = useState<Object>({});
    const [fileList, setFileList] = useState<UploadFile[]>([])

    useEffect(() => {
        getUserDetails();
    }, [])

    const getUserDetails = async () => {
        const params = {
            "onlinePatientID": verifiedUser?.userID,
            "userID": -1,
            "formID": -1,
            "type": 1
        }
        const res = await requestGetCandidateList(params);
        console.log({ res })
        setSelectedRows(res.result[0])
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

    const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, async (url) => {

                const param = {
                    candidateID: verifiedUser?.userID,
                    profileImage: url,
                    userID: verifiedUser?.userID,
                    formID: "-1",
                    type: "1"
                };
                const res = await updateCandidateProfileImage(param);
                console.log(res);
                if (res.isSuccess === "True") {
                    console.log(res.msg)
                    message.success(res.msg);
                    getUserDetails();
                } else {
                    message.error("Something went wrong. Please try again");
                }
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Space align="center" size={24}>
                {/* <Avatar size={100} icon={
                    <Image
                        src={`data:image/png;base64,${selectedRows?.profileImage}`}
                        width={200}
                    />
                } /> */}
                <Avatar size={120} 
                // icon={
                //     <Image
                //         style={{borderColor:'red',borderWidth:5}}
                //         src={selectedRows?.profileImage ?
                //             `data:image/png;base64,${selectedRows?.profileImage}`
                //         : "https://bootdey.com/img/Content/avatar/avatar6.png"}
                //         width={200}
                //     />
                // }
                src={selectedRows?.profileImage ?
                    `data:image/png;base64,${selectedRows?.profileImage}`
                : "https://bootdey.com/img/Content/avatar/avatar6.png"}
                />
                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    onPreview={onPreview}
                    maxCount={1}
                >
                    {uploadButton}
                </Upload>
            </Space>

        </>
    );
};

export default UpdateProfileImage;