//variables
let SignUpButton = document.getElementById("SignUpButton");

// OnClick Function for the Sign up Button
SignUpButton.onclick = async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let name = document.getElementById("name-sign-up").value;
    let username = document.getElementById("username-sign-up").value;
    let password = document.getElementById("password-sign-up").value;
    let zip_code = document.getElementById("zipcode-sign-up").value;
    let email = document.getElementById("email-sign-up").value;
    
    let data = { username, password, name, zip_code, email };

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
          console.log(result);
          alert('User sign up successful! Please login to continue!');
          window.location.href = '/';
        } else {
          alert('Error signing up');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error signing up');
      }
};