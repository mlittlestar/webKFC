import React from 'react';
import $ from 'jquery';

class Category extends React.Component{
    constructor(){
        super();
        this.state={
            categorys:[],
            form:{
                name:""
            }
        }
    }

    componentWillMount(){
        this.loadCategory();
    }


    loadCategory(){
        let url="http://203.195.251.185:8787/category/findAll";
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


    updateById(id){
        $.get("http://203.195.251.185:8787/category/findByCategoryId?id="+id,({status,data,message})=>{
            if(status===200){
                this.setState({
                    form:data
                })
            }else{
                alert(message);
            }
        })
    }



    deleteHandler(id){
        
        this.deleteById(id,({status,message})=>{
            if(status===200){
                alert(message);
                this.loadCategory();
            }else{
                alert(message);
            }
        })
    }

    deleteById(id,handler){
        let url="http://203.195.251.185:8787/category/deleteByCategoryId?id="+id;
        $.get(url,function(result){
            handler(result);
        })
    }


    submitForm=(event)=>{
        alert(JSON.stringify(this.state.form));

        let url="http://203.195.251.185:8787/category/saveOrupdateCategory";
        $.post(url,this.state.form,({status,message})=>{
            alert(message);
            this.loadCategory();
        });

        event.preventDefault();
    }


    MappingHandker=(event)=>{
        let name=event.target.name;
        let val=event.target.value;
        this.setState({
            form:{...this.state.form,...{[name]:val}}
        })

    }




    render(){
        let {categorys,form}=this.state;
        return(
            <div className="category">
                <h2>食物分类管理</h2>

                {JSON.stringify(form)}
                {/* 表单 */}
                <form onSubmit={this.submitForm}>
                    种类
                    <input type="text" name="name" value={this.name} onChange={this.MappingHandker}/>

                    <input type="submit" vale="提交"/>
                </form>

                {/* 表格 */}
                <table className="tbl">

                    <thead>
                        <tr>
                            <th>编号</th>
                            <th>种类</th>
                            <th>操作</th>
                        </tr>

                    </thead>

                    <tbody>
                        {
                            categorys.map((item)=>{
                                return(
                                    <tr key={item.id}>
                                        <td><input type="checkbox"/></td>
                                        <td>{item.name}</td>
                                        <td>
                                            <span onClick={this.deleteHandler.bind(this,item.id)}>删除</span>
                                            <span onClick={this.updateById.bind(this,item.id)}>修改</span>
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



export default Category;