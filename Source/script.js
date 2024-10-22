document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('backgournd_color');
  
    colorPicker.addEventListener('input', (event) => {
      document.body.style.backgroundColor = event.target.value;
    });
  });

const infoButton1 = document.getElementById('pantry1I');
const closeButton1 = document.getElementById('close1');
const pan1 = document.getElementById('p1');
const info1 = document.getElementById('i1');

const infoButton2 = document.getElementById('pantry2I');
const closeButton2 = document.getElementById('close2');
const pan2 = document.getElementById('p2');
const info2 = document.getElementById('i2');

const infoButton3 = document.getElementById('pantry3I');
const closeButton3 = document.getElementById('close3');
const pan3 = document.getElementById('p3');
const info3 = document.getElementById('i3');

const infoButton4 = document.getElementById('pantry4I');
const closeButton4 = document.getElementById('close4');
const pan4 = document.getElementById('p4');
const info4 = document.getElementById('i4');

const infoButton5 = document.getElementById('pantry5I');
const closeButton5 = document.getElementById('close5');
const pan5 = document.getElementById('p5');
const info5 = document.getElementById('i5');

const infoButton6 = document.getElementById('pantry6I');
const closeButton6 = document.getElementById('close6');
const pan6 = document.getElementById('p6');
const info6 = document.getElementById('i6');


infoButton1.addEventListener("click", function(){
    pan1.style.display = "none";
    info1.style.display = "unset";
})
closeButton1.addEventListener("click", function(){
  pan1.style.display = "unset";
  info1.style.display = "none";
})

infoButton2.addEventListener("click", function(){
  pan2.style.display = "none";
  info2.style.display = "unset";
})
closeButton2.addEventListener("click", function(){
pan2.style.display = "unset";
info2.style.display = "none";
})

infoButton3.addEventListener("click", function(){
  pan3.style.display = "none";
  info3.style.display = "unset";
})
closeButton3.addEventListener("click", function(){
pan3.style.display = "unset";
info3.style.display = "none";
})

infoButton4.addEventListener("click", function(){
  pan4.style.display = "none";
  info4.style.display = "unset";
})
closeButton4.addEventListener("click", function(){
pan4.style.display = "unset";
info4.style.display = "none";
})

infoButton5.addEventListener("click", function(){
  pan4.style.display = "none";
  info4.style.display = "unset";
})
closeButton5.addEventListener("click", function(){
pan4.style.display = "unset";
info4.style.display = "none";
})

infoButton6.addEventListener("click", function(){
  pan6.style.display = "none";
  info6.style.display = "unset";
})
closeButton6.addEventListener("click", function(){
pan6.style.display = "unset";
info6.style.display = "none";
})