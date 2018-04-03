import React, { Component } from 'react';
import Ingredient from './Ingredient';
import PropTypes from 'prop-types';
import NotifyModal from './NotifyModal';

class ShoppingList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ingredients: this.props.ingredients,
            addManuallyModalIsOpen: false,
            NotifyModalIsOpen: false
        }; 
        hideNotifyModal = hideNotifyModal.bind(this);
    }

    removeIngredient(ingredient) {
       this.props.RemoveIngredient(ingredient);
    }

    addIngredient(ingredient) {
       this.props.AddIngredient([ingredient]);
    }

    toggleAddManuallyModal() {
        this.setState({
            addManuallyModalIsOpen: !this.state.addManuallyModalIsOpen
        });
    }

    getLink() {
        var basket = "";
        for (var i = 0; i < this.props.ingredients.length; i++) {
            basket += this.props.ingredients[i].Name + ";"
            + this.props.ingredients[i].Amount + ";"
            + this.props.ingredients[i].Unit + ";"
            + this.props.ingredients[i].Type + (i === this.props.ingredients.length-1 ? "" : "|");            
        }

        var text = window.location.protocol + "//" + window.location.host + "/?basket=" + btoa(basket);// CryptoJS.AES.encrypt(basket, "Secret Passphrase"));

        var id = "mycustom-clipboard-textarea-hidden-id";
        var existsTextarea = document.getElementById(id);
        if(!existsTextarea){
            var textarea = document.createElement("textarea");
            textarea.id = id;
            textarea.style.position = 'fixed';
            textarea.style.top = 0;
            textarea.style.left = 0;
            textarea.style.width = '1px';
            textarea.style.height = '1px';
            textarea.style.padding = 0;
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.querySelector("body").appendChild(textarea);
            existsTextarea = document.getElementById(id);
        }
        existsTextarea.value = text;
        existsTextarea.select();
        try {
            var status = document.execCommand('copy');
            if(!status){
                console.error("Cannot copy text");
            }else{
                this.setState({ NotifyModalIsOpen: true });
                var timer = setInterval(function(timer) { 
                    hideNotifyModal(timer);
                }, 3500);
            }
        } catch (err) {
            console.log('Unable to copy.');
        }
    }

    render() {
        return (
          <div id="ShoppingListContainer">
            <div id="ShoppingList" className="ShoppingList">
                <header className="ShoppingList-header"> 
                <h1 className="ShoppingList-title">Ostoslista</h1>
                </header>
                <div className="ShoppingList-content">
                    <ul>
                    {this.props.ingredients.sort((a, b) => a.Name > b.Name).sort((a, b) => a.Type > b.Type).map(function(item, index){
                        return <li key={item.Name + item.Amount + item.Unit + index}><Ingredient key={item.Name + item.Amount + item.Unit + index} Name={item.Name} Amount={item.Amount} Unit={item.Unit} Type={item.Type} Remove={this.removeIngredient.bind(this)}  /></li>;
                    },this)}
                    </ul>
                </div>
            </div>
            <div id="ShoppingList-GetLink" onClick={this.getLink.bind(this)}>
                <i id="ShoppingList-LinkI" className="fa fa-link w3-xxlarge"/>
            </div>
            <div id="ShoppingList-AddManually" onClick={this.toggleAddManuallyModal.bind(this)}>
                <i id="ShoppingList-AddManuallyI" className="fa fa-plus-circle w3-xxxlarge"/>
            </div>
            <AddManuallyModal AddManually={this.addIngredient.bind(this)} OnClose={this.toggleAddManuallyModal.bind(this)} show={this.state.addManuallyModalIsOpen} />
            <NotifyModal Show={this.state.NotifyModalIsOpen} Text={"Linkki ostoslistaan kopioitu leikepöydälle. Jos muutat listan sisältöä, ota uusi linkki."} />
          </div>
        );
    }
}

ShoppingList.propTypes = {
    RemoveIngredient: PropTypes.func,
    AddIngredient: PropTypes.func
};

export default ShoppingList; 


class AddManuallyModal extends React.Component {

    addManually() {
        if(document.getElementById("ingredient_name").value !== '') {
            this.props.AddManually({
                "Name": document.getElementById("ingredient_name").value,
                "Amount": document.getElementById("ingredient_amount").value,
                "Unit": document.getElementById("ingredient_unit").value,
                "Type": document.getElementById("ingredient_type").value
            })
            this.props.OnClose();
        }
    }

    render() {
      if(!this.props.show) {
        return null;
      }
  
      return (
        <div className="ModalBackdrop">
          <div className="ModalWindow">
            <form>
                <p>
                    <label for="name">
                        <span>Tuote:</span>
                    </label>
                    <input type="text" id="ingredient_name" name="name"/>
                </p>
                <p>
                    <label for="amount">
                        <span>Määrä:</span>
                    </label>
                    <input type="number" id="ingredient_amount" name="amount"/>
                </p>
                <p>
                    <label for="unit">
                        <span>Yksikkö:</span>
                    </label>
                    <select id="ingredient_unit" name="unit" placeholder="Yksikkö">
                        <option value="">valitse</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="kpl">kpl</option>
                        <option value="l">l</option>
                        <option value="dl">dl</option>
                    </select>
                </p>
                <p>
                    <label for="type">
                        <span>Tyyppi:</span>
                    </label>
                    <select id="ingredient_type" name="type">
                        <option value="">valitse</option>
                        <option value="hevi">hevi</option>
                        <option value="liha">liha</option>
                        <option value="maito">maito</option>
                        <option value="pasta">pasta</option>
                        <option value="pakaste">pakaste</option>
                        <option value="muu">muu</option>
                    </select>
                </p>
            </form>
            <div className="footer">
                <div className="AddManuallyCancel" onClick={this.props.OnClose}>
                    <i id="AddManuallyCancelI" className="fa fa-close w3-xxlarge" ></i>
                </div>  
                <div id="AddManuallyAccept" onClick={this.addManually.bind(this)}>
                    <i id="AddManuallyAcceptI" className="fa fa-check w3-xxlarge"/>
                </div>
            </div>
          </div>
        </div>
      );
    }
}

function hideNotifyModal(timer) {
    this.setState({ NotifyModalIsOpen: false });
    clearInterval(timer);
}

AddManuallyModal.propTypes = {
    OnClose: PropTypes.func.isRequired,
    AddManually: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
  };
