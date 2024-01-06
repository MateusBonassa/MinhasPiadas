package unoeste.fipp.silvio.webpiadas.models;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="categoria")
public class Categoria implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="cat_id")
    private Long id;

    @Column(name="cat_nome")
    private String nome;
    
    public Categoria() {
    }
    public Categoria(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    
    public Categoria(String nome) {
        this.nome = nome;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }    
    
}
