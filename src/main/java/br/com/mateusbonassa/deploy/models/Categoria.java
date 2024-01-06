package br.com.mateusbonassa.deploy.models;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



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
