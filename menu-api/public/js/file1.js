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
// Kiểm tra sự tồn tại của phần tử HTML với id là 'myElement'
var myElement = document.getElementById('myElement');
const test = document.cookie.split('; ').find(row => row.startsWith('id=')).split('=')[1];
if (test!=null) {
// Gán giá trị cookie vào thuộc tính innerHTML của phần tử HTML
  
  myElement.innerHTML = `
  <form action="/api/menu/items/dangxuat" method="get">
    <button class="nav-item nav-link text-white">Xin chào .Đăng xuất!</button>
  </form>
  `
}
// else{
//   myElement.innerHTML = `
//   <a class="nav-item nav-link" href="./dangnhap">Đăng nhập/Đăng kí</a>
//   `
// }