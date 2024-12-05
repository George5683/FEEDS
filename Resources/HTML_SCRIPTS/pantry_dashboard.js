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
          fDate = fixDate(responseData[i].DATE);
          addRow(responseData[i].FOOD_NAME, responseData[i].STATUS, fDate, pantryName);
        }
      }
  
    } catch (error) {
    console.error('Error:', error);
    alert('Error retrieving pantry information from server.');
    }
    
  }

  function addRow(name, status, date, pantryName) {
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
    let dateText = document.createTextNode(date);
    newItem.appendChild(newImage);
    newItem.appendChild(nameText);
    newStock.appendChild(stockText);
    newDate.appendChild(dateText);
    newRow.addEventListener("click", function() {
      showPopup(name, status, date, pantryName);
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
        const stockStatus = this.value === "2" ? "LOW STOCK" : this.value === "1" ? "NONE" : "IN STOCK";
        document.getElementById("itemStock").textContent = stockStatus;
      };
      document.getElementById("saveStockStatus").onclick = function() {
        const sliderValue = document.getElementById("stockSlider").value;
        const stockStatus = sliderValue === "2" ? "LOW STOCK" : sliderValue === "1" ? "NONE" : "IN STOCK";
        updateStockDisplay(stockStatus, pantryName, itemName);
      };
    }

    async function updateStockDisplay(stockStatus, pantryName, itemName) {
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

                // Dynamically update the table
              const bTable = document.getElementById("browserTable");
              for (let row of bTable.rows) {
                if (row.cells[0].textContent.includes(itemName)) { // Match the item name
                    row.cells[1].textContent = stockStatus; // Update the status column
                    break;
                }
            }
            } else {
                alert('Failed to update item status');
            }
        } catch (error) {
            console.error('Error updating item status:', error);
        }
    }
  
    main();
    
    function fixDate(fxDate) {
      console.log(fxDate);
      if (fxDate != null) {
        date = fxDate.substring(0, 13);
        let dateValues = date.split("-");
        let days = dateValues[2].split("T");
        let time = days[1];
        let d = days[0];
        let dValue = parseInt(d);
        let timeValue = parseInt(time);
        if (timeValue < 5) {
          dValue = dValue - 1;
        }
        console.log(timeValue);
        console.log(dValue);
        if (dValue > 9) {
          date = dateValues[1] + "/" + dValue + "/" +  dateValues[0];
        } else {
          date = dateValues[1] + "/0" + dValue + "/" + dateValues[0];
        }
      } else {
        date = "None";
      }
      return date;
    }