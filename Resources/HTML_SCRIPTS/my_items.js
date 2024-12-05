class Star {
    constructor(element, Favorited, name) {
      this.element = element;
      this.Favorited = Favorited;
      this.name = name;
      if (Favorited) {
        this.element.classList.toggle("selected");
        this.element.innerHTML = Favorited ? "&#9733;" : "&#9734;"; // &#9733; is a filled star
      }
      else{
        this.element.innerHTML = Favorited ? "&#9733;" : "&#9734;"; // &#9733; is
      }
    }
  
    async toggle() {
      this.Favorited = !this.Favorited;
      this.element.classList.toggle("selected");
      this.element.innerHTML = this.Favorited ? "&#9733;" : "&#9734;"; // &#9733; is a filled star
    }
  
    async addClickListener() {
      this.element.addEventListener('click', async () => {
        let foodName = this.name;
        if(this.Favorited){
          let data = { foodName};
          // Send a POST request to the server to update the favorited status
          try {
            const response = await fetch('/RemoveFavoritedItem', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
  
            const responseData = await response;
        
            if (responseData) {
              // remove the item from the favorited array
              let ID = GetID(foodName);
              FavoritedItemsIndex.splice(FavoritedItemsIndex.indexOf(ID), 1);
              
              //console.log("Response is: " + JSON.stringify(responseData));
              console.log("Removed favorited item successfully!");
            } else {
              alert('Error removing favorited item.');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Error removing favorited item on server side');
          }
        }
        else{
          // Send a POST request to the server to update the favorited status
          try {
            let data = { foodName };
            let response = await fetch('/InsertFavoritedItem', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
  
            let responseData = await response;
        
            if (response.ok) {
              //console.log("Response is: " + JSON.stringify(responseData));
              console.log("Added favorited item successfully!");
            } else {
              alert('Error adding favorited item.');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Error adding favorited item on server side');
          }
        }
        this.toggle();
      });
    }
  
    getElement(){
      return this.element;
    }
  }

let FavoritedItemsMap = new Map();
let count = 0;
let FavoritedItemsIndex = [];

async function main() {
    let mainTable = document.getElementById("myTable");
    for(var i = mainTable.rows.length - 1; i > 0; i--) {
      mainTable.deleteRow(i);
    }
  
    // checking which items are favorited 
    await fetch('/GetFavoritedItems', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        for(let i = 0; i < data.length; i++){
          FavoritedItemsIndex[i] = data[i].FOOD_ID;
          // Add the food name and food id to the map
          FavoritedItemsMap.set(data[i].FOOD_NAME, data[i].FOOD_ID);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error retrieving favorited items from server.');
      });

      try {
        const response = await fetch('/GetPantryItems', {
            method: 'POST',
            body: JSON.stringify({ pantryName: "Gainesville Harvest" }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          for (let i = 0; i < responseData.length; i++) {
            if (isFavorited(responseData[i].FOOD_ID)) {
                await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, responseData[i].FOOD_ID);
            }
          }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error retrieving pantry information from server.');
      }
    

}

main();

async function GetID(FoodName){
    let FoodID = FavoritedItemsMap.get(FoodName);
    return FoodID;
  }

function isFavorited(itemID){
    for(let i = 0; i < FavoritedItemsIndex.length; i++){
      if(itemID == FavoritedItemsIndex[i]){
        return true;
      }
    }
    return false;
  }
  

  async function addRow(name, status, id) {
    let iName = name.split(' ').join('-');
    let mTable = document.getElementById("myTable");
    let newRow = mTable.insertRow(-1);
    let newItem = newRow.insertCell(0);
    let newFavorite = newRow.insertCell(1);
    let newImage = document.createElement('img');
    newImage.src = `./Images/${iName}.png`;
    newImage.classList.add("foodimage");
    let nameText = document.createTextNode(name);
    // !! Data not present in database!!!!

    let favStar = document.createElement("span");
    favStar.classList.add("star");
    favStar.setAttribute("data-item-id", "1");
  
    let Stars;

    if(isFavorited(id)){
        Stars = new Star(favStar, true, name);
        Stars.addClickListener();
      }
      else{
        Stars = new Star(favStar, false, name);
        Stars.addClickListener();
      }

    newItem.appendChild(newImage);
    newItem.appendChild(nameText);
    newFavorite.appendChild(Stars.getElement());

  }

  dropDown.addEventListener('mouseover', () => {
    dropDown.textContent = "Item Browser";
    document.getElementById("dropDownItems").style.display = "block";
  });
  
  dropDiv.addEventListener('mouseleave', () => {
    dropDown.textContent = "Item Browser \u2193";
    document.getElementById("dropDownItems").style.display = "none";
  });