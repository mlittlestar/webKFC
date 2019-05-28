import React from 'react'
import {Button,Table} from 'antd';

class ProductDetails extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props);
    
  }

  goBack(){
    this.props.history.goBack();
  }
  render(){
    let product = this.props.location.state;

    return (
      <div className="product_details">
        <h2>{this.props.location.state.name}的详细信息</h2>
        <Button type="link" onClick={this.goBack.bind(this)}>返回</Button>
        
        {JSON.stringify(product)}
      </div>
    )
  }
}

export default ProductDetails;