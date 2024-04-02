import React, { useRef, useState } from 'react';
import { Layout, Space } from 'antd';
import AddInstituteUser from './AddUser';
import ChangePassword from './ChangePassword';
import { history} from '@umijs/max';

const { Header, Footer, Content } = Layout;



const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#000000',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#ffffff',
};

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#ffffff',
    paddingTop: 70
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#ffffff',
};



const Registration = ({ visible, onClose, onSaveSuccess }: any) => {
    const [openchangepassword, setOpenchangepassword] = useState(false);
    const onCloseAddCandidate = () => {
        //setOpenchangepassword(false);
        const urlParams = new URL(window.location.href).searchParams;
       // setTimeout(() => {
            history.push(urlParams.get('redirect') || '/welcome');
        //}, 1000)
      };
    

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
                <Layout>
                    <Header style={headerStyle}>
                        <h2>User Change Password</h2>
                    </Header>
                    <Content style={contentStyle}>
                        {/* <AddInstituteUser /> */}
                        <ChangePassword
        visible={true}
        onClose={onCloseAddCandidate}
     
      />
                    </Content>
                    <Footer style={footerStyle}></Footer>
                </Layout>
            </Space>
        </>
    );
};

export default Registration;