import React, { useState } from 'react';
import {
    CarOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    OpenAIOutlined,
    TableOutlined,

    UserOutlined,

} from '@ant-design/icons';
import { GrServices } from "react-icons/gr";
import { FaBlog } from "react-icons/fa6";
import { MdSource } from "react-icons/md";
import { MdOutlineNewspaper } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { BiCategoryAlt } from 'react-icons/bi';
import { Button, Dropdown, Layout, Menu, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import { Link, Outlet, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import './Home.scss'








const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate()
    const items = [
        {
            key: '1',
            label: (
                <Link to={'/'}>Log out</Link>
            ),
        },];
    const logOut = () => {
        localStorage.removeItem('access_token')
        navigate('/')
    }

    return (
        <>
            <Layout>
                <Sider
                    width={220}
                    className='sider'
                    trigger={null}
                    collapsible
                    collapsed={collapsed}>
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[
                            {
                                key: '0',
                                icon: collapsed && <img width={40} src={logo} />,
                                label: <Link  to={''} ><h3>Loyal</h3></Link>,
                            },

                            {
                                key: '2',
                                icon: <BiCategoryAlt />,
                                label: <Link to={'category'} >Category</Link>,
                            },
                            {
                                key: '3',
                                icon: <MdOutlineNewspaper />                                ,
                                label: <Link to={'brand'} >News</Link>,
                            },
                            {
                                key: '4',
                                icon: <FaQuestionCircle />,
                                label: <Link to={'model'} >Faq</Link>,
                            },
                            {
                                key: '5',
                                icon:<FaBlog />,
                                label: <Link to={'loc'} >Blog</Link>,
                            },
                            {
                                key: '6',
                                icon: <MdSource />,
                                label: <Link to={'city'} >Sources</Link>,
                            },
                            {
                                key: '7',
                                icon: <GrServices />,
                                label: <Link to={'cars'} >Services</Link>,
                            },


                        ]}
                    />
                </Sider>
                <Layout>
                    <Header
                        className='header'
                        style={
                            collapsed
                                ? {
                                    padding: 0,
                                    background: colorBgContainer,
                                    position: "fixed",
                                    right: 0,
                                    width: "calc(100% - 80px)",

                                }
                                : {
                                    padding: 0,
                                    background: colorBgContainer,
                                    position: "fixed",
                                    right: 0,
                                    width: "calc(100% - 220px)",
                                }
                        }

                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}

                            />

                            <Dropdown
                                onClick={logOut}
                                menu={{
                                    items,
                                }}
                                placement="bottom"
                            >
                                <Button type='primary'


                                    icon={<UserOutlined />}

                                    style={{
                                        marginRight: '20px'
                                    }}>Admin</Button>

                            </Dropdown>
                        </div>


                    </Header>
                    <Content
                        style={{
                            // margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>



        </>
    )
}

export default Home
