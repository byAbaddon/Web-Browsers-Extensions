document.addEventListener('DOMContentLoaded', function () {
  const html = {
    timeSpan: () => document.querySelector('span'),
  }

  html.timeSpan().textContent = `at: ${new Date().toLocaleTimeString()}`

})
