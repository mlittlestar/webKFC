import React from 'react';
import $ from 'jquery';
import {Table,Icon, Button,Modal,message} from 'antd';
import UserForm from './UserForm';

// 当服务端异常的时候都会执行该回调
$.ajaxSetup({
    error:function(){
      message.error("服务器端异常")
    }
  })

class User extends React.Component{
    constructor(){
        super();
        this.state={
            users:[],
            user:{},
            visible:false
        }

    }

    componentWillMount(){
        this.loadUser();
    }

    //渲染User界面
    loadUser(){
        //查询所有学生信息，将学生信息保存到state
        let url="http://203.195.251.185:8787/user/findAll";
        $.get(url,({status,data})=>{
            if(status==200){
                this.setState({
                    users:data
                })
            }else{
                alert('接口异常');
            }
        });
    }


    // 批量删除
  batchDelete(){
    Modal.confirm({
      title: '确认删除吗？',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:()=> {
        // 编写代码进行删除
        let url = "http://203.195.251.185:8787/user/batchDelete";
        $.ajax({
          url,
          method:"POST",
          data:JSON.stringify(this.state.ids),
          contentType:"application/json",
          success:({status,message:msg})=>{
            if(status === 200){
              message.success(msg)
              this.loadUser();
            } else {
              message.error(msg)
            }
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
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
                $.get("http://203.195.251.185:8787/user/deleteByUserId?id="+id,({status,message})=>{
                    if(status===200){
                        this.loadUser();
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


    // 点击添加按钮的执行函数
    toAdd(){
        this.setState({ 
        visible: true, 
        user:{}
        });
    }

    //点击编辑
    toEdit(record){
        this.setState({ 
            visible: true, 
            user:record
        });
    }

    //点击查看详细信息
    toDetails(record){
        this.props.history.push({
          pathname:'/UserDetails',
          state:record,
        });
        
      }


    //模态框的确认
    handleOk = e => {
        // 1. 获取表单数据
           e.preventDefault();
           this.form.validateFields((err, values) => {
           if (!err) {
               console.log(values)
               let url ="http://203.195.251.185:8787/user/saveOrupdateUser";
               $.post(url,values,({status,message})=>{
               if(status === 200){
                   message.success(message)
                   this.setState({ visible: false, });
                   // 页面刷新
                   this.loadUser();
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
    UserFormRefs = (form)=>{
        this.form = form;
    }

    render(){
        let {users}=this.state;

         // ID前面有框
         const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ids:selectedRowKeys});
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
              title: '姓名',
              dataIndex: 'name',
            },
            {
              title: '电话',
              dataIndex: 'telephone',
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
            <div className="user">
                <div className="btn">
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加</Button>
                    <Button type="danger" onClick={this.batchDelete.bind(this)}>批量删除</Button>
                </div>
                {/* 表格 */}
               <Table rowKey="id"  rowSelection={rowSelection} columns={columns} dataSource={this.state.users} bordered='true'/>

                {/* 弹出框 */}
                <Modal
                    title="添加用户"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                     <UserForm  initData={this.state.user} ref={this.UserFormRefs}/>   
                </Modal>
            </div>
        )
    }
}





export default User;