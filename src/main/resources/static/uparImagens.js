

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
              fazerRequisicao(url,file_name);
            });
        }
      );
 
 
    
         
  }

const deletar =(id,img) =>{
  const URL_TO_FETCH = '/apis/deletar-piada?Id='+id;
  console.log(id+"---"+img);
  fetch(URL_TO_FETCH, {method: 'get'})
   .then(response=>{ 
    
    if(response.ok) 
    {
      if(img!="0") {
        apagarNoFirebase(img);
      }
      else
        window.location.reload();
    }
  else throw Error("erro") })
   .catch(err => alert(err.message)) 
  
}

function apagarNoFirebase(img){
  const storageRef = storage.ref();
  const fileRef = storageRef.child('images/'+img);
  fileRef.delete()
  .then(() => {
    alert('Arquivo excluído com sucesso!');
    window.location.reload();
  })
  .catch((error) => {
    alert('Ocorreu um erro ao tentar apagar o arquivo');
    window.location.reload();
  });
}

function fazerRequisicao(urlImg,nome) {
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
            alert("Sucesso");
            window.location.reload();
        }
           else throw Error("erro") 
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}