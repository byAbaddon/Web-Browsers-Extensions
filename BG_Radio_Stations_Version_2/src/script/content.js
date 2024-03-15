//run script in context page

document.addEventListener('touchstart', myFunction, { passive: true });

function myFunction(event) {
  console.log('Touchstart event detected:', event);
}



