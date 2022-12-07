//VERIFICA PERFIL DO USUÁRIO
firebase.auth().onAuthStateChanged(user => {
  if(user){
    findProfile(user);
  }
}); 

function findProfile(user){
  firebase.firestore()
    .collection('profile')
    .where('user.uid', '==',user.uid)
    .get()
    .then(snapshot => {
      const profile = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      }))

      if(profile[0].quiz == true){
        window.location.href = "home.html";
      }

      document.querySelector(".username").innerHTML = profile[0].name+"!";
    });
}

const listaQuestoes = [
  {nome:'question0',categoria:'Produção/Ensino'},
  {nome:'question1',categoria:'Bem-Estar'},
  {nome:'question2',categoria:'Tecnologias'},
  {nome:'question3',categoria:'Tecnologias'},
  {nome:'question4',categoria:'Produção/Ensino'},
  {nome:'question5',categoria:'Cinema/Cultura'},
  {nome:'question6',categoria:'Deficiências'},
  {nome:'question7',categoria:'Línguas Estrangeiras'},
  {nome:'question8',categoria:'Cinema/Cultura'},
  {nome:'question9',categoria:'Leitura/Alfabetização'},
  {nome:'question10',categoria:'Cinema/Cultura'},
  {nome:'question11',categoria:'Bem-Estar'},
  {nome:'question12',categoria:'Bem-Estar'},
  {nome:'question13',categoria:'Línguas Estrangeiras'},
  {nome:'question14',categoria:'Produção/Ensino'},
  {nome:'question15',categoria:'Produção/Ensino'}
];

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Enviar";
  } else {
    document.getElementById("nextBtn").innerHTML = "Próximo";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {

    const formData = new FormData(document.getElementById('formQuiz'));
    
    for(const [key,value] of formData){
      var pontos = 0;
      switch(value){
        case 'sim':
          pontos = pontos + 10;
          break;
        case 'parcialmente':
          pontos = pontos + 5;
          break;
      }
      listaQuestoes.forEach(object =>{
        if(object.nome == key){
          object['pontos'] = pontos;
        }
      });
    }

    const novaLista = listaQuestoes.reduce((soma,current) =>{
      let categoria = current.categoria;
      let repetido = soma.find(element => element.categoria === categoria)
      if(repetido) repetido.pontos += current.pontos;
      else soma.push(current);

      return soma;
    },[]);

    novaLista.sort(function(a,b) {
      if(a.pontos < b.pontos) return 1;
      if(a.pontos > b.pontos) return -1;
      return 0;
    });
    
    //CADASTRA O RESULTADO DO QUIZ DO USUARIO ATUAL
    saveResultQuiz(novaLista);
    
  }

  showTab(currentTab);
}

function saveResultQuiz(novaLista){
  showLoading();
  const result_quiz = createResultQuiz(novaLista)
  firebase.firestore()
  .collection('result_quiz')
  .add(result_quiz)
  .then(() => {
    hideLoading();
    window.location.href = "escolha-categoria.html";
  })
  .catch(() => {
    hideLoading();
    alert("Erro ao salvar resultado do Quiz")
  });
}

function createResultQuiz(novaLista){
  return {
    result: novaLista,
    user: {
        uid: firebase.auth().currentUser.uid
    }
  };
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  error = document.querySelector('#error');
  contador = 0;
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    !y[i].checked ? contador++ : '';
    if (contador > 8) {
      // add an "invalid" class to the field:
      error.style.display = "block";
      error.classList.add('input-field-error');
      error.focus();

      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
    error.style.display = "none";
    error.classList.remove('input-field-error');
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}