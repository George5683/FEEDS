document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('backgournd_color');
  
    colorPicker.addEventListener('input', (event) => {
      document.body.style.backgroundColor = event.target.value;
    });
  });

  // Template link
const link1 = document.getElementById('page1');
link1.addEventListener("click", function(){
   link1.style.color = "red";
})

// Template link
const link2 = document.getElementById('page2');
link2.addEventListener("click", function(){
   link2.style.color = "green";
})

// Will log out the user and return them to the sign in screen
const logOut = document.getElementById('sOut');
logOut.addEventListener("click", function(){
   logOut.style.color = "blue";
})

// Template table
// Made up data
const item1 = {
    name: "Lucky Charms",
    stock: "5",
    description: "They are magically delicious"

}
const item2 = {
    name: "Frosted Flakes",
    stock: "7",
    description: "They're grrrreat"

}
const item3 = {
    name: "Coco Puffs",
    stock: "2",
    description: "I'm coo-coo for Coco Puffs"

}
const item4 = {
    name: "Trix",
    stock: "3",
    description: "Silly Rabbit, Trix are for kids"

}

// List of made up data
const tempList = [item1, item2, item3, item4];


// Gets values from made up list that will be replaced by data from the database later on
let table = document.getElementById("items");
for (let i = 0; i < tempList.length; i++) {
    let newRow = table.insertRow(table.rows.length);
    if (i/2 % 1) {
        newRow.style.background = "rgb(237 238 242)";
    }
    else {
        newRow.style.background = "white";
    }
    let currentItem = tempList[i];
    newRow.insertCell(0).innerHTML = currentItem.name;
    newRow.insertCell(1).innerHTML = currentItem.stock;
    newRow.insertCell(2).innerHTML = currentItem.description;
}