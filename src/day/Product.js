import React from 'react';
import $ from 'jquery';


class Product extends React.Component{
    constructor(){
       
        super();
        this.state={
            categorys:[],
            products:[],
            form:{
                name:"",
                description:"",
                price:"",
                categoryId:""
            }
        }
    }


    componentWillMount(){
        this.loadProduct();
        this.loadCategorys();
    }

    loadCategorys(){
    let url = "http://203.195.251.185:8787/category/findAll"
    $.get(url,({status,message,data})=>{
         if(status === 200){
            this.setState({
                categorys:data
                })
            }else{
                alert(message);
                }
            });
        }
    

    loadProduct(){
        let url="http://203.195.251.185:8787/product/findAllWithCategory";
        $.get(url,({status,data})=>{
            if(status===200){
                this.setState({
                    products:data,
                    form:{...this.state.form,...{categoryId:data[0].id}}
                })
            }else{
                alert("异常");
            }

        });
    }


    updateProductById(id){

        $.get("http://203.195.251.185:8787/product/findProductById?id="+id,({status,message,data})=>{
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
                this.loadProduct();
            }else{
                alert(message);
            }
        })

    }

    deleteById(id,handler){
        let url="http://203.195.251.185:8787/product/deleteProductById?id="+id;
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
        let url="http://203.195.251.185:8787/product/saveOrupdateProduct";
        $.post(url,this.state.form,({status,message})=>{
            alert(message);
            this.loadProduct();

            
        });

        event.preventDefault();

    }


    render(){
        let {products,form,categorys}=this.state;
        return(
            <div className="product">
                <h2>菜品管理</h2>

                {JSON.stringify(form)}
                {/* 表单 */}
                <form onSubmit={this.submitForm}>
                    菜名
                    <input type="text" name="name" value={this.name} onChange={this.MappingHandler}/>
                    菜描述
                    <input type="text" name="description" value={this.description} onChange={this.MappingHandler}/>
                    菜价钱
                    <input type="text" name="price" value={this.price} onChange={this.MappingHandler}/>
                    菜种类
                    <select name="categoryId" value={form.categoryId} onChange={this.MappingHandler}>
                        {
                        categorys.map((item)=>{
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
                            <td>菜名</td>
                            <td>菜描述</td>
                            <td>菜价钱</td>
                            <td>种类</td>
                            <td>操作</td>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            products.map((item)=>{
                                return(
                                    <tr key={item.id}>
                                        <td><input type='checkbox'/></td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.price}</td>
                                        <td>{item.category.name}</td>
                                        <td>
                                            <span onClick={this.deleteHandler.bind(this,item.id)}>下架</span>
                                            <span onClick={this.updateProductById.bind(this,item.id)}>更新</span>
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


export default Product;