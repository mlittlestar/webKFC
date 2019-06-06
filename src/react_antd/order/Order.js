import React from 'react';
import $ from 'jquery';
import {Table,Button,Modal,message,Icon} from 'antd';

import OrderForm from './OrderForm';

class Order extends React.Component{
    constructor(){
        super();
        this.state={
            orders:[],
            order:{},
            visible:false
        }
    }

    componentWillMount(){
        this.loadOrder();
    }

    loadOrder(){
        let url="http://127.0.0.1:8787/order/findAllWithUser";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    orders:data
                })
            }else{
                alert("异常");
            }

        });
    }

    //通过id删除
    toDelete=(id)=>{
        Modal.confirm({
            title: '是否要删除',
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk:()=> {
                //进行删除
                $.get("http://127.0.0.1:8787/order/deleteOrderById?id="+id,({status,message})=>{
                    if(status===200){
                        this.loadOrder();
                    }else{
                        alert(message);
                    }
                })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }


    handleOk = e => {
        // 1. 获取表单数据
          e.preventDefault();
          this.form.validateFields((err, values) => {
          if (!err) {
              console.log(values)
              let url ="http://127.0.0.1:8787/order/saveOrupdateOrder";
              $.post(url,values,({status,message})=>{
              if(status === 200){
                  message.success(message)
                  this.setState({ visible: false, });
                  // 页面刷新
                  this.loadOrder();
          } else {
                  message.error(message);
          }
        })
      }
      });
          // 2. 与后台交互完成保存或更新
          // 3. 关闭模态框，刷新页面
          // this.setState({ visible: false, });
      };
    
      // 点击了模态框的取消按钮
      handleCancel = e => {
      this.setState({ visible: false, });
      };




    toAdd(record){
        this.setState({
            visible:true,
            order:record
        })
    }

    toEdit(record){
        this.setState({
            visible:true,
            order:record
        })
    }

    toDetails(){

    }


    // ref函数
    OrderFormRefs = (form)=>{
        this.form = form;
      }

    render(){
        let {orders,order}=this.state;
         // ID前面有框
         const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // this.setState({ids:selectedRowKeys});
                console.log(selectedRowKeys);
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
        };


        const columns = [
            {
              title: 'ID',
              dataIndex: 'id',
              render: text => <a href="javascript:;">{text}</a>,
            },
            {
              title: '订单时间',
              dataIndex: 'orderTime',
            },
            {
                title: '订单状态',
                dataIndex: 'status',
            },
            {
                title: '用户',
                dataIndex: 'user.name',
            },
            {
                title: '操作',
                width:100,
                align:'center',
                render: (val,record) =>{
                    return(
                        <div>
                            <Icon type="delete" onClick={this.toDelete.bind(this,record.id)}/>&nbsp;
                            <Icon type="edit" onClick={this.toEdit.bind(this,record)}/>&nbsp;
                            <Icon type="eye" onClick={this.toDetails.bind(this,record)}/>
                        </div>
                    )
                }
            }
          ]; 

        return(
            <div className="product">
                {/* 按钮 */}
                <div className="btn">
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加</Button>&nbsp;
                    <Button type="danger">批量删除</Button>
                </div>
                <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={this.state.orders} bordered="true"/>

                <Modal
                    title="添加课程"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                     <OrderForm initData={this.state.order} ref={this.OrderFormRefs}/>
                </Modal>
            </div>
        )
    }
}

export default Order;