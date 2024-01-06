package br.com.mateusbonassa.deploy.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.mateusbonassa.deploy.models.Usuario;
import br.com.mateusbonassa.deploy.others.tokenSave;
import br.com.mateusbonassa.deploy.repositories.UsuarioRepository;
import br.com.mateusbonassa.deploy.security.JWTTokenProvider;
import io.jsonwebtoken.Claims;



@RestController
@RequestMapping("/cadastro")
public class UsuarioRestController {
    @Autowired
    UsuarioRepository usuarioRepository;

    @GetMapping("/cad-usuario")
    public ResponseEntity<Object> cadastrarUsuario(String nomecompleto,String login,String senha)
    {
        
        int existe;
        String token="";
        try{
        
            existe = usuarioRepository.verificarExistencia(login);
            if(existe==0)
            {
                usuarioRepository.save(new Usuario(nomecompleto,login,senha,"user"));
                Long id = usuarioRepository.pegarCodigoUsuario(login);
                token = JWTTokenProvider.getToken(login, "user",id);
                tokenSave.token = token;
                return new ResponseEntity<>(token,HttpStatus.OK);
            }
            else
                return new ResponseEntity<>("Já existe usuario com o mesmo login",HttpStatus.NOT_ACCEPTABLE);
        }
        catch(Exception e){
           return new ResponseEntity<>("ERRO AO CADASTRAR",HttpStatus.NOT_ACCEPTABLE);
        }
       
    }

}
