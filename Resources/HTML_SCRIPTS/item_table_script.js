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

let count = 0;
let FavoritedItemsIndex = [];

async function main() {
  let PantryNamePlaceHolder = document.getElementById("PantryNamePlaceHolder");

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
      for (let i = 0; i < responseData.length; i++) {
        await addRow(responseData[i].FOOD_NAME, responseData[i].STATUS);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Error retrieving pantry information from server.');
  }

}

async function addRow(name, status) {
  count++;
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
  let dateText = document.createTextNode("11/02/2024");

  let favStar = document.createElement("span");
  favStar.classList.add("star");
  favStar.setAttribute("data-item-id", "1");

  let Stars;

  if(isFavorited(count)){
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

main();
