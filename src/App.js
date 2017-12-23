import React, {Component} from 'react';
import {Button} from 'antd';
import 'whatwg-fetch';
import './App.css';

class App extends Component {

    state = {
        pushloading: false,
        pushinfo: '',
        mysqlinstallloading: false,
        mysqlip:'',
        mysqlinfo: '',
    }

    pushRsa = () => {
        this.setState({pushloading: true});

        fetch('http://192.168.91.130:8080/ansible/pushrsa', {
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

    mysqlIpChange = (e) => {
        this.setState({mysqlip:e.target.value});
    }

    installMysql = () => {
        this.setState({mysqlinstallloading: true});

        let formData = new FormData();
        formData.append('ip',this.state.mysqlip);

        fetch('http://192.168.91.130:8080/ansible/installmysql', {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    mysqlinfo: '账号：' + data.data.username + ' 密码：' + data.data.password,
                    pushloading: false
                })
            })
            .catch(e => console.log("Oops, error", e))
    }

    render() {
        return (
            <div className="App">
                <Button type="primary" loading={this.state.pushloading} onClick={this.pushRsa}>
                    推送公钥给所有主机
                </Button>
                <input value={this.state.mysqlip} onChange={this.mysqlIpChange} />
                <Button type="primary" loading={this.state.mysqlinstallloading} onClick={this.installMysql}>
                    部署MySQL
                </Button>
                <div>
                    {this.state.pushinfo}
                </div>
                <div>
                    {this.state.mysqlinfo}
                </div>
            </div>
        );
    }
}

export default App;
