import React from 'react';
import $ from 'jquery';
import {Input,Form,Select} from 'antd';

function handleChange(value) {
  console.log(`selected ${value}`);
}


class ProductForm extends React.Component{
    constructor(){
        super();
        this.state={
            categorys:[],
            category:{}
        }
    }

    // 网络初始化
  componentWillMount(){
    this.loadCategory();
  }


    loadCategory(){
        let url = "http://127.0.0.1:8787/category/findAll"
        $.get(url,({status,message,data})=>{
          if(status === 200){
            this.setState({
                categorys:data,
            })
          } else {
            alert(message);
          }
        });
      }

      // handleChange=e=>{
      //   e.preventDefault();
      //   this.setState({id})
      // }

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
        let {categorys}=this.state;
        const { getFieldDecorator } = this.props.form;
        getFieldDecorator("id");
        getFieldDecorator("name");
        getFieldDecorator("description");
        getFieldDecorator("price");
        getFieldDecorator("categoryId");


        const Option = Select.Option;

        return(
            <div className="courseform">
                <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="产品名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input your name!' }],
                        })(
                            <Input placeholder="name"/>,
                        )}
                    </Form.Item>
                    <Form.Item label="产品描述">
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: 'Please input your description!' }],
                        })(
                            <Input placeholder="description"/>,
                        )}
                    </Form.Item>
                    <Form.Item label="产品价钱">
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: 'Please input your credit!' }],
                        })(
                            <Input placeholder="price"/>,
                        )}
                    </Form.Item>
                    <Form.Item label="种类">
                        {getFieldDecorator('categoryId')
                        (
                          <Select defaultValue={categorys.categoryId} style={{ width: 120 }} onChange={handleChange} placeholder="Select">
                            {categorys.map(category => (
                                <Option key={category.id}>{category.name}</Option>
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


export default Form.create({mapPropsToFields})(ProductForm);