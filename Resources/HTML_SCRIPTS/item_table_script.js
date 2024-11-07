async function main(){
  let PantryNamePlaceHolder = document.getElementById("PantryNamePlaceHolder");  
  
  // Get the query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const pantryName = urlParams.get('pantryName');

  // Use the pantryName value
  if (pantryName) {
      console.log(`Selected Pantry: ${pantryName}`);
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
        addRow(responseData[i].FOOD_NAME, responseData[i].STATUS);
      }
    }

  } catch (error) {
  console.error('Error:', error);
  alert('Error retrieving pantry information from server.');
  }
}

function addRow(name, status) {
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
    showPopup(name, status, "11/02/2024");
  });
}

function showPopup(itemName, itemStock, itemDate) {
    // Get the modal
    let modal = document.getElementById("popupModal");    // display the modal
    modal.style.display = "block";
    // populate the modal with the item information
    document.getElementById("itemName").textContent = itemName;
    document.getElementById("itemStock").textContent = itemStock;
    document.getElementById("itemDate").textContent = itemDate;
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

  function toggleStar(element) {
    const itemId = element.getAttribute("data-item-id");
    const isSelected = element.classList.toggle("selected");
  
    // Change star appearance
    element.innerHTML = isSelected ? "&#9733;" : "&#9734;"; // &#9733; is a filled star
  }


  main();
  