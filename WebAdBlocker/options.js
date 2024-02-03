document.addEventListener('DOMContentLoaded', function() {
  var popupContainer = document.getElementById('popup-container');
  var optionsLink = document.getElementById('options-link');

  if (popupContainer && optionsLink) {
      optionsLink.addEventListener('click', function() {
          // hide popup.html
          popupContainer.style.display = 'none';
      });
  }
});

