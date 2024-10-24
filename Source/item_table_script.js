function showPopup(itemName, itemStock, itemDate) {
    // Get the modal
    let modal = document.getElementById("popupModal");
    // display the modal
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
  