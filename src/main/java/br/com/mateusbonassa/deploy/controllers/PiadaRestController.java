package br.com.mateusbonassa.deploy.controllers;


import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import br.com.mateusbonassa.deploy.models.Categoria;
import br.com.mateusbonassa.deploy.models.Piada;
import br.com.mateusbonassa.deploy.models.Usuario;
import br.com.mateusbonassa.deploy.others.FileSaver;
import br.com.mateusbonassa.deploy.others.tokenSave;
import br.com.mateusbonassa.deploy.repositories.PiadaRepository;
import br.com.mateusbonassa.deploy.security.JWTTokenProvider;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/apis")
public class PiadaRestController {
    
    @Autowired
    PiadaRepository piadaRepository; 
    @Autowired
    HttpServletRequest request;


    @GetMapping("/listar-todas-piadas")
    public ResponseEntity <Object> buscarTodas()
    {   
        List<Piada> piadas = piadaRepository.buscaOrdenada();
        return new ResponseEntity<>(piadas,HttpStatus.OK);
    }

    @GetMapping("/busca-filtrada")
    public ResponseEntity <Object> buscaFiltrada(String filtro)
    {   
        filtro = "%"+filtro+"%";
        List<Piada> piadas = piadaRepository.buscaPorFiltro(filtro);
        return new ResponseEntity<>(piadas,HttpStatus.OK);
    }
    @GetMapping("/busca-piada-usuario")
    public ResponseEntity <Object> buscaPiadaUsuario(String token)
    {   
        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(token);
        System.out.println(Integer.parseInt(claim.get("id").toString()));
        int id = Integer.parseInt(claim.get("id").toString());
        System.out.println(id);
        List<Piada> piadas = piadaRepository.buscaPorCodigo(id);
        return new ResponseEntity<>(piadas,HttpStatus.OK);
    }

    @GetMapping("/cadastrar-piada")
    public ResponseEntity<Object> cadastrarPiada(String titulo,String texto,String keywords,int categoria,String CatNome,String resposta,String token)
    {
       
        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(token);
        Long id = Long.parseLong(claim.get("id").toString());

        try{
            piadaRepository.save(new Piada(titulo,texto,keywords,0,resposta,0,new Categoria(new Long(categoria),CatNome),new Usuario(id),""));
            return new ResponseEntity<>("",HttpStatus.OK);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>("Não foi possivel efetuar o cadastro",HttpStatus.BAD_REQUEST);
        }
        
    }


    @PostMapping("/cadastrar-piada-img")
    public ResponseEntity<Object>  cadastrarPiadaImg(@RequestParam("imagem") String  imagem,@RequestParam("titulo2") String titulo,@RequestParam("texto2") String texto,@RequestParam("keywords2") String keywords,@RequestParam("categoriaImg") int categoria,@RequestParam("token") String token,@RequestParam("imgNome")String imgNome)
    {
        imagem = imagem.replace("[object File],", "");

        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(token);
        Long id = Long.parseLong(claim.get("id").toString());
       
        /*FileSaver filesaver = new FileSaver();  
        
        String path = filesaver.write(imagem,id,titulo);*/

       piadaRepository.save(new Piada(titulo,texto,keywords,0,imagem,1,new Categoria(new Long(categoria),""),new Usuario(id),imgNome));

         return ResponseEntity.ok().build();
        
        
        
    }

    @GetMapping("/dar-curtida")
    public ResponseEntity<Object> darCurtida(int id)
    {
       
            
            piadaRepository.curtir(id);
            return new ResponseEntity<>("",HttpStatus.OK);
    
       
    }

    @GetMapping("/deletar-piada")
    public ResponseEntity<Object> deletar(Long Id)
    {
         
            Piada piada = piadaRepository.buscarPorId(Id);

            piadaRepository.delete(piada);
            return new ResponseEntity<>("",HttpStatus.OK);
           
    }


/* 
    @PostMapping( value={"/cadastrar-piada-img"},consumes ={MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object>  cadastrarPiadaImg(@RequestParam("imagem") MultipartFile  imagem,@RequestParam("titulo2") String titulo,@RequestParam("texto2") String texto,@RequestParam("keywords2") String keywords,@RequestParam("categoriaImg") int categoria,@RequestParam("token") String token)
    {
        System.out.println("Token na img  "+token);
        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(token);
        Long id = Long.parseLong(claim.get("id").toString());
       
        FileSaver filesaver = new FileSaver();
     
        String path = filesaver.write(imagem,id,titulo);
   
        
            piadaRepository.save(new Piada(titulo,texto,keywords,0,path,1,new Categoria(new Long(categoria),""),new Usuario(id)));
            
            return ResponseEntity.ok().build();
        
        
        
    }*/
}
  



