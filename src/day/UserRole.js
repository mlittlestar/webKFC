import React from 'react';
import $ from 'jquery';

class UserRole extends React.Component{
    constructor(){
        super();
        this.state={
            userroles:[],
            users:[],
            roles:[],
            form:{
                userId:"",
                roleId:""

            }
        }
    }


    componentWillMount(){
        this.loadUserRole();
        this.loadUser();
        this.loadRole();
    }

    loadUser(){
        let url="http://203.195.251.185:8787/user/findAll";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    users:data
                })
            }else{
                alert("异常");
            }

        });
    }

    loadRole(){
        let url="http://203.195.251.185:8787/role/findAll";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    roles:data
                })
            }else{
                alert("异常");
            }

        });
    }


    loadUserRole(){
        let url="http://203.195.251.185:8787/userrole/findAllWithUserAndRole";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    userroles:data,
                    form:{...this.state.form,...{userId:data[0].id,roleId:data[0].id}}
                })
            }else{
                alert("异常");
            }

        });
    }



    updateUserRoleById(id){

        $.get("http://203.195.251.185:8787/userrole/findUserRoleById?id="+id,({status,message,data})=>{
            if(status===200){
                this.setState({
                    form:data
                })
                }else{
                    alert(message);
            }

        });

    }


     //删除
     deleteHandler(id){
        this.deleteById(id,({status,message})=>{
            if(status===200){
                alert(message);
                this.loadUserRole();
            }else{
                alert(message);
            }
        })

    }

    deleteById(id,handler){
        let url="http://203.195.251.185:8787/userrole/deleteUserRoleById?id="+id;
        $.get(url,function(result){
            handler(result);
        });
    }


    //将input的内容映射到state中
    MappingHandler=(event)=>{
        let name=event.target.name; //拿名称
        let val=event.target.value; //拿对应的值
        this.setState({
           form: {...this.state.form,...{[name]:val}}
        })

    }

    submitForm=(event)=>{
        // 1. 获取表单数据,打印出来
        alert(JSON.stringify(this.state.form));
        //2.调用后台代码
        let url="http://203.195.251.185:8787/userrole/saveOrupdateUserRole";
        $.post(url,this.state.form,({status,message})=>{
            alert(message);
            this.loadUserRole();

            
        });

        event.preventDefault();

    }


    render(){
        let {userroles,users,roles,form}=this.state;
        return(
            <div className="userrole">
                <h2>用户角色管理</h2>

                {JSON.stringify(form)}
                {/* 表单 */}
                <form onSubmit={this.submitForm}>
                    
                    <select name="userId" value={form.userId} onChange={this.MappingHandler}>
                        {
                        users.map((item)=>{
                            return <option key={item.id} value={item.id}>{item.name}</option>
                        })
                        }
                    </select>

                    <select name="roleId" value={form.roleId} onChange={this.MappingHandler}>
                        {
                        roles.map((item)=>{
                            return <option key={item.id} value={item.id}>{item.name}</option>
                        })
                        }
                    </select>

                    <input type="submit" value="提交"/>
                </form>

                {/* 表格 */}
                <table className="tbl">
                    <thead>
                        <tr>
                            <th>编号</th>
                            <th>用户名</th>
                            <th>角色名</th>
                            <th>操作</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            userroles.map((item)=>{
                                return(
                                    <tr key={item.id}>
                                        <td><input type='checkbox'/></td>
                                        <td>{item.user.name}</td>
                                        <td>{item.role.name}</td>
                                        <td>
                                            <span onClick={this.deleteHandler.bind(this,item.id)}>下架</span>
                                            <span onClick={this.updateUserRoleById.bind(this,item.id)}>更新</span>
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



export default UserRole;