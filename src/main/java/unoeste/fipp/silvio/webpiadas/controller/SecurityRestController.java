package unoeste.fipp.silvio.webpiadas.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Claims;
import unoeste.fipp.silvio.webpiadas.models.Usuario;
import unoeste.fipp.silvio.webpiadas.others.tokenSave;
import unoeste.fipp.silvio.webpiadas.repositories.UsuarioRepository;
import unoeste.fipp.silvio.webpiadas.security.JWTTokenProvider;

@RestController
@RequestMapping("/security")
public class SecurityRestController {
@Autowired
UsuarioRepository usuarioRepository;

@PostMapping("/autenticar")
public ResponseEntity <Object> autenticar(String login, String senha)
{
    
    String token="";
    Usuario usu ;
    try{
        
        usu = usuarioRepository.encontrarUsuario(login,senha);
        
        token = JWTTokenProvider.getToken(login, usu.getNivel(),usu.getId());
        System.out.println(token);
        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(token);
        System.out.println(claim.get("nivel"));
        System.out.println(claim.getSubject());
        tokenSave.token = token;
        return new ResponseEntity<>(token,HttpStatus.OK);
    }
    catch(Exception e){
       return new ResponseEntity<>("ACESSO NAO PERMITIDO",HttpStatus.NOT_ACCEPTABLE);
    }
}

@PostMapping("/testar-login")
public ResponseEntity <Object> testarLogin()
{
    
    if(tokenSave.token != null && JWTTokenProvider.verifyToken(tokenSave.token))
    {
        return new ResponseEntity<>(true,HttpStatus.OK);
    }
    else
        return new ResponseEntity<>(false,HttpStatus.OK);
}
}