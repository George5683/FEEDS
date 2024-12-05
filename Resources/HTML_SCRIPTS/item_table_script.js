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
let itemDirection = 0;
let stockDirection = -1;
let dateDirection = -1;
let favoriteDirection = -1;

async function main() {
  let mainTable = document.getElementById("browserTable");
  for(var i = mainTable.rows.length - 1; i > 0; i--) {
    mainTable.deleteRow(i);
  }

  // Get the query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const pantryName = urlParams.get('pantryName');

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

  // Use the pantryName value
  if (pantryName) {
      if (PantryNamePlaceHolder) {
          PantryNamePlaceHolder.textContent = `Pantry: ${pantryName}`;
      }
  } else {
      console.error('Pantry name not found in the URL.');
  }

  try {
    const response = await fetch('/GetPantryItems', {
        method: 'POST',
        body: JSON.stringify({ pantryName: pantryName }),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const responseData = await response.json();

    if (response.ok) {
      responseData.sort(dynamicSort("FOOD_NAME"));
      itemTitle.textContent = 'Item: \u2193';
      for (let i = 0; i < responseData.length; i++) {
        await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, responseData[i].FOOD_ID);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Error retrieving pantry information from server.');
  }
}

async function refresh(col, direction) {
  let mainTable = document.getElementById("browserTable");
  for(var i = mainTable.rows.length - 1; i > 0; i--) {
    mainTable.deleteRow(i);
  }
  
  let PantryNamePlaceHolder = document.getElementById("PantryNamePlaceHolder");
  let itemTitle = document.getElementById("tableI");
  let stockTitle = document.getElementById("tableS");
  let dateTitle = document.getElementById("tableD");
  let favoriteTitle = document.getElementById("tableF");
  itemTitle.textContent = "Item:";
  stockTitle.textContent = "In Stock:";
  dateTitle.textContent = "Last Stocked Date:";
  favoriteTitle.textContent = "Favorite Item:";

  // Get the query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const pantryName = urlParams.get('pantryName');

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

  // Use the pantryName value
  if (pantryName) {
      console.log(`Selected Pantry: ${pantryName}`);
      if (PantryNamePlaceHolder) {
          PantryNamePlaceHolder.textContent = `Pantry: ${pantryName}`;
      }
  } else {
      console.error('Pantry name not found in the URL.');
  }

  try {
    const response = await fetch('/GetPantryItems', {
        method: 'POST',
        body: JSON.stringify({ pantryName: pantryName }),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const responseData = await response.json();

    if (response.ok) {
      responseData.sort(dynamicSort("FOOD_NAME"));
      if (col == 0) {   // Sort by Name 
        if (direction == 0) {
          itemTitle.textContent = 'Item: \u2193';
          for (let i = 0; i < responseData.length; i++) {
            await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, responseData[i].FOOD_ID);
          }
        } else if (direction == 1) {
          itemTitle.textContent = 'Item: \u2191';
          for (let i = responseData.length - 1; i >= 0; i--) {
            await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, responseData[i].FOOD_ID);
          }
        }
      } else if (col == 1) {   // Sort by Stock
        let inStock = [];
        let lowStock = [];
        let noStock = [];
        for (let i = 0; i < responseData.length; i++) {
          if(responseData[i].STATUS == "IN STOCK") {
            inStock.push(responseData[i]);
          }
          else if(responseData[i].STATUS == "LOW STOCK") {
            lowStock.push(responseData[i]);
          }
          else {
            noStock.push(responseData[i]);
          }
        }
        if (direction == 0) {
          stockTitle.textContent = 'In Stock: \u2193';
          for (let i = 0; i < inStock.length; i++) {
            await addRow(inStock[i].FOOD_NAME, inStock[i].STATUS, inStock[i].FOOD_ID);
          }
          for (let i = 0; i < lowStock.length; i++) {
            await addRow(lowStock[i].FOOD_NAME, lowStock[i].STATUS, lowStock[i].FOOD_ID);
          }
          for (let i = 0; i < noStock.length; i++) {
            await addRow(noStock[i].FOOD_NAME, noStock[i].STATUS, noStock[i].FOOD_ID);
          }
        } else if (direction == 1) {
          stockTitle.textContent = 'In Stock: \u2191';
          for (let i = 0; i < noStock.length; i++) {
            await addRow(noStock[i].FOOD_NAME, noStock[i].STATUS, noStock[i].FOOD_ID);
          }
          for (let i = 0; i < lowStock.length; i++) {
            await addRow(lowStock[i].FOOD_NAME, lowStock[i].STATUS, lowStock[i].FOOD_ID);
          }
          for (let i = 0; i < inStock.length; i++) {
            await addRow(inStock[i].FOOD_NAME, inStock[i].STATUS, inStock[i].FOOD_ID);
          }
        }
      } else if (col == 2) {   // Sort by Date
        // Currently not implemented
        if (direction == 0) {
          dateTitle.textContent = 'Last Stocked Date: \u2193';
          for (let i = 0; i < responseData.length; i++) {
            await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, responseData[i].FOOD_ID);
          }
        } else if (direction == 1) {
          dateTitle.textContent = 'Last Stocked Date: \u2191';
          for (let i = 0; i < responseData.length; i++) {
            await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, responseData[i].FOOD_ID);
          }
        }

      } else if (col == 3) {   // Sort by Favorite
        // Issue when a user unfavorites an item and then sorts before refreshing page
        let favList = [];
        let notFavList = [];
        for (let i = 0; i < responseData.length; i++) {
          if (isFavorited(responseData[i].FOOD_ID)) {
            favList.push(responseData[i]);
          }
          else {
            notFavList.push(responseData[i]);
          }
        }
        if (direction == 0) {
          favoriteTitle.textContent = 'Favorite Item: \u2193';
          for (let i = 0; i < favList.length; i++) {
            await addRow(favList[i].FOOD_NAME, favList[i].STATUS, favList[i].FOOD_ID);
          }
          for (let i = 0; i < notFavList.length; i++) {
            await addRow(notFavList[i].FOOD_NAME, notFavList[i].STATUS, notFavList[i].FOOD_ID);
          }
        } else if (direction == 1) {
          favoriteTitle.textContent = 'Favorite Item: \u2191';
          for (let i = 0; i < notFavList.length; i++) {
            await addRow(notFavList[i].FOOD_NAME, notFavList[i].STATUS, notFavList[i].FOOD_ID);
          }
          for (let i = 0; i < favList.length; i++) {
            await addRow(favList[i].FOOD_NAME, favList[i].STATUS, favList[i].FOOD_ID);
          }
        }
      } else {
        itemTitle.textContent = 'Item: \u2193';
        for (let i = 0; i < responseData.length; i++) {
          await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, responseData[i].FOOD_ID);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Error retrieving pantry information from server.');
  }

}

async function addRow(name, status, id) {
  let iName = name.split(' ').join('-');
  let bTable = document.getElementById("browserTable");
  let newRow = bTable.insertRow(-1);
  let newItem = newRow.insertCell(0);
  let newStock = newRow.insertCell(1);
  let newDate = newRow.insertCell(2);
  let newFavorite = newRow.insertCell(3);
  let newImage = document.createElement('img');
  newImage.src = `./Images/${iName}.png`;
  newImage.classList.add("foodimage");
  let nameText = document.createTextNode(name);
  let stockText = document.createTextNode(status);
  // !! Data not present in database!!!!
  let dateText = document.createTextNode("11/02/2024");

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
  newStock.appendChild(stockText);
  newDate.appendChild(dateText);
  newFavorite.appendChild(Stars.getElement());

  newItem.addEventListener("click", async function () {
    showPopup(name, status, "11/02/2024");
  });
  newStock.addEventListener("click", async function () {
    showPopup(name, status, "11/02/2024");
  });
  newDate.addEventListener("click", async function () {
    showPopup(name, status, "11/02/2024");
  });
}

function showPopup(itemName, itemStock, itemDate) {
  // Get the modal
  let modal = document.getElementById("popupModal");
  modal.style.display = "block";
  document.getElementById("itemName").textContent = itemName;
  document.getElementById("itemStock").textContent = itemStock;
  document.getElementById("itemDate").textContent = itemDate;
}

function isFavorited(itemID){
  for(let i = 0; i < FavoritedItemsIndex.length; i++){
    if(itemID == FavoritedItemsIndex[i]){
      return true;
    }
  }
  return false;
}

// close the modal when clicking on <span> (x)
let closeBtn = document.querySelector(".close");
closeBtn.onclick = function () {
  document.getElementById("popupModal").style.display = "none";
}

// close the modal when clicking anywhere outside of it
window.onclick = function (event) {
  let modal = document.getElementById("popupModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Creates sorting for Items
let itemTitle = document.getElementById("tableI");
let stockTitle = document.getElementById("tableS");
let dateTitle = document.getElementById("tableD");
let favoriteTitle = document.getElementById("tableF");


itemTitle.addEventListener('click', () => {
  stockDirection = -1;
  dateDirection = -1;
  favoriteDirection = -1;
  if (itemDirection == 0) {
    itemDirection = 1;
    refresh(0, 1);
  }
  else if (itemDirection == 1) {
    itemDirection = 0;
    refresh(0, 0);
  } else {
    itemDirection = 0;
    refresh(0, 0);
  }
});

stockTitle.addEventListener('click', () => {
  itemDirection = -1;
  dateDirection = -1;
  favoriteDirection = -1;
  if (stockDirection == 0) {
    stockDirection = 1;
    refresh(1, 1);
  }
  else if (stockDirection == 1) {
    stockDirection = 0;
    refresh(1, 0);
  } else {
    stockDirection = 0;
    refresh(1, 0)
  }
});

dateTitle.addEventListener('click', () => {
  itemDirection = -1;
  stockDirection = -1;
  favoriteDirection = -1;
  if (dateDirection == 0) {
    dateDirection = 1;
    refresh(2, 1);
  }
  else if (dateDirection == 1) {
    dateDirection = 0;
    refresh(2, 0);
  } else {
    dateDirection = 0;
    refresh(2, 0)
  }
});

favoriteTitle.addEventListener('click', () => {
  itemDirection = -1;
  stockDirection = -1;
  dateDirection = -1;
  if (favoriteDirection == 0) {
    favoriteDirection = 1;
    refresh(3, 1);
  }
  else if (favoriteDirection == 1) {
    favoriteDirection = 0;
    refresh(3, 0);
  } else {
    favoriteDirection = 0;
    refresh(3, 0)
  }
});

// Function to get the food ID from the food name
async function GetID(FoodName){
  let FoodID = FavoritedItemsMap.get(FoodName);
  return FoodID;
}

main();

dropDown.addEventListener('mouseover', () => {
  dropDown.textContent = "Item Browser";
  document.getElementById("dropDownItems").style.display = "block";
});

dropDiv.addEventListener('mouseleave', () => {
  dropDown.textContent = "Item Browser \u2193";
  document.getElementById("dropDownItems").style.display = "none";
});

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}