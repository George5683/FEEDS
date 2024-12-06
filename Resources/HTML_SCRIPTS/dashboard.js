const dashboard_title = document.getElementById('dashboard-title');
const container = document.querySelector('.container'); // Container where pantries are displayed

// Get the query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const UsersName = urlParams.get('name');
let userinfo1;



const notificationTab = document.getElementById('notification-tab');
const notificationPopup = document.getElementById('notificationPopup');
const notificationList = document.getElementById('notificationList');

// Toggle popup visibility
notificationTab.addEventListener('click', () => {
    const isVisible = notificationPopup.style.display === 'block';
    notificationPopup.style.display = isVisible ? 'none' : 'block';
});
// Close the notification popup when clicking the "X" button
const closeButton = notificationPopup.querySelector('.close');
closeButton.addEventListener('click', () => {
    notificationPopup.style.display = 'none'; // Hide the popup when "X" is clicked
});

// Sample notifications
// const notifications = [
//     "Your Item (Food Name) has been restocked at (PantryName).",
//     "New items added to Pantry B.",
//     "Your pantry selections have been saved.",
// ];

// Populate the notification list
async function loadNotifications() {
    console.log('notifications loading...');
    try {
        const response = await fetch('/GetNotifications');
// Log the response text to see what's being returned
        const text = await response.text();
        console.log('Response text:', text);
        
        // Check if the response is OK before attempting to parse it as JSON
        if (!response.ok) {
            throw new Error('Failed to fetch notifications: ' + text);
        }
        
        // If we get here, the response should be in JSON format
        const notifications = JSON.parse(text);
        console.log('Notifications:', notifications);  // Log notifications

        const notificationList = document.getElementById('notificationList');
        notificationList.innerHTML = ''; // Clear existing notifications
        notifications.forEach(notification => {
            let message = 'Error';
            if (notification.TYPE === 1) {
                message = `Your Item "${notification.FOOD_NAME}" has been restocked at ${notification.NAME}.`;
            } else {
                message = `Notification type ${notification.TYPE} for ${notification.FOOD_NAME}.`; // Placeholder for future types
            }
            const listItem = document.createElement('li');
            listItem.textContent = `${message}          ${new Date(notification.TIMESTAMP).toLocaleString()}`;
            // "Delete" button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Delete';
            closeButton.classList.add('del'); // Style this with CSS
            closeButton.addEventListener('click', async () => {
                try {
                    // call the API to delete the notification
                    const deleteResponse = await fetch(`/DeleteNotification/${notification.ID}`, {
                        method: 'DELETE',
                    });
                    if (deleteResponse.ok) {
                        listItem.remove();
                    } else {
                        console.error('Failed to delete notification.');
                    }
                } catch (error) {
                    console.error('Error deleting notification:', error);
                }
            });
            listItem.appendChild(closeButton);
            notificationList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

async function getUserInfo(){
    try{
        const response = await fetch('/GetUserInfo');
        userinfo1 = await response.json();
        console.log('User Info:', userinfo1.NAME);
    } catch (error) {
        console.error('Error getting user info:', error);
    }
}

// Load notifications on page load
loadNotifications();

async function main() {

  if (UsersName != null) {
      dashboard_title.textContent = `Welcome ${UsersName}`;
  }
  else{
        await getUserInfo();
        dashboard_title.textContent = `Welcome ${userinfo1.NAME}`;
  }

  try {
      const response = await fetch('/GetPantryInfo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
      });
      
      const pantries = await response.json();

      if (response.ok) {
          pantries.forEach((pantry, index) => {
              const box = document.createElement('div');
              box.classList.add('box');

              // Pantry Container
              const pantryDiv = document.createElement('div');
              pantryDiv.classList.add('pantry');
              pantryDiv.id = `p${index + 1}`;
              
              const title = document.createElement('h2');
              title.textContent = pantry.NAME;

              const image = document.createElement('img');
              image.classList.add('pantryimage');
              image.src = `../Images/${pantry.NAME}.png`;
              image.alt = `${pantry.NAME} Image`;

              const selectButton = document.createElement('a');
              selectButton.href = `./item-browser?pantryName=${encodeURIComponent(pantry.NAME)}`;
              selectButton.innerHTML = '<button>Select</button>';
              
              const infoButton = document.createElement('button');
              infoButton.classList.add('info');
              infoButton.id = `pantry${index + 1}I`;
              infoButton.textContent = 'Info';

              // Add event listener for info button
              infoButton.addEventListener('click', () => {
                  showPopup(pantry.NAME, pantry.ADDRESS, pantry.EMAIL);
              });

              pantryDiv.append(title, image, selectButton, infoButton);

              // Append  pantry div to the box
              box.append(pantryDiv);
              container.appendChild(box);
          });
      } else {
          console.error("Failed to fetch pantry information");
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Error retrieving pantry information from server.');
  }
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

function showPopup(pantryName, pantryLocation, pantryEmail) {
    // Get the modal
    let modal = document.getElementById("popupModal");    // display the modal
    modal.style.display = "block";
    // populate the modal with the pantry information
    document.getElementById("pName").textContent = pantryName;
    document.getElementById("pLocation").textContent = pantryLocation;
    document.getElementById("pEmail").textContent = pantryEmail;
    const infoI = document.createElement('img');
    infoI.src = `../Images/${pantryName}.png`;
    infoI.alt = `${pantryName} Image`;
    document.getElementById("infoImage").innerHTML = `<img src="../Images/${pantryName}.png" alt="${pantryName} Image">`;
  //close the modal when clicking on <span> (x)
  let closeBtn = modal.querySelector(".close");
  closeBtn.addEventListener('click', () => {
    document.getElementById("popupModal").style.display = "none";
    });
  //close the modal when clicking anywhere outside of it
  window.addEventListener('click', () => {
    let modal = document.getElementById("popupModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
    });
}
