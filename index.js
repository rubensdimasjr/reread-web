const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const eyeIcon = document.getElementById('eyeIcon');
const inputPassword = document.getElementById('password');
const textError = document.createElement("p");

firebase.auth().onAuthStateChanged((user) => {
  firebase.firestore()
  .collection('profile')
  .where('user.uid', '==',user.uid)
  .get()
  .then(() => {
    window.location.href = "quiz.html";
  })
});

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

//VISUALIZAR SENHA
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

//VALIDAÇÃO CAMPOS DE LOGIN

function validateFields(){
  const emailValid = isEmailValid();
  const passwordValid = isPasswordValid();
  form.loginButton().disabled = !emailValid || !passwordValid;
}

function isEmailValid(){
  const email = form.email().value;
  if(!email){
    return false;
  }
  return validateEmail(email);
}

function isPasswordValid(){
  const password = form.password().value;
  if(!password){
    return false;
  }
  return true;
}

function validateEmail(email){
  return /\S+@\S+\.\S+/.test(email);
}

function login(){

  showLoading();

  firebase.auth().signInWithEmailAndPassword(form.email().value,form.password().value).then(response => {
    hideLoading();
    console.log('success', response);
    window.location.href = "home.html";
  }).catch(error => {
    hideLoading();
    alert(getErrorMessage(error));
  });
}

function getErrorMessage(error){
  if(error.code == "auth/user-not-found"){
    return "Usuário não encontrado.";
  }else if(error.code == "auth/wrong-password"){
    return "Senha incorreta.";
  }else if(error.code == "auth/email-already-in-use"){
    return "E-mail já está em uso, cadastre outro e-mail!";
  }else if(error.code == "auth/weak-password"){
    return "Atenção! A senha não pode ser inferior a 6 caracteres."
  }
  return error.message;
}

const form = {
  email: () => document.getElementById('email'),
  password: () => document.getElementById('password'),
  loginButton: () => document.getElementById('login-button')
}

//VALIDAÇÃO DE CAMPOS DO REGISTRO
function onChangeNome() {
  const nomeRegister = formRegister.nomeRegister().value;

  formRegister.invalidErrorNome().style.display = nomeRegister ? "none" : "block"
  toggleRegisterButtonDisable();
}

function onChangeEmail(){
  const emailRegister = formRegister.emailRegister().value;

  if(!validateEmail(emailRegister) || !emailRegister){
    textError.innerHTML = "Email inválido";
    formRegister.invalidErrorEmail().appendChild(textError);
    formRegister.invalidErrorEmail().style.display = "block"
  }else{
    textError.innerHTML = "";
    formRegister.invalidErrorEmail().style.display = "none";
  }
  toggleRegisterButtonDisable();
}

function onChangePassword() {
  const passwordRegister = formRegister.passwordRegister().value;

  formRegister.invalidErrorPassword().style.display = passwordRegister ? "none" : "block"
  toggleRegisterButtonDisable();
}

function toggleRegisterButtonDisable(){
  formRegister.registerButton().disabled = !isFormValid();
}

function isFormValid(){
  if(!formRegister.emailRegister().value || !validateEmail(formRegister.emailRegister().value)){
    return false;
  }

  if(!formRegister.nomeRegister().value){
    return false;
  }

  if(!formRegister.passwordRegister().value){
    return false;
  }

  return true;
}

const formRegister = {
  invalidErrorNome: () => document.getElementById("error-nome"),
  nomeRegister: () => document.getElementById("registerNome"),
  invalidErrorEmail: () => document.getElementById("error-email"),
  emailRegister: () => document.getElementById("registerEmail"),
  invalidErrorPassword: () => document.getElementById("error-password"),
  passwordRegister: () => document.getElementById("registerPassword"),
  registerButton: () => document.getElementById("registerButton")
}

//REGISTRO DE USUÁRIO
function signup(){
  showLoading();
  const email = formRegister.emailRegister().value;
  const password = formRegister.passwordRegister().value;
  firebase.auth().createUserWithEmailAndPassword(
    email,password
  ).then((response) => {
    saveUserProfile(response.user.uid);
  }).catch((error) => {
    hideLoading();
    alert(getErrorMessage(error));
  });
}

function saveUserProfile(uid){

  const user = createProfile(uid);

  firebase.firestore()
  .collection('profile')
  .add(user)
  .then(() => {
    hideLoading();
    window.location.href = "quiz.html";
  })
  .catch(() => {
    alert("Não foi possível cadastrar um perfil");
  })
}

function createProfile(uid){
  return {
    name: formRegister.nomeRegister().value,
    quiz: false,
    type: 'user',
    user: {
      uid: uid
    }
  }
}