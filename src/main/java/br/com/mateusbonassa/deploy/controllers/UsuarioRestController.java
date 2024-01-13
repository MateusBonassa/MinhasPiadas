package br.com.mateusbonassa.deploy.controllers;

import java.util.HashMap;
import java.util.Map;

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
        Map<String, String> responseMap = new HashMap<>();
        int existe;
        String token="";
        try{
        
            existe = usuarioRepository.verificarExistencia(login);
            if(existe==0)
            {
                usuarioRepository.save(new Usuario(nomecompleto,login,senha,"user"));
                Long id = usuarioRepository.pegarCodigoUsuario(login);
                token = JWTTokenProvider.getToken(login, "user",id);
                
                responseMap.put("token", token);
                responseMap.put("mensagem", "");
                return new ResponseEntity<>(responseMap,HttpStatus.OK);
            }
            else{
                responseMap.put("mensagem", "Já existe usuario com o mesmo login");
                return new ResponseEntity<>(responseMap,HttpStatus.BAD_REQUEST);
            }
        }
        catch(Exception e){
            responseMap.put("mensagem", "Ocorreu um erro ao cadastrar, tente novamente!");
           return new ResponseEntity<>(responseMap,HttpStatus.BAD_REQUEST);
        }
       
    }

}
