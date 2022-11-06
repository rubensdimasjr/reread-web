//VERIFICA PERFIL DO USUÁRIO
firebase.auth().onAuthStateChanged(user => {
  if(user){
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
    });
}

function addResultToScreen(result){
  const card = document.querySelectorAll(".card");
  card.forEach(result => {
    
  })
}