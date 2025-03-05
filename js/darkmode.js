var mode = 'dark-mode';
const toggleDarkModeButton = document.getElementById('toggle-mode-icon-inner');
console.log(toggleDarkModeButton);

function toggleDarkMode() {
  if (mode == 'dark-mode') {
    mode = 'light-mode';
    toggleDarkModeButton.classList.add('toggle-go-right');
    document.documentElement.classList.add('dark-mode');
  }
  else if (mode == 'light-mode') {
    mode = 'dark-mode';
    toggleDarkModeButton.classList.remove('toggle-go-right');
    document.documentElement.classList.remove('dark-mode');
  }
  console.log(mode);
}