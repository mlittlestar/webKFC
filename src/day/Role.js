import React from 'react';
import $ from 'jquery';

class Role extends React.Component{
    constructor(){
        super();
        this.state={
            roles:[],
            form:{
                name:""
            }
        }
    }

    componentWillMount(){
        this.loadRole();
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



    updateRoleById(id){

        $.get("http://203.195.251.185:8787/role/findRoleById?id="+id,({status,message,data})=>{
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
                this.loadRole();
            }else{
                alert(message);
            }
        })

    }

    deleteById(id,handler){
        let url="http://203.195.251.185:8787/role/deleteRoleById?id="+id;
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

    //绑定提交时间
    submitForm=(event)=>{
        // 1. 获取表单数据,打印出来
        alert(JSON.stringify(this.state.form));
        //2.调用后台代码
        let url="http://203.195.251.185:8787/role/saveOrupdateRole";
        $.post(url,this.state.form,({status,message})=>{
            alert(message);
            this.loadRole();

            
        });

        event.preventDefault();

    }

    render(){
        let {roles,form}=this.state;
        return(
            <div className="role">
                <h2>角色管理</h2>

                {JSON.stringify(form)}
                {/* 表单 */}
                <form onSubmit={this.submitForm}>
                    姓名
                    <input type="text" name="name" value={this.name} onChange={this.MappingHandler}/>

                    <input type="submit" value="提交"/>
                </form>

                {/* 表格 */}
                <table className="tbl">
                    <thead>
                        <tr>
                            <td>编号</td>
                            <td>姓名</td>
                            <td>操作</td>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            roles.map((item)=>{
                                return(
                                    <tr key={item.id}>
                                        <td><input type='checkbox'/></td>
                                        <td>{item.name}</td>
                                        <td>
                                            <span onClick={this.deleteHandler.bind(this,item.id)}>删除</span>
                                            <span onClick={this.updateRoleById.bind(this,item.id)}>修改</span>
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



export default Role;