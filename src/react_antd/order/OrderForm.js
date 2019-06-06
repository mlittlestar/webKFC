import React from 'react';
import $ from 'jquery';
import {Form,Select,Input} from 'antd';


function handleChange(value) {
    console.log(`selected ${value}`);
  }

class OrderForm extends React.Component{

    constructor(){
        super();
        this.state={
            users:[],
            user:{}
        }
    }

    componentWillMount(){
        this.loadUser();
    }

    loadUser(){
        let url = "http://127.0.0.1:8787/user/findAll"
        $.get(url,({status,message,data})=>{
          if(status === 200){
            this.setState({
                users:data,
            })
          } else {
            alert(message);
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


    render(){
        let {users}=this.state;
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        return(
            <div className="orderform">
                <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="订单时间">
                        {getFieldDecorator('orderTime', {
                            rules: [{ required: true, message: 'Please input your orderTime!' }],
                        })(
                            <Input placeholder="orderTime"/>,
                        )}
                    </Form.Item>
                    <Form.Item label="订单状态">
                        {getFieldDecorator('status', {
                            rules: [{ required: true, message: 'Please input your status!' }],
                        })(
                            <Input placeholder="status"/>,
                        )}
                    </Form.Item>
                    
                    <Form.Item label="用户姓名">
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


export default Form.create({mapPropsToFields})(OrderForm);