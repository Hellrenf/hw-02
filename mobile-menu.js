const burgerMenu = document.querySelector('.burger-menu');
const mainNav = document.querySelector('.main-nav');

burgerMenu.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  burgerMenu.classList.toggle('active');
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    burgerMenu.classList.remove('active');
  });
});