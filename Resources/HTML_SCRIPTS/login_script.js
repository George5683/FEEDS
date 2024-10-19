document.getElementById('Sign-Up Form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    const signUpForm = event.target;
    const name = signUpForm.querySelector('#name').value;
    const email = signUpForm.querySelector('#email').value;
    const password = signUpForm.querySelector('#password').value;
  
    const data = { name, email, password };
  
    try {
      const response = await fetch('/SignUpUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert('User sign up successfully!');
      } else {
        alert('Error signing up user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error signing up user');
    }
  });
  
  document.getElementById('Sign-In Form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    const signInForm = event.target;
    const email = signInForm.querySelector('#email').value;
    const password = signInForm.querySelector('#password').value;
  
    const data = { email, password };
  
    try {
      const response = await fetch('/LogInUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert('User signed in successfully!');
      } else {
        alert('Error signing in');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error signing in');
    }
  });