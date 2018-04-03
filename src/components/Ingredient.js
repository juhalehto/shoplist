import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Ingredient extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: props.Name,
            amount: props.Amount,
            unit: props.Unit,
            type: props.Type
        };
    }

    removeIngredient() {
        this.props.Remove({            
            Name: this.props.Name,
            Amount: this.props.Amount,
            Unit: this.props.Unit,
            Type: this.props.Type});
    }

    render() {
        let IngredientClassName = "Ingredient " + this.props.Type;
        return (
          <div className={IngredientClassName}>
            <div className="Ingredient-content">
                <div className="Ingredient-content-name">
                     {this.state.name}
                </div>
                <div className="Ingredient-content-unit">                
                    {this.state.amount}
                    {this.state.unit}
                </div>
                <div className="Ingredient-remove" onClick={this.removeIngredient.bind(this)}>
                    <i className="fa fa-close w3-large" ></i>
                </div>            
            </div>
          </div>
        );
    }
}
Ingredient.propTypes = {
    Remove: PropTypes.func
};
  
export default Ingredient;