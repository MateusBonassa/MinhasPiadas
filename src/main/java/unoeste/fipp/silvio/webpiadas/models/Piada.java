package unoeste.fipp.silvio.webpiadas.models;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="piada")
public class Piada implements Serializable
{
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="pi_id")
    private Long id;
    
    @Column(name="pi_titulo")
    private String titulo;
    
    @Column(name="pi_texto")
    private String texto;

    @Column(name="pi_keywords")
    private String keywords;

    @Column(name="pi_ranking")
    private int ranking;
    @Column(name="pi_resposta")
    private String resposta;
    @Column(name="pi_img")
    private String imagem;
    @Column(name="pi_tipo")
    private int tipo;
    @ManyToOne
    @JoinColumn(name="cat_id", nullable=false)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name="usu_cod", nullable=false)
    private Usuario usuario;
    public Piada() {
    }

    

    public int getTipo() {
        return tipo;
    }



    public void setTipo(int tipo) {
        this.tipo = tipo;
    }



    public String getResposta() {
        return resposta;
    }



    public void setResposta(String resposta) {
        this.resposta = resposta;
    }



    public String getImagem() {
        return imagem;
    }



    public void setImagem(String imagem) {
        this.imagem = imagem;
    }



    public Usuario getUsuario() {
        return usuario;
    }



    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }



    public Piada(Long id, String titulo, String texto, String keywords, int ranking, String imgResp, int tipo,
            Categoria categoria, Usuario usuario) {
        this.id = id;
        this.titulo = titulo;
        this.texto = texto;
        this.keywords = keywords;
        this.ranking = ranking;
        if(tipo==0)
                this.resposta = imgResp;
        else
            this.imagem = imgResp;
        this.tipo = tipo;
        this.categoria = categoria;
        this.usuario = usuario;
    }
    public Piada( String titulo, String texto, String keywords, int ranking, String imgResp, int tipo,
    Categoria categoria, Usuario usuario) {

        this.titulo = titulo;
        this.texto = texto;
        this.keywords = keywords;
        this.ranking = ranking;
        if(tipo==0)
                this.resposta = imgResp;
        else
            this.imagem = imgResp;
        this.tipo = tipo;
        this.categoria = categoria;
        this.usuario = usuario;
        }


    



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public int getRanking() {
        return ranking;
    }

    public void setRanking(int ranking) {
        this.ranking = ranking;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
    

    
}