/* ACTIVE LINK */
const sections = document.querySelectorAll('section[id]');


function scrollActive(){
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute('id');

    if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
      document.querySelector('.nav__menu a[href*='+ sectionId +']').classList.add('active__link');
    }else{
      document.querySelector('.nav__menu a[href*='+ sectionId +']').classList.remove('active__link');
    }
  })
}

window.addEventListener('scroll', scrollActive);

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
      snapshot.docs.forEach(doc => {
        if(doc.data().quiz == false){
          window.location.href = "quiz.html"
        }
      });
    });
}

function logout(){
  firebase.auth().signOut().then(() => {
    window.location.href = "/";
  })
  .catch(() => {
    alert("Erro ao sair");
  })
}