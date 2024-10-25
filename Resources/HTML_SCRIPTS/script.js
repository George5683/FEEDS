document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('backgournd_color');
  
    colorPicker.addEventListener('input', (event) => {
      document.body.style.backgroundColor = event.target.value;
    });
  });
