package unoeste.fipp.silvio.webpiadas.models;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Entity;
@Entity
@Table(name="usuario")
public class Usuario implements Serializable{
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="usu_cod")
    private Long id;
    @Column(name="usu_nome")
    private String nome;
    @Column(name="usu_email")
    private String email;
    @Column(name="usu_senha")
    private String senha;

    @Column(name="usu_nivel")
    private String nivel;

    public Usuario(){}
    public String getNivel() {
        return nivel;
    }
    public void setNivel(String nivel) {
        this.nivel = nivel;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public Usuario(Long id) {
        this.id = id;
    }
    public Usuario( String nome, String email,String senha,String nivel) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.nivel = nivel;
        System.out.println(email+senha);
    }
    public Usuario(Long id, String nome, String email,String senha,String nivel) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.nivel = nivel;
        System.out.println(email+senha);
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
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

}
