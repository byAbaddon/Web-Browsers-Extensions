//content.js - JavaScript файл за content скрипт (ако искаш да изпълняваш код в контекста на уеб страниците):
// content.js
document.addEventListener('touchstart', myFunction, { passive: true });

function myFunction(event) {
  // Твоят код, който ще се изпълни при 'touchstart'
  console.log('Touchstart event detected:', event);
}

console.log('Content script loaded');

