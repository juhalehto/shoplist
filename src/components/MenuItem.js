import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MenuItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.Item.Id,
            name: props.Item.Name,
            ingredients: props.Item.Ingredients,
            selectedCount: 0
        }
    }

    select() { 
        this.props.OnSelect(this.props.Item.Ingredients);
        this.setState({
            selectedCount: this.state.selectedCount+1
        });
    }

    render() {
        return (
            <div id="MenuItem-content" onClick={this.select.bind(this)}>
                <div id="MenuItem-name">
                    {this.state.name}
                </div>
                <div id="MenuItem-count">
                    {this.state.selectedCount > 0 ? this.state.selectedCount : ""}
                </div>
            </div>
        );
    }
}

MenuItem.propTypes = {
    OnSelect: PropTypes.func
};
  
export default MenuItem;