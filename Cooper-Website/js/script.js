const toggleButtons = document.getElementsByClassName('toggle-button')
const navLinks = document.getElementsByClassName('navbar-links2')

if (toggleButtons && navLinks) {
  const toggleButton = toggleButtons[0]
  const navLink = navLinks[0]

  if (toggleButton && navLink) {
    toggleButton.addEventListener('click', () => {
      navLink.classList.toggle('active')
    })
  }
}