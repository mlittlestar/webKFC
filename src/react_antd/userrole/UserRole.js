import React from 'react';
import $ from 'jquery';
import {Table,Button,Icon,message,Modal} from 'antd';

import UserRoleForm from './UserRoleForm';

class UserRole extends React.Component{
    constructor(){
        super();
        this.state={
            userroles:[],
            userrole:{},
            visible:false
        }
    }


    componentWillMount(){
        this.loadUserRole();
    }

    loadUserRole(){
        let url="http://203.195.251.185:8787/userrole/findAllWithUserAndRole";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    userroles:data,
                })
            }else{
                alert("异常");
            }

        });
    }


    handleOk = e => {
        // 1. 获取表单数据
          e.preventDefault();
          this.form.validateFields((err, values) => {
          if (!err) {
              console.log(values)
              let url ="http://203.195.251.185:8787/userrole/saveOrupdateUserRole";
              $.post(url,values,({status,message})=>{
              if(status === 200){
                  message.success(message)
                  this.setState({ visible: false, });
                  // 页面刷新
                  this.loadUserRole();
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
        userrole:{}
        });
    }

    // ref函数
    UserRoleFormRefs = (form)=>{
        this.form = form;
    }



    render(){
        let {userroles}=this.state;

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
              title: '角色姓名',
              dataIndex: 'role.name',
            },
            {
                title: '用户名称',
                dataIndex: 'user.name',
            },
            {
                title: '用户电话',
                dataIndex: 'user.telephone',
            },
            {
                title: '操作',
                width:100,
                align:'center',
                render: (val,record) =>{
                    return(
                        <div>
                            <Icon type="delete"/>&nbsp;
                            <Icon type="edit"/>&nbsp;
                            <Icon type="eye"/>
                        </div>
                    )
                }
            }
          ]; 
        return(
            <div className="userrole">
                <div className="btn">
                    <Button type="primary" onClick={this.toAdd.bind(this)}>添加</Button>
                    <Button type="danger"> 批量删除</Button>
                </div>
                
                
                {/* 表格 */}
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.userroles} bordered="true"/>

                <Modal
                    title="添加课程"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                     <UserRoleForm initData={this.state.userrole} ref={this.UserRoleFormRefs}/>
                </Modal>
                


            </div>
        )
    }
}



export default UserRole;