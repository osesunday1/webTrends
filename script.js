//--------------- NAVBAR----------------------

const nav = document.querySelector(".nav"),
  searchIcon = document.querySelector("#searchIcon"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn");
searchIcon.addEventListener("click", () => {
  nav.classList.toggle("openSearch");
  nav.classList.remove("openNav");
  if (nav.classList.contains("openSearch")) {
    return searchIcon.classList.replace("uil-search", "uil-times");
  }
  searchIcon.classList.replace("uil-times", "uil-search");
});
navOpenBtn.addEventListener("click", () => {
  nav.classList.add("openNav");
  nav.classList.remove("openSearch");
  searchIcon.classList.replace("uil-times", "uil-search");
});
navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("openNav");
});

//--------------- NAVBAR----------------------





//--------------- popup container1----------------------

const open1 = document.getElementById('open1');
const close1 = document.getElementById('close1');
const popup_container= document.getElementById('popup_container');

const open2 = document.getElementById('open2');
const close2 = document.getElementById('close2')
const popup_container2= document.getElementById('popup_container2');

const open3 = document.getElementById('open3');
const close3 = document.getElementById('close3')
const popup_container3= document.getElementById('popup_container3');


open1.addEventListener('click', () =>{
    popup_container.classList.add('show');
});

close1.addEventListener('click', () =>{
    popup_container.classList.remove('show');
});


open2.addEventListener('click', () =>{
  popup_container2.classList.add('show');
});
close2.addEventListener('click', () =>{
  popup_container2.classList.remove('show');
});

open3.addEventListener('click', () =>{
  popup_container3.classList.add('show');
});
close3.addEventListener('click', () =>{
  popup_container3.classList.remove('show');
});
//--------------- popup container1----------------------


//------------------------------------page scroll--------------------------

function smoothScrollToSection(target) {
  const element = document.querySelector(target);
  const navbarHeight = document.querySelector('.nav').offsetHeight;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition - navbarHeight;

  window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
  });
}

// Attach click event handlers to each menu item to enable smooth scrolling
const menuItems = document.querySelectorAll('.nav-links a');
menuItems.forEach(item => {
  item.addEventListener('click', event => {
      event.preventDefault();
      const target = event.target.getAttribute('href');
      smoothScrollToSection(target);
  });
});