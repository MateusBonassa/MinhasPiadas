package unoeste.fipp.silvio.webpiadas.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unoeste.fipp.silvio.webpiadas.models.Categoria;
import unoeste.fipp.silvio.webpiadas.repositories.CategoriaRepository;



@RestController
@RequestMapping("/apis")
public class CategoriaRestController {

    @Autowired
    CategoriaRepository categoriaRepository;

    @Autowired
    HttpServletRequest request;
    
    @GetMapping("/listar-categorias")
    public ResponseEntity <Object> buscarTodos()
    {
        List <Categoria> cats = categoriaRepository.findAll();

        return new ResponseEntity<>(cats,HttpStatus.CREATED);
    }
    @PostMapping("/testar-acesso")
    public ResponseEntity <Object> testarAcesso()
    {
        return new ResponseEntity<>("Piada",HttpStatus.CREATED);
    }


    @GetMapping("/cadastrar-categoria")
    public ResponseEntity<Object> cadastrarCategoria(String CatNome)
    {
        //System.out.println(titulo+texto+keywords+categoria+CatNome+token);
        //System.out.println(id);
        try{
            
            categoriaRepository.save(new Categoria(CatNome));
            return new ResponseEntity<>("",HttpStatus.OK);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>("Não foi possivel efetuar o cadastro",HttpStatus.BAD_REQUEST);
        }
        
    }
   
}
