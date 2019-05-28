import React from 'react';
import $ from 'jquery';
import {Input,Form,Select} from 'antd';


function handleChange(value) {
  console.log(`selected ${value}`);
}


class UserRoleForm extends React.Component{
    constructor(){
        super();
        this.state={
            roles:[],
            role:{},
            users:[],
            user:{}
        }
    }

    // 网络初始化
  componentWillMount(){
    this.loadRole();
    this.loadUser();
  }


    loadRole(){
        let url="http://203.195.251.185:8787/role/findAll";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    roles:data
                })
            }else{
                alert("异常");
            }

        });
    }


    loadUser(){
        let url="http://203.195.251.185:8787/user/findAll";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    users:data
                })
            }else{
                alert("异常");
            }

        });
    }   

      

     //校验
     handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
    };

    // handleChange=value=> {
    //   this.setState({
    //     teachers:value
    //   })
    // }


    render(){
        let {roles,users}=this.state;
        const { getFieldDecorator } = this.props.form;
        getFieldDecorator("id");
        getFieldDecorator("userId");
        getFieldDecorator("roleId");


        const Option = Select.Option;

        return(
            <div className="courseform">
                <Form onSubmit={this.handleSubmit} className="login-form">

                    <Form.Item label="角色名称">
                        {getFieldDecorator('roleId')
                        (
                          <Select defaultValue={roles.roleId} style={{ width: 120 }} onChange={handleChange} placeholder="Select">
                            {roles.map(role => (
                                <Option key={role.id}>{role.name}</Option>
                                
                            ))}
                          </Select>
                        )}
                    </Form.Item>

                    <Form.Item label="用户名称">
                        {getFieldDecorator('userId')
                        (
                          <Select defaultValue={users.userId} style={{ width: 120 }} onChange={handleChange} placeholder="Select">
                            {users.map(user => (
                                <Option key={user.id}>{user.name}</Option>
                            ))}
                          </Select>
                        )}
                    </Form.Item>
                    
                </Form>
            </div>
        )
    }
}


// 将通过props从父组件中获取的值拿出来设置到表单元素上
const mapPropsToFields = (props)=>{
    let obj = {};
    for(let key in props.initData){
      let val = props.initData[key];
      obj[key] = Form.createFormField({value:val})
    }
    return obj;
}


export default Form.create({mapPropsToFields})(UserRoleForm);