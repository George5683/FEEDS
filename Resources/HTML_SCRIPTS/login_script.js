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

        const responseData = await response.json();
    
        if (response.ok) {
          console.log("Response is: " + JSON.stringify(responseData));
          if(responseData.user){
            alert('User signed in successfully!');
            // Sending the user to the dashboard page with dynamic name
            window.location.href = `/dashboard?name=${encodeURIComponent(responseData.name)}`;
          }
          else{
            alert('Pantry signed in successfully!');
            window.location.href = `/pantry-dashboard?name=${encodeURIComponent(responseData.name)}`;
          }

        } else {
          alert('Error signing into account. Please check your email and password and try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error signing in on server side');
      }
};

