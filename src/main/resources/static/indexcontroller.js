
function logar() {
    const URL_TO_FETCH = '/security/autenticar';
    const data = new URLSearchParams();
    for (const pair of new FormData(document.getElementById('fdados'))) {
     data.append(pair[0], pair[1]);
    }
    
    fetch(URL_TO_FETCH, {method: 'post', body: data })
     .then(response=>{ if(response.ok) window.location.href = "home.html"; else throw Error("Usuário não Encontrado!") })
     .then(text => { localStorage.setItem("token", text);})
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
        
        fetch(URL_TO_FETCH, {method: 'GET'})
        .then(response=>{ if(response.ok) window.location.href = "http://localhost:8080/home.html"; else throw Error("erro") })
        .then(text => {alert(text); window.localStorage.setItem("token", text);})
        .catch(err => alert(err.message)) 
    }
}


function adicionarPiada()
{
    var titulo = document.getElementById("titulo").value;
    var texto = document.getElementById("texto").value;
    var keywords = document.getElementById("keywords").value;
    var cat_id = document.getElementById("categoriaResp").value;
    var cat_nome = document.getElementById(cat_id).innerHTML;
    var resposta = document.getElementById("resposta").value;
    console.log(titulo+texto+keywords+cat_id+cat_nome);

    const URL = `apis/cadastrar-piada?titulo=${titulo}&&texto=${texto}&&keywords=${keywords}&&categoria=${cat_id}&&CatNome=${cat_nome}&&resposta=${resposta}`;
   
    if(validarDadosCadPiada()){
        fetch(URL, {method: 'get'})
        .then(response=>{ if(response.ok) window.location.reload(); else throw Error("erro") })
        .catch(err => alert(err.message)) 
    }
}

function adicionarPiadaImg()
{
    const URL_TO_FETCH = '/apis/cadastrar-piada-img';
    const data = new URLSearchParams();
    for (const pair of new FormData(document.getElementById('cadPiadaImg'))) {
     data.append(pair[0], pair[1]);
    }
    if(validarDadosCadPiadaImg()){
        fetch(URL_TO_FETCH, {method: 'post', body: data })
        .then(response=>{ if(response.ok) alert("Sucesso"); else throw Error("erro") })
        .catch(err => alert(err.message)) 
    }
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
    fetch(URL_TO_FETCH, {method: 'post'})
    .then(response=> response.text())
    .then(result=>{  
        if(JSON.parse(result)==true)
            window.location.href = "http://localhost:8080/cad_piada.html";
        else
            window.location.href = "http://localhost:8080";
    
    })
    .catch(err=> console.error(err));

}


function carregarPiadas()
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
        //auxPonteiro=1;
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

    if(resposta.value.length < 5) 
    {  resposta.value = "";
        resposta.setAttribute('placeholder','Tamanho minímo de 4 caracteres!');
        resposta.style.border = "solid 1px red";
        
        correto = false;
        resposta.focus();
    }
    else 
    {
        resposta.style.border = "none";
    }


    return correto;
  }


  function validarDadosCadPiadaImg() {

    var titulo2 = document.getElementById("titulo2");
    var texto2 = document.getElementById("texto2");
    var keywords2 = document.getElementById("keywords2");
    var correto=true;
    
    if(titulo2.value.length < 5) 
    {  titulo2.value = "";
        titulo2.setAttribute('placeholder','Escreva um título maior!');
        titulo2.style.border = "solid 1px red";
        
        correto = false;
        titulo2.focus();
    }
    else 
    {
        titulo2.style.border = "none";
    }

    if(texto2.value.length < 1) 
    {  texto2.value = "";
        texto2.setAttribute('placeholder','Tamanho minímo de 5 caracteres!');
        texto2.style.border = "solid 1px red";
        //auxPonteiro=1;
        correto = false;
        texto2.focus();
    }
    else 
    {
        texto2.style.border = "none";
    }


    if(keywords2.value.length < 4) 
    {  keywords2.value = "";
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
 

  function carregarPiadasUsuario()
  {
      
      const url = 'apis/busca-piada-usuario';
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
                          <div class="piada-div" onclick="marcarPraDeletar(${piada.id})" data-toggle="modal" data-target="#modal-deletar">
                      
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
                          <div class="piada-div" data-toggle="modal" onclick="marcarPraDeletar(${piada.id})" data-target="#modal-deletar">
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
  
function nivelAcessoCat()
{
    const URL_TO_FETCH = '/cadastro/verificar-admin';
    console.log("entrou");
    fetch(URL_TO_FETCH, {method: 'get'})
    .then(response=> response.text())
    .then(result=>{     
        console.log(JSON.parse(result));
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

function carregarPiadasRanking()
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
   
}


function adicionarCategoria()
{
    var cat = document.getElementById("catnome").value;
    console.log(cat);

    const URL = `apis/cadastrar-categoria?CatNome=${cat}`;
   

    fetch(URL, {method: 'get'})
    .then(response=>{ if(response.ok) window.location.reload(); else throw Error("erro") })
    .catch(err => alert(err.message))   
}



function marcarPraDeletar(piada_id)
{
    const URL_TO_FETCH = '/security/testar-login';
    fetch(URL_TO_FETCH, {method: 'post'})
    .then(response=> response.text())
    .then(result=>{  
        if(JSON.parse(result)==true)
            document.getElementById("deletar").setAttribute("onclick","deletar("+piada_id+")");
        else
            window.location.href = "http://localhost:8080";

     })
    .catch(err=> console.error(err));
    
}

function deletar(Id){
    const URL_TO_FETCH = '/apis/deletar-piada?Id='+Id;
    console.log(Id);
    fetch(URL_TO_FETCH, {method: 'get'})
     .then(response=>{ if(response.ok) window.location.reload();  else throw Error("erro") })
     .catch(err => alert(err.message)) 
}
