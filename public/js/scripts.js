 // nav toggle script for mobile version
(function () {
  document.querySelector('.main-nav').classList.remove('main-nav--nojs');
  var navToggle = document.querySelector('.nav-toggle');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('nav-toggle--open');
  })
})();


 // slideshow script
(function() {
  var interval = 3000;

  var slideInterval = setInterval(nextSlide, interval);
  var toggleInterval = setInterval(nextToggle, interval);

  var slides = document.querySelectorAll('.slideshow__item');
  var toggles = document.querySelectorAll('.slideshow__toggle');

  var currentSlide = 0;
  var currentToggle = 0;

  slides.forEach(function(item, i) {
    item.className = 'slideshow__item slideshow__item--slide' + (i + 1);
  });

  function nextSlide() {
    slides[currentSlide].classList.remove('slideshow__item--active');
    currentSlide = (currentSlide + 1)%slides.length;
    slides[currentSlide].classList.add('slideshow__item--active');
  }

  function nextToggle() {
    toggles[currentToggle].classList.remove('slideshow__toggle--checked');
    currentToggle = (currentToggle + 1)%toggles.length;
    toggles[currentToggle].classList.add('slideshow__toggle--checked');
  }
 })();

// (document.documentElement.clientWidth > '768')


