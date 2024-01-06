package unoeste.fipp.silvio.webpiadas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Claims;
import unoeste.fipp.silvio.webpiadas.models.Usuario;
import unoeste.fipp.silvio.webpiadas.others.tokenSave;
import unoeste.fipp.silvio.webpiadas.repositories.UsuarioRepository;
import unoeste.fipp.silvio.webpiadas.security.JWTTokenProvider;

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
    @GetMapping("/verificar-admin")
    public ResponseEntity<Object> verificarAdmin()
    {

        Claims claim =  JWTTokenProvider.getAllClaimsFromToken(tokenSave.token);

        if(claim.get("nivel").equals("adm"))
        {
             return new ResponseEntity<>(true,HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(false,HttpStatus.OK);
    }
}
