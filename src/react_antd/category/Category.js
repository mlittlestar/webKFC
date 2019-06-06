import React from 'react';
import $ from 'jquery';
import { Table,Button,Icon,Modal,message } from 'antd';
import CategoryForm from './CategoryForm'

// 当服务端异常的时候都会执行该回调
$.ajaxSetup({
    error:function(){
      message.error("服务器端异常")
    }
  })
  



class Category extends React.Component{
    constructor(){
        super();
        this.state={
            categorys:[],
            category:{},
            visible:false
        }
    }

    componentWillMount(){
        this.loadCategory();
    }


    loadCategory(){
        let url="http://127.0.0.1:8787/category/findAll";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    categorys:data
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
                $.get("http://127.0.0.1:8787/category/deleteByCategoryId?id="+id,({status,message})=>{
                    if(status===200){
                        this.loadCategory();
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


    // 点击修改按钮的执行函数
    toEdit(record){
        this.setState({ 
        visible: true, 
        category:record
        });
    }

    //点击查看详细信息
    toDetails(record){
        this.props.history.push({
          pathname:'/CategoryDetails',
          state:record,
        });
        
    }


    toAdd(){
        this.setState({ 
            visible: true, 
            category:{}
            });
    }



    //模态框的确认
    handleOk = e => {
        // 1. 获取表单数据
           e.preventDefault();
           this.form.validateFields((err, values) => {
           if (!err) {
               console.log(values)
               let url ="http://127.0.0.1:8787/category/saveOrupdateCategory";
               $.post(url,values,({status,message})=>{
               if(status === 200){
                   message.success(message)
                   this.setState({ visible: false, });
                   // 页面刷新
                   this.loadCategory();
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
    //处理模态框的取消
    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };


    // ref函数
    CategoryFormRefs = (form)=>{
        this.form = form;
    }
    
    render(){
        let {categorys}=this.state;

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
              title: '种类',
              dataIndex: 'name',
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
            <div className="category">
                <div className="btn">
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加</Button>
                    <Button type="danger">批量删除</Button>
                </div>
                {/* 表格 */}
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.categorys} bordered="true"/>

                {/* 弹出框 */}
                <Modal
                    title="添加用户"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                     <CategoryForm  initData={this.state.category} ref={this.CategoryFormRefs}/>   
                </Modal>
            </div>
        )
    }
}



export default Category;