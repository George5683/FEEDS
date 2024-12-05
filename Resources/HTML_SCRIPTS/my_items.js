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
        console.log(FavoritedItemsMap);
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
    let newImage = document.createElement('img');
    newImage.src = `./Images/${iName}.png`;
    newImage.classList.add("foodimage");
    let nameText = document.createTextNode(name);
    // !! Data not present in database!!!!

    newItem.appendChild(newImage);
    newItem.appendChild(nameText);

  }

  dropDown.addEventListener('mouseover', () => {
    dropDown.textContent = "Item Browser";
    document.getElementById("dropDownItems").style.display = "block";
  });
  
  dropDiv.addEventListener('mouseleave', () => {
    dropDown.textContent = "Item Browser \u2193";
    document.getElementById("dropDownItems").style.display = "none";
  });