import React, { Component } from 'react';
import './App.css';
import ShoppingList from './components/ShoppingList.js';
import Menu from './components/Menu.js';
import axios from 'axios'; 

function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

class App extends Component {

  constructor(props) {
      super(props);

      var basket = new URL(window.location.href).searchParams.get("basket");

      if (!(!basket)) {
        var _ingredients = atob(basket).split("|");
        var chosen_ingredients = [];
        for (var i = 0; i < _ingredients.length; i++) {
          var one_ingredient = _ingredients[i].split(";");
          chosen_ingredients.push({
            "Name": one_ingredient[0],
            "Amount": one_ingredient[1],
            "Unit" :one_ingredient[2],
            "Type": one_ingredient[3]
            });
        }
        this.state = {
          ingredients: chosen_ingredients,
          recipes: [],
          frequents: []
        }  
      }
      else {
        this.state = {
          ingredients: [],
          recipes: [],
          frequents: []
        }  
      }
      this.AddToShoppingList = this.AddToShoppingList.bind(this);
      this.RemoveFromShoppingList = this.RemoveFromShoppingList.bind(this);      
  }

  componentDidMount() {
     var _this = this;
     this.serverRequest = 
      axios
        .get("Data.json")
        .then(function(result) {    
            _this.setState({
              recipes: result.data.Recipes,
              frequents: result.data.Frequents
            });  
        })
  }

  AddToShoppingList(items) {
    var ni = copy(this.state.ingredients);
    for (var i = 0; i < items.length; i++) {
      var updatedAmount = false;
      for (var j = 0; j < ni.length; j++) {
        if (ni[j].Name === items[i].Name) {
          if (ni[j].Unit === items[i].Unit) {
            ni[j].Amount = +ni[j].Amount + +items[i].Amount;
            if (ni[j].Unit === "dl" && ni[j].Amount >= 10) {
              ni[j].Unit = "l";
              ni[j].Amount = ni[j].Amount/10;
            }
            if (ni[j].Unit === "g" && ni[j].Amount >= 1000) {
              ni[j].Unit = "kg";
              ni[j].Amount = ni[j].Amount/1000;
            }
            updatedAmount = true;
          }
          else {
            if (ni[j].Unit === "dl" && items[i].Unit === "l") {
              ni[j].Amount = (+ni[j].Amount/10) + +items[i].Amount;
              ni[j].Unit = items[i].Unit;
              updatedAmount = true;
            }
            else if (ni[j].Unit === "l" && items[i].Unit === "dl") {
              ni[j].Amount = +ni[j].Amount + (items[i].Amount/10);
              updatedAmount = true;
            }
            else if (ni[j].Unit === "g" && items[i].Unit === "kg") {
              ni[j].Amount = (ni[j].Amount/1000) + +items[i].Amount;
              ni[j].Unit = items[i].Unit;
              updatedAmount = true;
            }
            else if (ni[j].Unit === "kg" && items[i].Unit === "g") {
              ni[j].Amount = +ni[j].Amount + (+items[i].Amount/1000);
              updatedAmount = true;
            }
          }
        }
        if (updatedAmount) {
          if (ni[j].Unit === "kg" || ni[j].Unit === "l") 
          {
            ni[j].Amount = Number(ni[j].Amount).toFixed(2)
          }
        }
      }

      if (!updatedAmount) {
        ni.push(items[i]);
      }
    }
    this.setState({ingredients : ni});
  }

  RemoveFromShoppingList(ingredient) {
    var ni = this.state.ingredients; 
    var index = -1;
    for(var i = 0; i < this.state.ingredients.length; i++) 
    {
      if (this.state.ingredients[i].Name === ingredient.Name
      && this.state.ingredients[i].Amount === ingredient.Amount
      && this.state.ingredients[i].Unit === ingredient.Unit
      && this.state.ingredients[i].Type === ingredient.Type
    )
      {
        index = i;
        break;
      }
    }
    if (index === -1) return;
    ni.splice(index, 1);
    this.setState({recipes : this.state.recipes, ingredients : ni});
  }

  render() {
    return (
      <div className="App">
        <div className="App-content"> 
          <Menu Id="RecipeMenu" key={"Recipes_"+this.state.recipes.length} Data={this.state.recipes}  Handler={this.AddToShoppingList} />
          <Menu Id="FrequentMenu" key={"Frequents_"+this.state.frequents.length} Data={this.state.frequents}  Handler={this.AddToShoppingList} />
          <ShoppingList ingredients={this.state.ingredients} RemoveIngredient={this.RemoveFromShoppingList} AddIngredient={this.AddToShoppingList} />  
        </div>
      </div>
    );
  }
}

export default App;
