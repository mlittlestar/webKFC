import React from 'react';
import $ from 'jquery';
import {Table,Button,Icon,Modal} from 'antd';

import OrderLineForm from './OrderLineForm';


class OrderLine extends React.Component{
    constructor(){
        super();
        this.state={
            orderlines:[],
            orderline:{},
            visible:false
        }
    }

componentWillMount(){
    this.loadOrderLine();
}


    loadOrderLine(){
        let url="http://127.0.0.1:8787/orderLine/findAllWithOrderAndProduct";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    orderlines:data,
                })
            }else{
                alert("异常");
            }
        })
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
                $.get("http://127.0.0.1:8787/orderLine/deleteOrderLineById?id="+id,({status,message})=>{
                    if(status===200){
                        this.loadOrderLine();
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

    toAdd(record){
        this.setState({
            visible:true,
            orderline:record
        })
    }


    toEdit(record){

    }

    toDetails(record){

    }

    // ref函数
    OrderLineFormRefs = (form)=>{
        this.form = form;
    }

    render(){
        let {orderlines,productwithc,orderwithu,form}=this.state;
        
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
              title: '订单数量',
              dataIndex: 'num',
            },
            {
                title: '产品名称',
                dataIndex: 'productExtend.name',
            },
            {
                title: '产品价钱',
                dataIndex: 'productExtend.price',
            },
            {
                title: '订单时间',
                dataIndex: 'order.orderTime',
            },
            {
                title: '订单状态',
                dataIndex: 'order.status',
            },
            {
                title: '用户信息',
                dataIndex: 'orderExtend.user.name',
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
            <div className="orderline">
                <div className="btn">
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加</Button>
                    <Button type="danger">批量下架</Button>
                </div>

                <Table columns={columns} dataSource={this.state.orderlines} bordered="true"/>

                <Modal
                    title="添加订单链"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                     <OrderLineForm initData={this.state.order} ref={this.OrderLineFormRefs}/>
                </Modal>
            </div>
        )
    }
}




export default OrderLine;