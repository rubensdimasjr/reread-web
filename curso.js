const url_string = window.location.href;
const url = new URL(url_string);

var id_curso = url.searchParams.get("id");
var cursoAtual = [];

//VERIFICA PERFIL DO USUÁRIO
firebase.auth().onAuthStateChanged(user => {
  if(user){
    findEnrollment(id_curso,user);
    findCourse(id_curso);
  }
}); 

function findCourse(id_curso){
  firebase.firestore()
    .collection('courses')
    .where(firebase.firestore.FieldPath.documentId(), '==',id_curso)
    .get()
    .then(snapshot => {
      const curso = snapshot.docs.map(doc => ({
        ...doc.data(),
        cursoId: doc.id
      }))

      if(curso.length === 0){
        alert("Não foi possivel encontrar cursos com esse id!");
        window.location.href = "escolha-categoria.html";
      }

      cursoAtual = curso;

      addCourseToScreen(curso);

    })
}



function findEnrollment(id_curso,user){
  showLoading();
  firebase.firestore()
    .collection('enrollment')
    .where('cursoId', '==',id_curso)
    .where('userId', '==',user.uid)
    .get()
    .then(snapshot => {
      const matricula = snapshot.docs.map(doc => ({
        ...doc.data(),
      }))

      if(matricula.length !== 0){
        const btn = document.querySelector('.btn');
        btn.setAttribute('disabled','true');
        btn.innerHTML = "Já inscrito"
      }

    })
}

function addCourseToScreen(curso){
  const title = document.querySelector('.section__title');
  const description = document.querySelector('.section__description');
  const vagas = document.querySelector('.number__vagas');

  const descricao = curso[0].descricao === null ? '' : '"'+curso[0].descricao+'"';

  title.innerHTML = curso[0].nome;
  description.innerHTML = descricao;
  vagas.innerHTML = curso[0].vagas;

  hideLoading();
}

function saveEnrollment(){
  showLoading();
  console.log(cursoAtual);

  const enrollment = createEnrollment(cursoAtual);
  firebase.firestore()
  .collection('enrollment')
  .add(enrollment)
  .then(() => {
    updateCourse(cursoAtual);
  })
  .catch(() => {
    hideLoading();
    alert("Erro ao matricular usuário no curso!")
  });
}

function updateCourse(curso){
  firebase.firestore()
  .collection('courses')
  .doc(curso[0].cursoId)
  .update({vagas: curso[0].vagas - 1})
  .then(() => {
    hideLoading();
    alert("Matricula realizada com sucesso!")
    window.location.href = "curso.html?id="+cursoAtual[0].cursoId
  })
  .catch(() => {
    alert("Erro ao atualizar número de vagas no curso!")
  })
}

function createEnrollment(curso){
  switch(curso[0].categoria){
    case 'Cinema/Cultura':
      var icon = 'bxs-image';
      var color = '3A86FF';
      break;
    case 'Bem-Estar':
      var icon = 'bxs-donate-heart';
      var color = 'FF006E';
      break;
    case 'Tecnologias':
      var icon = 'bxs-microchip';
      var color = '8338EC';
      break;
    case 'Línguas Estrangeiras':
      var color = 'FB5607';
      var icon = 'bx-globe';
      break;
    case 'Produção/Ensino':
      var icon = 'bxs-graduation';
      var color = 'FFBE0B';
      break;
    case 'Leitura/Alfabetização':
      var icon = 'bx-book-reader';
      var color = '2a9d8f';
      break;
    case 'Deficiências':
      var icon = 'bx-handicap';
      var color = '003049';
      break;
  }
  return {
    curso: {
      color: color,
      icon: icon,
      nome: curso[0].nome,
      descricao: curso[0].descricao
    },
    cursoId: curso[0].cursoId,
    userId: firebase.auth().currentUser.uid
  };
}