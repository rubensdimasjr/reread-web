/* ACTIVE LINK */
const sections = document.querySelectorAll('section[id]');

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 10,
  breakpoints: {
    640: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 50,
    },
  },
});

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
    findMyCourses(user);
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

function findMyCourses(user){
  firebase.firestore()
    .collection('enrollment')
    .where('userId','==',user.uid)
    .get()
    .then(snapshot => {
      const result = snapshot.docs.map(doc => ({
        ...doc.data(),
        matricula: doc.id
      }));

      console.log(result)
      
      addCourseToScreen(result);

    })
    .catch(() => {
      alert("Não foi possivel encontrar seus cursos.");
    });
}

function addCourseToScreen(listaCourses){
  const swiperCourses = document.querySelector('.swiper-courses');

  listaCourses.forEach((value,key) => {
    var a = document.createElement("a");
    var i = document.createElement("i");
    var p = document.createElement("p");
    a.style.border = "3px solid #"+listaCourses[key].curso.color;
    a.href = "curso.html?id="+listaCourses[key].cursoId;
    a.classList.add('swiper-course-slide');
    i.classList.add('bx');
    i.classList.add(listaCourses[key].curso.icon);
    i.style.borderRight = "2px solid #"+listaCourses[key].curso.color;
    p.innerHTML = listaCourses[key].curso.nome;
    a.append(i);
    a.append(p);
    swiperCourses.appendChild(a);
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