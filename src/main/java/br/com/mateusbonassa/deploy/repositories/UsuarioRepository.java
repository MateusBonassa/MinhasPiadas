package br.com.mateusbonassa.deploy.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.mateusbonassa.deploy.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario,Long>{
    @Query(value="SELECT * FROM usuario u WHERE u.usu_email=(:Uemail) and u.usu_senha=(:Usenha)",nativeQuery=true)
    public Usuario encontrarUsuario(@Param("Uemail") String email,@Param("Usenha") String senha);

    @Query(value="SELECT count(*) from usuario u WHERE u.usu_email=(:Uemail)",nativeQuery=true)
    public int verificarExistencia(@Param("Uemail") String email);
    @Query(value="SELECT u.usu_cod from usuario u WHERE u.usu_email=(:Uemail)",nativeQuery=true)
    public Long pegarCodigoUsuario(@Param("Uemail") String email);
}
 