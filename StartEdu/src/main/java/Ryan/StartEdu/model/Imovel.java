package Ryan.StartEdu.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Imovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;
    private String numero;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @OneToMany(mappedBy = "imovel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ImagemImovel> imagens = new ArrayList<>();
    private String localizacao;
    private String preco;
    private Integer num_quartos;
    private Integer num_banheiros;
    private Boolean mobiliado;
    private Boolean status;
    @ManyToOne
    private Imobiliaria imobiliaria_id;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<ImagemImovel> getImagens() {
        return imagens;
    }

    public void setImagens(List<ImagemImovel> imagens) {
        this.imagens = imagens;
    }

    public void adicionarImagem(String url) {
        ImagemImovel imagem = new ImagemImovel();
        imagem.setUrl(url);
        imagem.setImovel(this);
        this.imagens.add(imagem);
    }

    public void removerImagem(ImagemImovel imagem) {
        this.imagens.remove(imagem);
        imagem.setImovel(null);
    }

    // Método de compatibilidade para manter código existente funcionando
    public String getImage() {
        if (imagens != null && !imagens.isEmpty()) {
            return imagens.get(0).getUrl();
        }
        return null;
    }

    public void setImage(String image) {
        if (image != null) {
            if (imagens.isEmpty()) {
                adicionarImagem(image);
            } else {
                imagens.get(0).setUrl(image);
            }
        }
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getPreco() {
        return preco;
    }

    public void setPreco(String preco) {
        this.preco = preco;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Integer getNum_quartos() {
        return num_quartos;
    }

    public void setNum_quartos(Integer num_quartos) {
        this.num_quartos = num_quartos;
    }

    public Integer getNum_banheiros() {
        return num_banheiros;
    }

    public void setNum_banheiros(Integer num_banheiros) {
        this.num_banheiros = num_banheiros;
    }

    public Boolean getMobiliado() {
        return mobiliado;
    }

    public void setMobiliado(Boolean mobiliado) {
        this.mobiliado = mobiliado;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Imobiliaria getImobiliaria_id() {
        return imobiliaria_id;
    }

    public void setImobiliaria_id(Imobiliaria imobiliaria_id) {
        this.imobiliaria_id = imobiliaria_id;
    }
}
