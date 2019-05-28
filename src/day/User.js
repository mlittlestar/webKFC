import React from 'react';
import $ from 'jquery';

class User extends React.Component{
    constructor(){
        super();
        this.state={
            users:[],
            form:{
                name:"",
                telephone:""
            }
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



    deleteUserHandler(id){
        
        this.delUserById(id,({status,message})=>{
            if(status===200){
                alert(message);
                this.loadUser();
            }else{
                alert(message);
            }
    
        })
    }
    
    
    delUserById(id,handler){
        let url="http://203.195.251.185:8787/user/deleteByUserId?id="+id;
        $.get(url,function(result){
            handler(result);    
        })
    }


    updateUserHandlerById(id){
        $.get("http://203.195.251.185:8787/user/findByUserId?id="+id,({status,message,data})=>{
            if(status === 200){
        // 将查询数据设置到state中
                this.setState({ form:data })
            } else {alert (message)}
        })
    }


    // 将input上的状态映射到组件state中
    changeHandler = (event)=>{
        let name = event.target.name; // name/telephone
        let val = event.target.value;
        this.setState({
        form:{...this.state.form,...{[name]:val}}
        })
    }

    searchForm=(event)=>{
        let url = "http://127.0.0.1:8787/user/query"
        $.post(url,this.state.form,({status,message,data})=>{
        if(status===200){
            this.setState({ users:data })
            }
        })
        event.preventDefault();
    }

    // 提交
    submitForm = (event)=>{
        // 1. 获取表单数据
        alert(JSON.stringify(this.state.form));
        // 2. 调用后台代码完成保存
        let url = "http://203.195.251.185:8787/user/saveOrupdateUser"
        $.post(url,this.state.form,({status,message})=>{
        alert(message);
          this.loadUser();
        })

        event.preventDefault();
    }

    render(){
        let {users,form}=this.state;
        return(
            <div className="user">
                <h2>用户管理</h2>

                
                    <form onSubmit={this.searchForm}>
                        姓名<input type="text" name="name" value={this.name} onChange={this.changeHandler} placeholder="请输入要搜索的内容"/>
                        电话<input type="text" name="telephone" value={this.name} onChange={this.changeHandler} placeholder="请输入要搜索的内容"/>
                        <input type="submit" value="搜索"/>  
                    </form>
                      
                


                {/* 表单 */}
                {JSON.stringify(form)}
                <form onSubmit={this.submitForm}>
                    姓名
                    <input type="text" name="name" value={this.name} onChange={this.changeHandler}/>
                    电话
                    <input type="text" name="telephone" value={this.telephone} onChange={this.changeHandler}/>

                    <input type="submit" value="提交"/>

                    

                </form>

                {/* 表格 */}
                <table className='tbl'>
                    <thead>
                        <tr>
                            <th>编号</th>
                            <th>姓名</th>
                            <th>电话</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            users.map((item)=>{
                                return (
                                <tr key={item.id}>
                                    <td><input type='checkbox'/></td>
                                    <td>{item.name}</td>
                                    <td>{item.telephone}</td>
                                    <td>
                                        <span onClick={this.updateUserHandlerById.bind(this,item.id)}>更新</span>
                                        <span onClick={this.deleteUserHandler.bind(this,item.id)}>删除</span>
                                    </td>
                                </tr>
                                )
                            })
                        }
                        
                    </tbody>
                </table>
            </div>
        )
    }
}





export default User;