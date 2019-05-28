import React from 'react';
import $ from 'jquery';

class Order extends React.Component{
    constructor(){
        super();
        this.state={
            orders:[],
            users:[],
            form:{
                orderTime:"",
                status:"",
                userId:""
            }
        }
    }

    componentWillMount(){
        this.loadOrder();
        this.loadUser();
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

    loadOrder(){
        let url="http://203.195.251.185:8787/order/findAllWithUser";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    orders:data,
                    form:{...this.state.form,...{userId:data[0].id}}
                })
            }else{
                alert("异常");
            }

        });
    }

    updateOrderById(id){

        $.get("http://203.195.251.185:8787/order/findOrderById?id="+id,({status,message,data})=>{
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
                this.loadOrder();
            }else{
                alert(message);
            }
        })

    }

    deleteById(id,handler){
        let url="http://203.195.251.185:8787/order/deleteOrderById?id="+id;
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
        let url="http://203.195.251.185:8787/order/saveOrupdateOrder";
        $.post(url,this.state.form,({status,message})=>{
            alert(message);
            this.loadOrder();

            
        });

        event.preventDefault();

    }

    render(){
        let {orders,form,users}=this.state;
        return(
            <div className="product">
                <h2>订单管理</h2>

                {JSON.stringify(form)}
                {/* 表单 */}
                <form onSubmit={this.submitForm}>
                    时间
                    <input type="text" name="orderTime" value={this.orderTime} onChange={this.MappingHandler}/>
                    状态
                    <input type="text" name="status" value={this.status} onChange={this.MappingHandler}/>
                    用户
                    <select name="userId" value={form.userId} onChange={this.MappingHandler}>
                        {
                        users.map((item)=>{
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
                            <td>编号</td>
                            <td>订单时间</td>
                            <td>订单状态</td>
                            <td>用户名字</td>
                            <td>操作</td>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            orders.map((item)=>{
                                return(
                                    <tr key={item.id}>
                                        <td><input type='checkbox'/></td>
                                        <td>{item.orderTime}</td>
                                        <td>{item.status}</td>
                                        <td>{item.user.name}</td>
                                        <td>
                                            <span onClick={this.deleteHandler.bind(this,item.id)}>下架</span>
                                            <span onClick={this.updateOrderById.bind(this,item.id)}>更新</span>
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

export default Order;