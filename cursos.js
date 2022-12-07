
var url_string = document.URL;
var url = new URL(url_string);
var categoria = url.searchParams.get("categoria");

//VERIFICA PERFIL DO USUÁRIO
firebase.auth().onAuthStateChanged(user => {
  if(user){
    findCourses(categoria);
  }
}); 

function findCourses(categoria){
  firebase.firestore()
    .collection('courses')
    .where('categoria', '==',categoria)
    .get()
    .then(snapshot => {
      const cursos = snapshot.docs.map(doc => ({
        ...doc.data(),
        cursoId: doc.id
      }))

      console.log(cursos)

      if(cursos.length === 0){
        alert("Não foi possivel encontrar cursos com essa categoria!");
        window.location.href = "escolha-categoria.html";
      }

      /* console.log(cursos) */

      addResultToScreen(cursos);
    })
    /* .catch(() => {
      alert("Não foi possivel encontrar cursos com essa categoria!");
      window.location.href = "escolha-categoria.html";
    }) */
}

function addResultToScreen(cursos){
  const orderedList = document.querySelector('.courses-container');
  const navbar = document.createElement('div');
  navbar.classList.add('navbar');
  navbar.innerHTML = "<a onclick='window.history.back()'>< Voltar</a><a href='home.html'>Pular ></a>";

  orderedList.appendChild(navbar);
  cursos.forEach(curso => {
    const course = document.createElement('div');
    course.classList.add('course');

    const course_preview = document.createElement('div');
    course_preview.classList.add('course-preview');

    const course_info = document.createElement('div');
    course_info.classList.add('course-info');

    const h6 = document.createElement('h6');
    h6.innerHTML = "Curso";
    const nome = document.createElement('h2');
    nome.innerHTML = curso.nome;
    course_preview.appendChild(h6);
    course_preview.appendChild(nome);

    const categoria = document.createElement('h6');
    categoria.innerHTML = curso.categoria;
    const descricao = document.createElement('h2');
    descricao.innerHTML = curso.descricao;
    const button = document.createElement('a');
    button.classList.add('btn');
    button.innerHTML = "Inscrever"
    button.setAttribute('href','curso.html?id='+curso.cursoId);
    course_info.appendChild(categoria);
    course_info.appendChild(descricao);
    course_info.appendChild(button);

    course.appendChild(course_preview);
    course.appendChild(course_info);

    orderedList.appendChild(course);

  });


  
}