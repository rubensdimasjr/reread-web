function showLoading(){
  const div = document.createElement('div');
  div.classList.add('loading');
  
  const label = document.createElement('label');
  label.innerHTML = "Carregando...";

  div.appendChild(label);

  document.body.prepend(div);

  /* setTimeout(() => hideLoading(),2000); */
}

function hideLoading(){
  const loading = document.getElementsByClassName('loading');
  if(loading.length){
    loading[0].remove();
  }
}