package unoeste.fipp.silvio.webpiadas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;




import unoeste.fipp.silvio.webpiadas.models.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria,Long>{

    @Query(value="SELECT * FROM categoria c WHERE c.cat_nome LIKE :filter%",nativeQuery=true)
    public List<Categoria> findAllWithFilter(@Param("filter") String filter);
}
