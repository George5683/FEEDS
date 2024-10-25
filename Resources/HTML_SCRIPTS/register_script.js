//variables
let SignUpButton = document.getElementById("sign-up-button");

// OnClick Function for the Sign up Button
SignUpButton.onclick = async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let name = document.getElementById("name-sign-up").value;
    let username = document.getElementById("email-sign-up").value;
    let password = document.getElementById("password-sign-up").value;
    
    let data = { username, password, name };

    try {
        const response = await fetch('/SignUpUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

    
        if (response.ok) {
          alert('User sign up successful!');
          console.log(result);
        } else {
          alert('Error signing up');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error signing up');
      }
};