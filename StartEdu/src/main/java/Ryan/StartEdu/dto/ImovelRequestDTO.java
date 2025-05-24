package Ryan.StartEdu.dto;

import Ryan.StartEdu.model.ImagemImovel;
import Ryan.StartEdu.model.Imobiliaria;
import Ryan.StartEdu.model.Interesse;
import jakarta.persistence.ManyToOne;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ImovelRequestDTO {

    private String nome;
    private String endereco;
    private String numero;
    private String descricao;
    private List<MultipartFile> imagens;
    private String localizacao;
    private String preco;
    private Integer num_quartos;
    private Integer num_banheiros;
    private Boolean mobiliado;
    private Boolean status;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<MultipartFile> getImagens() {
        return imagens;
    }

    public void setImagens(List<MultipartFile> imagens) {
        this.imagens = imagens;
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
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
}
