const navbarToggle = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

navbarToggle.addEventListener('click', function() {
  var targetId = navbarToggle.getAttribute('data-target');
  var target = document.querySelector(targetId);

  if (target.classList.contains('show')) {
    target.classList.remove('show');
    navbarToggle.setAttribute('aria-expanded', 'false');
  } else {
    target.classList.add('show');
    navbarToggle.setAttribute('aria-expanded', 'true');
  }
});