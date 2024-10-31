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



  main();
  