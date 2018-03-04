 // nav toggle script for mobile version
(function () {
  var navToggle = document.querySelector('.nav-toggle');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('nav-toggle--open');
  })
})();

 // slideshow script
(function() {
  if (document.documentElement.clientWidth > '768') {
    var interval = 3000;

    var slideInterval = setInterval(nextSlide, interval);
    var toggleInterval = setInterval(nextToggle, interval);

    var slides = document.querySelectorAll('.news__slide');
    var toggles = document.querySelectorAll('.news__item');

    var currentSlide = 1;
    var currentToggle = 1;

    function nextSlide() {
      slides[currentSlide].classList.remove('news__slide--active');
      currentSlide = (currentSlide + 1)%slides.length;
      slides[currentSlide].classList.add('news__slide--active');
    }

    function nextToggle() {
      toggles[currentToggle].classList.remove('news__item--active');
      currentToggle = (currentToggle + 1)%toggles.length;
      toggles[currentToggle].classList.add('news__item--active');
    }
  }
})();
