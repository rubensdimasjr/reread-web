//VERIFICA PERFIL DO USUÁRIO
firebase.auth().onAuthStateChanged(user => {
  if(user){
    findProfile(user);
    findResultQuiz(user);
  }
}); 

function findResultQuiz(user){
  firebase.firestore()
    .collection('result_quiz')
    .where('user.uid', '==',user.uid)
    .get()
    .then(snapshot => {
      const result = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      }))

      addResultToScreen(result);
    })
    .catch(() => {
      alert("Não foi possivel encontrar o resultado do seu quiz!");
      window.location.href = "quiz.html";
    })
}

function findProfile(user){
  firebase.firestore()
    .collection('profile')
    .where('user.uid', '==',user.uid)
    .get()
    .then(snapshot => {
      const result = snapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      }))

      if(result[0].quiz == false){
        update(result[0]);
      }
      
    })
    .catch(() => {
      alert("Não foi possivel encontrar seu perfil!");
      window.location.href = "index.html";
    })
}

function update(user){
  firebase.firestore()
  .collection('profile')
  .doc(user.uid)
  .update({quiz: true})
  .catch(() => {
    alert("Erro ao atualizar perfil");
  })
}

function addResultToScreen(result){
  const card = document.querySelectorAll(".card");

  card.forEach((value,key) => {
    card[key].children[1].innerHTML = result[0].result[key].categoria
    card[key].href = "cursos.html?categoria="+result[0].result[key].categoria;
  })
}