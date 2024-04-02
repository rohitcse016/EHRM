import React from 'react';
import { Layout, Space } from 'antd';
import AddCandidate from './AddCandidate';

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
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
                <Layout>
                    <Header style={headerStyle}>
                        <h2>eCSC Candidate Registration</h2>
                    </Header>
                    <Content style={contentStyle}>
                        <AddCandidate />
                    </Content>
                    <Footer style={footerStyle}></Footer>
                </Layout>
            </Space>
        </>
    );
};

export default Registration;