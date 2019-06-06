import React from 'react';
import $ from 'jquery';
import {Table,Icon,Button,message,Modal} from 'antd';

import ProductForm from './ProductForm';


// 当服务端异常的时候都会执行该回调
$.ajaxSetup({
    error:function(){
      message.error("服务器端异常")
    }
  })
  


class Product extends React.Component{
    constructor(){
       
        super();
        this.state={
            products:[],
            product:{},
            visible:false
            
        }
    }


    componentWillMount(){
        this.loadProduct();
    }


    loadProduct(){
        let url="http://127.0.0.1:8787/product/findAllWithCategory";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    products:data,
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
                $.get("http://127.0.0.1:8787/product/deleteProductById?id="+id,({status,message})=>{
                    if(status===200){
                        this.loadProduct();
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
              let url ="http://127.0.0.1:8787/product/saveOrupdateProduct";
              $.post(url,values,({status,message})=>{
              if(status === 200){
                  message.success(message)
                  this.setState({ visible: false, });
                  // 页面刷新
                  this.loadProduct();
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
    
    
    
        // 点击添加按钮的执行函数
        toAdd(){
          this.setState({ 
          visible: true, 
          product:{}
          });
      }


      // 点击修改按钮的执行函数
    toEdit(record){
        this.setState({ 
        visible: true, 
        product:record
        });
    }

    toDetails(record){
        this.props.history.push({
            pathname:'/ProductDetails',
            state:record
        })
    }
    
    
      // ref函数
      ProductFormRefs = (form)=>{
        this.form = form;
      }


    

    render(){
        let {products}=this.state;

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
              title: '产品名称',
              dataIndex: 'name',
            },
            {
                title: '产品描述',
                dataIndex: 'description',
            },
            {
                title: '产品价钱',
                dataIndex: 'price',
            },
            {
                title: '产品种类',
                dataIndex: 'category.name',
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
                <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={this.state.products} bordered="true"/>

                <Modal
                    title="添加产品"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                     <ProductForm initData={this.state.product} ref={this.ProductFormRefs}/>
                </Modal>
            </div>
        )
    }
    
}


export default Product;