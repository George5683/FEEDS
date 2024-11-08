async function main(){
    let PantryNamePlaceHolder = document.getElementById("PantryNamePlaceHolder");  
    
    // Get the query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const pantryName = urlParams.get('name');
  
    // Use the pantryName value
    if (pantryName) {
        //console.log(`Selected Pantry: ${pantryName}`);
        // Display the pantry name or use it in your logic
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
          addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, pantryName);
        }
      }
  
    } catch (error) {
    console.error('Error:', error);
    alert('Error retrieving pantry information from server.');
    }
    
  }

  function addRow(name, status, pantryName) {
    let iName = name.split(' ').join('-');
    let bTable = document.getElementById("browserTable");
    let newRow = bTable.insertRow(-1);
    let newItem = newRow.insertCell(0);
    let newStock = newRow.insertCell(1);
    let newDate = newRow.insertCell(2);
    let newImage = document.createElement('img');
    newImage.src = `./Images/${iName}.png`;
    newImage.classList.add("foodimage");
    let nameText = document.createTextNode(name);
    let stockText = document.createTextNode(status);
    let dateText = document.createTextNode("11/02/2024");
    newItem.appendChild(newImage);
    newItem.appendChild(nameText);
    newStock.appendChild(stockText);
    newDate.appendChild(dateText);
    newRow.addEventListener("click", function() {
      showPopup(name, status, "11/02/2024", pantryName);
    });
  }
  
  function showPopup(itemName, itemStock, itemDate, pantryName) {
      console.log('Popup');
      // Get the modal
      let modal = document.getElementById("popupModal");    // display the modal
      modal.style.display = "block";
      // populate the modal with the item information
      document.getElementById("itemName").textContent = itemName;
      document.getElementById("itemStock").textContent = itemStock;
      document.getElementById("itemDate").textContent = itemDate;
      let sliderValue;
      if (itemStock === "LOW STOCK") sliderValue = "2";
      else if (itemStock === "IN STOCK") sliderValue = "3";
      else sliderValue = "1";
      document.getElementById("stockSlider").value = sliderValue;
      document.getElementById("stockSlider").oninput = function() {
        updateStockDisplay(this.value, pantryName, itemName);
      };
    }
    function updateStockDisplay(sliderValue, pantryName, itemName) {
        const stockStatus = sliderValue === "2" ? "LOW STOCK" : sliderValue === "1" ? "NONE" : "IN STOCK";
        document.getElementById("itemStock").textContent = stockStatus;
        updateItemStatusInDatabase(pantryName, itemName, stockStatus);
    }

    //close the modal when clicking on <span> (x)
    let closeBtn = document.querySelector(".close");
    closeBtn.onclick = function() {
      document.getElementById("popupModal").style.display = "none";
    }
    //close the modal when clicking anywhere outside of it
    window.onclick = function(event) {
      let modal = document.getElementById("popupModal");
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    async function updateItemStatusInDatabase(pantryName, itemName, stockStatus) {
        try {
            const response = await fetch('/updateItemStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pantryName, foodName: itemName, status: stockStatus }),
            });
    
            if (response.ok) {
                console.log(`Successfully updated ${itemName} to ${stockStatus}`);
                document.getElementById("itemStock").textContent = stockStatus;
            } else {
                alert('Failed to update item status');
            }
        } catch (error) {
            console.error('Error updating item status:', error);
        }
    }
  
    main();
    