




  



function logar() {
    const URL_TO_FETCH = '/security/autenticar';
    const data = new URLSearchParams();
    for (const pair of new FormData(document.getElementById('fdados'))) {
     data.append(pair[0], pair[1]);
    }
    fetch(URL_TO_FETCH, {method: 'post', body: data })
     .then(response=>{ if(response.ok) return response.json(); else throw Error("Usuário não Encontrado!") })
     .then(result => {localStorage.setItem("token", result.token); window.location.href = "home.html";})
     .catch(err => alert(err.message)) 
}



function cadastrar()
{
    var nome = document.getElementById("nomecompleto").value;
    var login = document.getElementById("login").value;
    var senha = document.getElementById("senha").value;
    if(validarDadosCT())
    {
        const URL_TO_FETCH = '/cadastro/cad-usuario?nomecompleto='+nome+'&&login='+login+'&&senha='+senha;      
        
        fetch(URL_TO_FETCH, {method: 'get'})
        .then(response=>{  
            return response.text(); })
        .then(result => {
            var dados = JSON.parse(result);
            if(dados.mensagem!=""){
                alert(dados.mensagem);
            }
            else{
                alert("Cadastro efetuado com sucesso!\nFaça o login para acessar!");
                window.location.href = window.location.protocol + "//" + window.location.host;
            }
        
        })
        .catch(err => alert(err.message)) 
    }
}


function adicionarPiada()
{
    const loaderContainer = document.getElementById("loaderContainer");
    const content = document.getElementById("modalPiResp");
    loaderContainer.style.display = "flex";
    content.style.pointerEvents = "none"; // Desativa interação com o conteúdo
    var titulo = document.getElementById("titulo").value;
    var texto = document.getElementById("texto").value;
    //console.log(texto.charCodeAt(5))
     texto = texto.replace(/\r\n|\n|\r/g, '<br>');
     texto = '<p>'+texto+'</p>';
    console.log(texto);
    var keywords = document.getElementById("keywords").value;
    var cat_id = document.getElementById("categoriaResp").value;
    var cat_nome = document.getElementById(cat_id).innerHTML;
    var resposta = document.getElementById("resposta").value;

    const URL = `apis/cadastrar-piada?titulo=${titulo}&&texto=${texto}&&keywords=${keywords}&&categoria=${cat_id}&&CatNome=${cat_nome}&&resposta=${resposta}&&token=${localStorage.getItem("token")}`;
   
    if(validarDadosCadPiada()){
        fetch(URL, {method: 'get'})
        .then(response=>{ 
            if(response.ok)
            {
                loaderContainer.style.display = "none";
                content.style.pointerEvents = "auto";
                alert("Piada cadastrada com sucesso!")
                window.location.reload();
            }
            
           else throw Error("erro") })
        .catch(err => alert(err.message)) 
    }
    loaderContainer.style.display = "none";
    content.style.pointerEvents = "auto";
}



function pegarCategorias(categoria)
{
    const URL_TO_FETCH = '/apis/listar-categorias';
    
    
    fetch(URL_TO_FETCH, {method: 'get'})
     .then(response=>{ if(response.ok)
        return response.text()
         ; else throw Error("erro") })
         .then(result => {
            var cat;
            var sel = document.getElementById(categoria);
            var opcs="";
            for (cat of JSON.parse(result))
                opcs+=`<option id="${cat.id}" value="${cat.id}"selected>${cat.nome.replace(/^\w/, (c) => c.toUpperCase())}</option>`;
            sel.innerHTML = opcs;
            }    
            )
     .catch(err => alert(err.message)) 
}


function redirecionarCadPi()
{
    const URL_TO_FETCH = '/security/testar-login';
    const currentOrigin = window.location.origin;
    fetch(URL_TO_FETCH, {method: 'post'})
    .then(response=> response.text())
    .then(result=>{  
        if(JSON.parse(result)==true)
            window.location.href = currentOrigin+"/cad_piada.html";
        else
            window.location.href = window.location.protocol + "//" + window.location.host;
    
    })
    .catch(err=> console.error(err));

}

function carregarPiadas_e_Ranking(){
    const loaderContainer = document.getElementById("loaderContainer");
    const content = document.getElementById("dadosTela");
    loaderContainer.style.display = "flex";
    content.style.pointerEvents = "none";
    const piadasPromise = new Promise((resolve) => {
        carregarPiadas(resolve);
    });

    const rankingPromise = new Promise((resolve) => {
        carregarPiadasRanking(resolve);
    });

    // Aguardando a conclusão de ambas as Promises
    Promise.all([piadasPromise, rankingPromise]).then(() => {
        // Ocultando o indicador de carregamento após a conclusão das chamadas assíncronas
        loaderContainer.style.display = "none";
        content.style.pointerEvents = "auto"; // Ativa interação com o conteúdo
    });
}

function carregarPiadas(callback)
{

  
    const url = 'apis/listar-todas-piadas';
    fetch(url, {method: 'get'})
    .then(response=>{ if(response.ok)
       return response.text()
        ; else throw Error("erro") })
        .then(result => {
           var piada;
           var body = document.getElementById("ListaPiadas");
           var piadas="";
           var obj = ordenarPorId(JSON.parse(result));
           for (piada of obj)
               {
                    if(piada.tipo==0)
                    {
                        piadas+=`
                        <div class="piada-div" onclick="marcarPraCurtida(${piada.id})" data-toggle="modal" data-target="#modal-curtir">
                    
                    <div class="titulo-piada flex-div space-between">
                        <p>${piada.titulo}</p>
                        <p class="categoria-piada">${piada.categoria.nome}</p>
                    </div>  
                
                    <div class="texto-piada-div">
                        <p class="reset-texto texto-piada">${piada.texto}</p>
                        <p class="resposta-piada">${piada.resposta}</p>
                    </div>
                    
                    <div class="info-piada-div flex-div space-between">
                        <div class="autor-piada">
                            <p class="reset-texto">${piada.usuario.nome}</p>
                        </div>
                        <div class="curtidas-piada">
                            <p class="reset-texto">${piada.ranking} curtida(s)</p>
                        </div>
                        
                    </div>

                </div>
                        `;
                    }
                    else if(piada.tipo==1)
                    {
                        piadas+=`
                        <div class="piada-div" data-toggle="modal" onclick="marcarPraCurtida(${piada.id})" data-target="#modal-curtir">
                    <div class="titulo-piada flex-div space-between">
                        <p>${piada.titulo}</p>
                        <p class="categoria-piada">${piada.categoria.nome}</p>
                    </div>  
                    <div class="texto-piada-div">
                        <div class="div-imagem">
                            <img class="imagem-piada" src="${piada.imagem}" alt="">
                        </div>
                        </div>
                    <div class="info-piada-div flex-div space-between">
                        <div class="autor-piada">
                            <p class="reset-texto">${piada.usuario.nome}</p>
                        </div>
                        <div class="curtidas-piada">
                            <p class="reset-texto">${piada.ranking} curtida(s)</p>
                        </div>
                        
                    </div>
                </div>
                        `;
                    }
               }
           body.innerHTML = piadas;
           }    
           )
    .catch(err => alert(err.message)) 
    if (callback) {
        callback();
    }
}


function marcarPraCurtida(piada_id)
{
    const URL_TO_FETCH = '/security/testar-login';
    fetch(URL_TO_FETCH, {method: 'post'})
    .then(response=> response.text())
    .then(result=>{  
        if(JSON.parse(result)==true)
            document.getElementById("curtida").setAttribute("onclick","curtir("+piada_id+")");
        else
            window.location.href = "http://localhost:8080";

     })
    .catch(err=> console.error(err));
    
}


function curtir(piada_id)
{
    const URL_TO_FETCH = '/apis/dar-curtida?id='+piada_id;
    
    fetch(URL_TO_FETCH, {method: 'get'})
     .then(response=>{ if(response.ok) window.location.reload();  else throw Error("erro") })
     .catch(err => alert(err.message)) 
    
}


function buscar()
{
    var filtro = document.getElementById("filtrobusca");
    const url = 'apis/busca-filtrada?filtro='+filtro.value;
    fetch(url, {method: 'get'})
    .then(response=>{ if(response.ok)
       return response.text()
        ; else throw Error("erro") })
        .then(result => {
           var piada;
           var body = document.getElementById("ListaPiadas");
           var piadas="";
           
           for (piada of JSON.parse(result))
               {
                    if(piada.tipo==0)
                    {
                        piadas+=`
                        <div class="piada-div" onclick="marcarPraCurtida(${piada.id})" data-toggle="modal" data-target="#modal-curtir">
                    
                    <div class="titulo-piada flex-div space-between">
                        <p>${piada.titulo}</p>
                        <p class="categoria-piada">${piada.categoria.nome}</p>
                    </div>  
                
                    <div class="texto-piada-div">
                        <p class="reset-texto texto-piada">${piada.texto}</p>
                        <p class="resposta-piada">${piada.resposta}</p>
                    </div>
                    
                    <div class="info-piada-div flex-div space-between">
                        <div class="autor-piada">
                            <p class="reset-texto">${piada.usuario.nome}</p>
                        </div>
                        <div class="curtidas-piada">
                            <p class="reset-texto">${piada.ranking} curtida(s)</p>
                        </div>
                        
                    </div>

                </div>
                        `;
                    }
                    else if(piada.tipo==1)
                    {
                        piadas+=`
                        <div class="piada-div" data-toggle="modal" onclick="marcarPraCurtida(${piada.id})" data-target="#modal-curtir">
                    <div class="titulo-piada flex-div space-between">
                        <p>${piada.titulo}</p>
                        <p class="categoria-piada">${piada.categoria.nome}</p>
                    </div>  
                    <div class="texto-piada-div">
                        <div class="div-imagem">
                            <img class="imagem-piada" src="${piada.imagem}" alt="">
                        </div>
                        </div>
                    <div class="info-piada-div flex-div space-between">
                        <div class="autor-piada">
                            <p class="reset-texto">${piada.usuario.nome}</p>
                        </div>
                        <div class="curtidas-piada">
                            <p class="reset-texto">${piada.ranking} curtida(s)</p>
                        </div>
                        
                    </div>
                </div>
                        `;
                    }
               }
           body.innerHTML = piadas;
           }    
           )
    .catch(err => alert(err.message)) 
}


    


function validarDadosCT() {


    var nomecompleto = document.querySelector("#login");
    var login = document.querySelector("#nomecompleto"); 
    var senha = document.querySelector("#senha"); 
    let format = new RegExp(/^(\w+[\-\.])*\w+@(\w+\.)+[A-Za-z]+$/); 
    var correto=true;
    
    if(login.value.length < 5) 
    {  login.value = "";
        login.setAttribute('placeholder','Nome invalido!');
        login.style.border = "solid 1px red";
        correto = false;
        login.focus();
    }
    else 
    {
        login.style.border = "none";
    }
    if(!format.test(nomecompleto.value))
    {
        nomecompleto.value="";
        nomecompleto.setAttribute('placeholder','Email invalido!');
        nomecompleto.style.border = "solid 1px red";
        if(correto)
            nomecompleto.focus();
        correto = false;
    }
    else
    {
        nomecompleto.style.border = "none";
    }
    if(senha.value.length < 5) 
    {  senha.value = "";
        senha.setAttribute('placeholder','Tamanho minímo de 5 caracteres!');
        senha.style.border = "solid 1px red";
        //auxPonteiro=1;
        if(correto)
            senha.focus();
        correto = false;
    }
    else 
    {
        senha.style.border = "none";
    }   
    return correto;
  }


  function validarDadosCadPiada() {

    var titulo = document.getElementById("titulo");
    var texto = document.getElementById("texto");
    var keywords = document.getElementById("keywords");
    var resposta = document.getElementById("resposta");
    var correto=true;
    
    if(titulo.value.length < 5) 
    {  titulo.value = "";
        titulo.setAttribute('placeholder','Escreva um título maior!');
        titulo.style.border = "solid 1px red";
        //auxPonteiro=1;
        correto = false;
        titulo.focus();
    }
    else 
    {
        titulo.style.border = "none";
    }

    if(texto.value.length < 5) 
    {  texto.value = "";
        texto.setAttribute('placeholder','Tamanho minímo de 5 caracteres!');
        texto.style.border = "solid 1px red";
        //auxPonteiro=1;
        correto = false;
        texto.focus();
    }
    else 
    {
        texto.style.border = "none";
    }


    if(keywords.value.length < 1) 
    {  keywords.value = "";
        keywords.setAttribute('placeholder','Digite no mínimo uma palavra inteira!');
        keywords.style.border = "solid 1px red";
        
        correto = false;
        keywords.focus();
    }
    else 
    {
        keywords.style.border = "none";
    }

  


    return correto;
  }


 

  function carregarPiadasUsuario()
  {
    const loaderContainer = document.getElementById("loaderContainer");
    const content = document.getElementById("dadosTela");
    loaderContainer.style.display = "flex";
    content.style.pointerEvents = "none";
      const url = 'apis/busca-piada-usuario?token='+localStorage.getItem("token");

      fetch(url, {method: 'get'})
      .then(response=>{ if(response.ok)
         return response.text()
          ; else throw Error("erro") })
          .then(result => {
             var piada;
             var body = document.getElementById("ListaPiadas");
             var piadas="";
             for (piada of JSON.parse(result))
                 {
                      if(piada.tipo==0)
                      {
                          piadas+=`
                          <div class="piada-div" onclick="marcarPraDeletar(${piada.id},'0')" data-toggle="modal" data-target="#modal-deletar">
                      
                      <div class="titulo-piada flex-div space-between">
                          <p>${piada.titulo}</p>
                          <p class="categoria-piada">${piada.categoria.nome}</p>
                      </div>  
                  
                      <div class="texto-piada-div">
                          <p class="reset-texto texto-piada">${piada.texto}</p>
                          <p class="resposta-piada">${piada.resposta}</p>
                      </div>
                      
                      <div class="info-piada-div flex-div space-between">
                          <div class="autor-piada">
                              <p class="reset-texto">${piada.usuario.nome}</p>
                          </div>
                          <div class="curtidas-piada">
                              <p class="reset-texto">${piada.ranking} curtida(s)</p>
                          </div>
                          
                      </div>
  
                  </div>
                          `;
                      }
                      else if(piada.tipo==1)
                      {
                          piadas+=`
                          <div class="piada-div" data-toggle="modal" onclick="marcarPraDeletar(${piada.id},'${piada.imgNome}')" data-target="#modal-deletar">
                      <div class="titulo-piada flex-div space-between">
                          <p>${piada.titulo}</p>
                          <p class="categoria-piada">${piada.categoria.nome}</p>
                      </div>  
                      <div class="texto-piada-div">
                          <div class="div-imagem">
                              <img class="imagem-piada" src="${piada.imagem}" alt="">
                          </div>
                          </div>
                      <div class="info-piada-div flex-div space-between">
                          <div class="autor-piada">
                              <p class="reset-texto">${piada.usuario.nome}</p>
                          </div>
                          <div class="curtidas-piada">
                              <p class="reset-texto">${piada.ranking} curtida(s)</p>
                          </div>
                          
                      </div>
                  </div>
                          `;
                      }
                 }
             body.innerHTML = piadas;
             }    
             )
      .catch(err => alert(err.message)) 
      loaderContainer.style.display = "none";
    content.style.pointerEvents = "auto";
  }
  
function nivelAcessoCat()
{
    const URL_TO_FETCH = '/cadastro/verificar-admin';
    fetch(URL_TO_FETCH, {method: 'get'})
    .then(response=> response.text())
    .then(result=>{     
        if(JSON.parse(result)==true)
            document.getElementById("botoes").innerHTML+=`<button class="btn-piadas" data-toggle="modal"  data-target="#modalCategoria">Cadastrar Categorias</button>`;


     })
    .catch(err=> console.error(err));
    
}




function ordenarPiadas(obj)
{
    return obj.sort(compare);
}

function compare(a,b) {
    if (a.ranking > b.ranking)
       return -1;
    if (a.ranking < b.ranking)
      return 1;
    return 0;
  }

function ordenarPorId(obj){
    return obj.sort(compare2);
}

function compare2(a,b) {
    if (a.id < b.id)
       return -1;
    if (a.id > b.id)
      return 1;
    return 0;
  }

function carregarPiadasRanking(callback)
{
    const url = 'apis/listar-todas-piadas';
    let count = 0;
    fetch(url, {method: 'get'})
    .then(response=>{ if(response.ok)
       return response.text()
        ; else throw Error("erro") })
        .then(result => {
           var piada;
           var body = document.getElementById("ListaPiadasRanking");
           var piadas="";
           var obj = ordenarPiadas(JSON.parse(result));
           for (piada of obj)
               {
                    count++;
                    if(piada.tipo==0 && count<=10)
                    {
                        piadas+=`
                        <div class="piada-div" onclick="marcarPraCurtida(${piada.id})" data-toggle="modal" data-target="#modal-curtir">
                    
                    <div class="titulo-piada flex-div space-between">
                        <p>${piada.titulo}</p>
                        <p class="categoria-piada">${piada.categoria.nome}</p>
                    </div>  
                
                    <div class="texto-piada-div">
                        <p class="reset-texto texto-piada">${piada.texto}</p>
                        <p class="resposta-piada">${piada.resposta}</p>
                    </div>
                    
                    <div class="info-piada-div flex-div space-between">
                        <div class="autor-piada">
                            <p class="reset-texto">${piada.usuario.nome}</p>
                        </div>
                        <div class="curtidas-piada">
                            <p class="reset-texto">${piada.ranking} curtida(s)</p>
                        </div>
                        
                    </div>

                </div>
                        `;
                    }
                    else if(piada.tipo==1 && count<=10)
                    {
                        piadas+=`
                        <div class="piada-div" data-toggle="modal" onclick="marcarPraCurtida(${piada.id})" data-target="#modal-curtir">
                    <div class="titulo-piada flex-div space-between">
                        <p>${piada.titulo}</p>
                        <p class="categoria-piada">${piada.categoria.nome}</p>
                    </div>  
                    <div class="texto-piada-div">
                        <div class="div-imagem">
                            <img class="imagem-piada" src="${piada.imagem}" alt="">
                        </div>
                        </div>
                    <div class="info-piada-div flex-div space-between">
                        <div class="autor-piada">
                            <p class="reset-texto">${piada.usuario.nome}</p>
                        </div>
                        <div class="curtidas-piada">
                            <p class="reset-texto">${piada.ranking} curtida(s)</p>
                        </div>
                        
                    </div>
                </div>
                        `;
                    }
               }
           body.innerHTML = piadas;
           }    
           )
    .catch(err => alert(err.message)) 
    if (callback) {
        callback();
    }
}


function adicionarCategoria()
{
    var cat = document.getElementById("catnome").value;

    const URL = `apis/cadastrar-categoria?CatNome=${cat}`;
   

    fetch(URL, {method: 'get'})
    .then(response=>{ if(response.ok) window.location.reload(); else throw Error("erro") })
    .catch(err => alert(err.message))   
}



function marcarPraDeletar(piada_id,piada_img)
{
    const URL_TO_FETCH = '/security/testar-login';
    fetch(URL_TO_FETCH, {method: 'post'})
    .then(response=> response.text())
    .then(result=>{  
        if(JSON.parse(result)==true)
            document.getElementById("deletar").setAttribute("onclick","deletar("+piada_id+",'"+piada_img+"')");
        else
            window.location.href = window.location.protocol + "//" + window.location.host;

     })
    .catch(err=> console.error(err));
    
}

