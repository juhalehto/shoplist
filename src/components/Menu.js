import React, { Component } from 'react';
import MenuItem from './MenuItem'
import PropTypes from 'prop-types';

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
        id: props.Id,
        data: props.Data,
        mode: props.Mode
    };
  }

  itemClicked(item) {
    this.props.Handler(item);
  }

  toggleNav() {
    if (document.getElementById(this.state.id + "Menu").style.width !== "250px") {
      document.getElementById(this.state.id + "Menu").style.width = "250px";
      document.getElementById("ShoppingList").style.marginLeft = "250px";
      document.getElementById(this.state.id + "ToggleMenu").style.marginLeft = "250px";
      document.getElementById(this.state.id + "ToggleMenuI").classList.remove("fa-chevron-right");
      document.getElementById(this.state.id + "ToggleMenuI").classList.add("fa-chevron-left");
    }
    else {
      document.getElementById(this.state.id + "Menu").style.width = "0";
      document.getElementById("ShoppingList").style.marginLeft = "0";
      document.getElementById(this.state.id + "ToggleMenu").style.marginLeft = "0";
      document.getElementById(this.state.id + "ToggleMenuI").classList.remove("fa-chevron-left");
      document.getElementById(this.state.id + "ToggleMenuI").classList.add("fa-chevron-right");
    }
  }

 
  render() {
    return (
      <div>
        <div id={this.state.id + "Menu"} className="Menu w3-sidebar w3-bar-block">
            {this.props.Data.map(function(item, index){
              return <a href="#" className="w3-bar-item w3-button w3-border-bottom w3-hover-deep-purple" key={item.Name + index}><MenuItem key={item.Name + index} Item={item} OnSelect={this.itemClicked.bind(this)} /></a>;
            },this)}      
        </div>
        <div id={this.state.id + "ToggleMenu"} className={"ToggleMenu ToggleMenuOrder_"+this.state.id } onClick={this.toggleNav.bind(this)}>
            <i id={this.state.id + "ToggleMenuI"} className="fa fa-chevron-right w3-xxlarge"/>
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  Handler: PropTypes.func
};

export default Menu;