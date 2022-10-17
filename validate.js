const eyeIcon = document.getElementById('eyeIcon');
const inputPassword = document.getElementById('password');

eyeIcon.addEventListener("click", () => {
  if(eyeIcon.className.endsWith('fa-eye-slash')){
    eyeIcon.classList.remove('fa-eye-slash')
    eyeIcon.classList.add('fa-eye');
    inputPassword.setAttribute('type','text');
  }else{
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
    inputPassword.setAttribute('type','password');
  }
  inputPassword.focus();
});