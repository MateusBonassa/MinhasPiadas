package unoeste.fipp.silvio.webpiadas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import unoeste.fipp.silvio.webpiadas.models.Piada;

public interface PiadaRepository extends JpaRepository<Piada,Long>{
    @Query(value="select * from piada  where usu_cod = (:filtro) order by pi_ranking desc",nativeQuery=true)
    public List<Piada> buscaPorCodigo(@Param("filtro")int filtro);
    @Query(value="select * from piada  where pi_keywords like ?1 order by pi_ranking desc",nativeQuery=true)
    public List<Piada> buscaPorFiltro(String filtro);
    @Modifying
    @Transactional(readOnly = false)
    @Query(value="update piada set pi_ranking = pi_ranking+1 where pi_id=(:id)",nativeQuery=true)
    public void curtir(@Param("id") int id);

    @Query(value="select * from piada order by pi_ranking desc",nativeQuery=true)
    public List<Piada> buscaOrdenada();

    @Query(value="select * from piada where pi_id = (:id)",nativeQuery=true)
    public Piada buscarPorId(@Param("id")Long id);
   
}
