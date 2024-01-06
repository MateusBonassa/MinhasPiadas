package unoeste.fipp.silvio.webpiadas.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import io.jsonwebtoken.Claims;
import unoeste.fipp.silvio.webpiadas.models.Categoria;
import unoeste.fipp.silvio.webpiadas.models.Piada;
import unoeste.fipp.silvio.webpiadas.models.Usuario;
import unoeste.fipp.silvio.webpiadas.others.FileSaver;
import unoeste.fipp.silvio.webpiadas.others.tokenSave;
import unoeste.fipp.silvio.webpiadas.repositories.PiadaRepository;
import unoeste.fipp.silvio.webpiadas.security.JWTTokenProvider;

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
    public ResponseEntity <Object> buscaPiadaUsuario()
    {   
        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(tokenSave.token);
        int id = Integer.parseInt(claim.get("id").toString());
        System.out.println(id);
        List<Piada> piadas = piadaRepository.buscaPorCodigo(id);
        return new ResponseEntity<>(piadas,HttpStatus.OK);
    }

    @GetMapping("/cadastrar-piada")
    public ResponseEntity<Object> cadastrarPiada(String titulo,String texto,String keywords,int categoria,String CatNome,String resposta)
    {
        String token = tokenSave.token;
        //System.out.println(titulo+texto+keywords+categoria+CatNome+token);
        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(token);
        Long id = Long.parseLong(claim.get("id").toString());
        //System.out.println(id);
        try{
            piadaRepository.save(new Piada(titulo,texto,keywords,0,resposta,0,new Categoria(new Long(categoria),CatNome),new Usuario(id)));
            return new ResponseEntity<>("",HttpStatus.OK);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>("Não foi possivel efetuar o cadastro",HttpStatus.BAD_REQUEST);
        }
        
    }

    @RequestMapping(value = "/cadastrar-piada-img", method = RequestMethod.POST)
    public RedirectView cadastrarPiadaImg(@RequestParam("imagem") MultipartFile  imagem,@RequestParam("titulo2") String titulo,@RequestParam("texto2") String texto,@RequestParam("keywords2") String keywords,@RequestParam("categoriaImg") int categoria)
    {
        String token = tokenSave.token;
        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(token);
        Long id = Long.parseLong(claim.get("id").toString());
        //System.out.println(titulo+texto+keywords+categoria);
        FileSaver filesaver = new FileSaver();
        //System.out.println(nome+" LOG");
        String path = filesaver.write(imagem,id,titulo);
        //System.out.println(path);
        
        
            piadaRepository.save(new Piada(titulo,texto,keywords,0,path,1,new Categoria(new Long(categoria),""),new Usuario(id)));
            
            
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl("http://localhost:8080/cad_piada.html");
            return redirectView;
        
        
        
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

}
  



