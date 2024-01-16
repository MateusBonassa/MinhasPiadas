

const firebaseConfig = {

    apiKey: "AIzaSyDL6uJc9n39A7b6hkkVeTM6XIOo9MyvZog",
  
    authDomain: "projeto-faculdade-403622.firebaseapp.com",
  
    projectId: "projeto-faculdade-403622",
  
    storageBucket: "projeto-faculdade-403622.appspot.com",
  
    messagingSenderId: "909600089493",
  
    appId: "1:909600089493:web:45d194ed9a9934cd7cc29c"
  
  };

  const app = firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();
     

  const uploadImage = ()=>{
    const loaderContainer = document.getElementById("loaderContainer");
    const content = document.getElementById("modalPiImg");
    const btEnviarImg = document.getElementById("btEnviarImg");
    if(validarDadosCadPiadaImg())
    {
      
      loaderContainer.style.display = "flex";
      content.style.pointerEvents = "none"; // Desativa interação com o conteúdo
      btEnviarImg.disabled = true;
      var file = document.getElementById("imagem").files[0];
      const dataAtual = new Date();
      const file_name = `${dataAtual.getSeconds()}_${dataAtual.getMinutes()}_${dataAtual.getHours()}_${dataAtual.getDate()}_${dataAtual.getMonth() + 1}_${dataAtual.getFullYear()}`+file.name;
      //alert(file_name);
      const storageRef = storage.ref().child("images");
      const folderRef = storageRef.child(file_name);
      const uploadtask = folderRef.put(file);
      var uploadedFileName;
  
      uploadtask.on(
          "state_changed",
          (snapshot) => {
             
              uploadedFileName = snapshot.ref.name;
          },
          (error) => {
            reject(error);
          },
          () => {
            storage
              .ref("images")
              .child(uploadedFileName)
              .getDownloadURL()
              .then((url) => {
                //alert(url);
                fazerRequisicao(url,file_name,loaderContainer,content,btEnviarImg);
                
              });
          }
        );
      

    }
    
 
 
    
         
  }

const deletar =(id,img) =>{
  const loaderContainer = document.getElementById("loaderContainer");
  const content = document.getElementById("modal-deletar");
  document.getElementById("deletar").disabled = true;
  loaderContainer.style.display = "flex";
  content.style.pointerEvents = "none";
  const URL_TO_FETCH = '/apis/deletar-piada?Id='+id;
  fetch(URL_TO_FETCH, {method: 'get'})
   .then(response=>{ 
    
    if(response.ok) 
    {
      if(img!="0") {
        apagarNoFirebase(img,loaderContainer,content);
      }
      else
        window.location.reload();
    }
  else throw Error("erro") })
   .catch(err => alert(err.message)) 
  
}

function apagarNoFirebase(img,loaderContainer,content){
 
  const storageRef = storage.ref();
  const fileRef = storageRef.child('images/'+img);
  fileRef.delete()
  .then(() => {
    loaderContainer.style.display = "none";
    content.style.pointerEvents = "auto";
    alert('Piada excluída com sucesso!');
    window.location.reload();
  })
  .catch((error) => {
    alert('Ocorreu um erro ao tentar apagar a piada!');
    window.location.reload();
  });
}

function fazerRequisicao(urlImg,nome,loaderContainer,content) {
    const URL_TO_FETCH = '/apis/cadastrar-piada-img';
    const formulario = document.getElementById("cadPiadaImg");
    const data = new URLSearchParams(new FormData(formulario));
    data.append('token', localStorage.getItem("token"));
    data.append('imagem',urlImg);
    data.append('imgNome',nome);

    fetch( URL_TO_FETCH, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    })
    .then(response => {
      
        if(response.ok) {
            loaderContainer.style.display = "none";
            content.style.pointerEvents = "auto";
            btEnviarImg.disabled = false;
            alert("Sucesso");
            window.location.reload();
        }
        else{
          loaderContainer.style.display = "none";
          content.style.pointerEvents = "auto";
          btEnviarImg.disabled = false;
          alert("Ocorreu um erro na requisição! Tente Novamente!");
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}


function validarDadosCadPiadaImg() {

  var titulo2 = document.getElementById("titulo2");
  var keywords2 = document.getElementById("keywords2");
  var imagem = document.getElementById("imagem");
  var allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.ico', '.svg', '.webp', '.jfif'];
  var correto=true;
  if (imagem.files.length === 0) {
    alert('Por favor, escolha um arquivo.');
    return false;
  }

  var fileName = imagem.files[0].name;
  var fileExtension = '.' + fileName.split('.').pop().toLowerCase();

  if (allowedExtensions.indexOf(fileExtension) === -1) {
      alert('Formato de arquivo não permitido. Por favor, escolha um formato válido.');
      return false;
  }
  if(titulo2.value.length < 5) 
  { 
    titulo2.value = "";
      titulo2.setAttribute('placeholder','Escreva um título maior!');
      titulo2.style.border = "solid 1px red";
      
      correto = false;
      titulo2.focus();
  }
  else 
  {
      titulo2.style.border = "none";
  }
  if(keywords2.value.length < 4) 
  { 
    keywords2.value = "";
      keywords2.setAttribute('placeholder','Digite no mínimo uma palavra inteira!');
      keywords2.style.border = "solid 1px red";
      //auxPonteiro=1;
      correto = false;
      keywords2.focus();
  }
  else 
  {
      keywords2.style.border = "none";
  }

  return correto;
}