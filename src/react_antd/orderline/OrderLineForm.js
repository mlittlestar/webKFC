import React from 'react';
import $ from 'jquery';
import {Input,Form,Select} from 'antd';

function handleChange(value) {
  console.log(`selected ${value}`);
}


class OrderLineForm extends React.Component{
    constructor(){
        super();
        this.state={
            products:[],
            orders:[]
        }
    }

    // 网络初始化
  componentWillMount(){
    this.loadOrder();
    this.loadProduct();
  }


    loadOrder(){
        let url = "http://127.0.0.1:8787/order/findAllWithUser"
        $.get(url,({status,message,data})=>{
          if(status === 200){
            this.setState({
                orders:data,
            })
          } else {
            alert(message);
          }
        });
      }


    loadProduct(){
        let url = "http://127.0.0.1:8787/product/findAllWithCategory"
        $.get(url,({status,message,data})=>{
          if(status === 200){
            this.setState({
                products:data,
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
        let {products,orders}=this.state;
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;


        return(
            <div className="orderlineform">
                <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="订单数量">
                        {getFieldDecorator('num', {
                            rules: [{ required: true, message: 'Please input your num!' }],
                        })(
                            <Input placeholder="num"/>,
                        )}
                    </Form.Item>
                    <Form.Item label="产品名称">
                        {getFieldDecorator('productId')
                        (
                          <Select defaultValue={products.productId} style={{ width: 120 }} onChange={handleChange} placeholder="Select">
                            {products.map(productExtend => (
                                <Option key={productExtend.id}>{productExtend.name}</Option>
                            ))}
                          </Select>
                        )}
                    </Form.Item>

                    <Form.Item label="产品名称">
                        {getFieldDecorator('orderId')
                        (
                          <Select defaultValue={orders.orderId} style={{ width: 120 }} onChange={handleChange} placeholder="Select">
                            {orders.map(orderExtend => (
                                <Option key={orderExtend.id}>{orderExtend.status}</Option>
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


export default Form.create({mapPropsToFields})(OrderLineForm);