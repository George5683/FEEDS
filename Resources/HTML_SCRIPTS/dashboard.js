const dashboard_title = document.getElementById('dashboard-title');
const container = document.querySelector('.container'); // Container where pantries are displayed

// Get the query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const UsersName = urlParams.get('name');

async function main() {
  if (UsersName) {
      dashboard_title.textContent = `Welcome ${UsersName}`;
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
              image.src = '../Images/new_logo.png';
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
                  pantryDiv.style.display = 'none';
                  infoDiv.style.display = 'unset';
              });

              pantryDiv.append(title, image, selectButton, infoButton);

              // Information Container
              const infoDiv = document.createElement('div');
              infoDiv.classList.add('information');
              infoDiv.id = `i${index + 1}`;
              infoDiv.style.display = 'none'; // Hide initially

              const infoTitle = document.createElement('h2');
              infoTitle.textContent = pantry.NAME;

              const address = document.createElement('h4');
              address.textContent = pantry.ADDRESS;

              const zipcode = document.createElement('h4');
              zipcode.textContent = pantry.ZIP_CODE;

              const closeButton = document.createElement('button');
              closeButton.classList.add('close');
              closeButton.id = `close${index + 1}`;
              closeButton.textContent = 'Close';

              // Add event listener for close button
              closeButton.addEventListener('click', () => {
                  pantryDiv.style.display = 'unset';
                  infoDiv.style.display = 'none';
              });

              infoDiv.append(infoTitle, address, zipcode, closeButton);

              // Append both pantry and information divs to the box
              box.append(pantryDiv, infoDiv);
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
