//_______________________Variables____________________________________________________________________

let SignInButton = document.getElementById("SignInButton");
let SignUpButton = document.getElementById("SignUpButton");

//_______________________Functions for on Clicks____________________________________________________________________

// OnClick Function for the Sign in Button
SignInButton.onclick = async function(event) {

    let email = document.getElementById("email-sign-in").value;
    let password = document.getElementById("password-sign-in").value;
    
    let data = { email, password };

    try {
        const response = await fetch('/SignInUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          alert('User signed in successfully!');
        } else {
          alert('Error signing into account. Please check your email and password and try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error signing in');
      }
};

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