import React from 'react';
import $ from 'jquery';


class OrderLine extends React.Component{
    constructor(){
        super();
        this.state={
            orderlines:[],
            productwithc:[],
            orderwithu:[],
            form:{
                num:"",
                productId:""
            }
        }
    }

componentWillMount(){
    this.loadOrderLine();
    this.loadOrderWithU();
    this.loadProductWithC();
}

loadOrderWithU(){
    let url="http://127.0.0.1:8787/order/findAllWithUser";
    $.get(url,({status,data})=>{
        if(status===200){
            this.setState({
                orderwithu:data
            })
        }else{
            alert("异常");
        }

    });
}

loadProductWithC(){
    let url="http://127.0.0.1:8787/product/findAllWithCategory";
    $.get(url,({status,data})=>{
        if(status===200){
            this.setState({
                productwithc:data
            })
        }else{
            alert("异常");
        }

    });
}

loadOrderLine(){
    let url="http://127.0.0.1:8787/orderLine/findAllWithOrderAndProduct";
    $.get(url,({status,data})=>{
        if(status===200){
            this.setState({
                orderlines:data,
                form:{...this.state.form,...{productId:data[0].id,orderId:data[0].id}}
            })
        }else{
            alert("异常");
        }
    })
}


updateOrderLineById(id){

    $.get("http://127.0.0.1:8787/orderLine/findOrderLineById?id="+id,({status,message,data})=>{
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
            this.loadOrderLine();
        }else{
            alert(message);
        }
    })

}

deleteById(id,handler){
    let url="http://127.0.0.1:8787/orderLine/deleteOrderLineById?id="+id;
    $.get(url,function(result){
        handler(result);
    });
}



MappingHandler=(event)=>{
    let name=event.target.name;
    let val=event.target.value;
    this.setState({
        form:{...this.state.form,...{[name]:val}}
    })
}


//绑定提交时间
submitForm=(event)=>{
    // 1. 获取表单数据,打印出来
    alert(JSON.stringify(this.state.form));
    //2.调用后台代码
    let url="http://127.0.0.1:8787/orderLine/saveOrupdateOrderLine";
    $.post(url,this.state.form,({status,message})=>{
        alert(message);
        this.loadOrderLine();

    });
    event.preventDefault();
}

    render(){
        let {orderlines,productwithc,orderwithu,form}=this.state;
        return(
            <div className="orderline">

                    <h2>订单线管理</h2>

                    {JSON.stringify(form)}
                    <form onSubmit={this.submitForm}>
                        订单数量
                        <input type="text" name="num" value={this.num} onChange={this.MappingHandler}/>
                        食物名称
                        <select name="productId" value={form.productId} onChange={this.MappingHandler}>
                            {
                            productwithc.map((item)=>{
                                return <option key={item.id} value={item.id}>{item.name}</option>
                            })
                            }
                        </select>

                        订单时间
                        <select name="orderId" value={form.orderId} onChange={this.MappingHandler}>
                            {
                            orderwithu.map((item)=>{
                                return <option key={item.id} value={item.id}>{item.orderTime}</option>
                            })
                            }
                        </select>
                        <input type="submit" value="提交"/>
                    </form>
                <table className="tbl">
                    <thead>
                        <tr>
                            <th>编号</th>
                            <th>订单数量</th>
                            <th>下单时间</th>
                            <th>下单用户</th>
                            <th>食物名称</th>
                            <th>食物价钱</th>
                            <th>食物类型</th>
                            <th>操作</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            orderlines.map((item)=>{
                                return(
                                    <tr key={item.id}>
                                        <td><input type="checkbox"/></td>
                                        <td>{item.num}</td>
                                        <td>{item.orderExtend.orderTime}</td>
                                        <td>{item.orderExtend.user.name}</td>
                                        <td>{item.productExtend.name}</td>
                                        <td>{item.productExtend.price}</td>
                                        <td>{item.productExtend.category.name}</td>
                                        <td>
                                            <span onClick={this.updateOrderLineById.bind(this,item.id)}>修改</span>
                                            <span onClick={this.deleteHandler.bind(this,item.id)}>下架</span>
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




export default OrderLine;