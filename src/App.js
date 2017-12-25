import React, {Component} from 'react';
import {Button} from 'antd';
import {Collapse} from 'antd';
import 'whatwg-fetch';
import './App.css';

const Panel = Collapse.Panel;

class App extends Component {

    state = {
        pushloading: false,
        pushinfo: '',
        mysqlinstallloading: false,
        mysqlip: '',
        mysqlinfo: '',
        hostlist: '',
    }

    /**
     * 获取主机列表
     */
    getHostList = () => {

        fetch('http://192.168.91.130:8080/ansible/get_host_list', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain'
            },
            mode: 'cors'
        }).then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    this.setState({
                        hostlist: data.data,
                    })
                }
                else {
                    this.setState({
                        hostlist: data.msg,
                    })
                }

            })
            .catch(e => console.log("Oops, error", e))
    }

    /**
     * 推送公钥
     */
    pushRsa = () => {
        this.setState({pushloading: true});

        fetch('http://192.168.91.130:8080/ansible/push_rsa', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain'
            },
            mode: 'cors'
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    pushinfo: data.msg,
                    pushloading: false
                })
            })
            .catch(e => console.log("Oops, error", e))
    }


    /**
     * mysql安装
     */
    installMysql = () => {
        this.setState({mysqlinstallloading: true});

        let formData = new FormData();
        formData.append('ip', this.state.mysqlip);

        fetch('http://192.168.91.130:8080/ansible/install_mysql', {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    this.setState({
                        mysqlinfo: 'root密码：' + data.data.password +
                        ' 用户账号：' + data.data.newusername + ' 用户密码：' + data.data.newpassword,
                        mysqlinstallloading: false
                    })
                }
                else {
                    this.setState({
                        mysqlinfo: data.msg,
                        mysqlinstallloading: false
                    })
                }
            })
            .catch(e => console.log("Oops, error", e))
    }
    mysqlIpChange = (e) => {
        this.setState({mysqlip: e.target.value});
    }


    /**
     * 页面
     * @returns {*}
     */
    render() {
        return (
            <div className="App">
                <Button type="primary" onClick={this.getHostList}>
                    获取主机列表
                </Button>
                <Collapse accordion>
                    <Panel header="主机列表" key="1">
                        <p>{this.state.hostlist}</p>
                    </Panel>
                </Collapse>
                <Button className="Button" type="primary" loading={this.state.pushloading} onClick={this.pushRsa}>
                    推送公钥给所有主机
                </Button>
                <div className="Info">
                    {this.state.pushinfo}
                </div>
                <input placeholder="输入要部署MySQL的主机IP" value={this.state.mysqlip} onChange={this.mysqlIpChange}/>
                <Button type="primary" loading={this.state.mysqlinstallloading} onClick={this.installMysql}>
                    部署MySQL
                </Button>
                <div>
                    {this.state.mysqlinfo}
                </div>
            </div>
        );
    }
}

export default App;
