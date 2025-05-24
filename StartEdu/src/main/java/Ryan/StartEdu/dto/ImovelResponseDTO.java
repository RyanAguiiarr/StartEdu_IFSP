package Ryan.StartEdu.dto;

import Ryan.StartEdu.model.ImagemImovel;
import Ryan.StartEdu.model.Imobiliaria;
import Ryan.StartEdu.model.Imovel;
import jakarta.persistence.ManyToOne;

import java.util.List;

public class ImovelResponseDTO {

    private Long id;
    private String nome;
    private String endereco;
    private String numero;
    private String descricao;
    private List<String> imagens;
    private String localizacao;
    private String preco;
    private Integer num_quartos;
    private Integer num_banheiros;
    private Boolean mobiliado;
    private Boolean status;

    public ImovelResponseDTO(Imovel imovel) {
        this.id = imovel.getId();
        this.nome = imovel.getNome();
        this.endereco = imovel.getEndereco();
        this.descricao = imovel.getDescricao();
        this.numero = imovel.getNumero();
        this.num_quartos = imovel.getNum_quartos();
        this.num_banheiros = imovel.getNum_banheiros();
        this.mobiliado = imovel.getMobiliado();
        this.status = imovel.getStatus();
        this.imagens = imovel.getImagens().stream()
                .map(ImagemImovel::getUrl)
                .toList();
        this.localizacao = imovel.getLocalizacao();
        this.preco = imovel.getPreco();
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public List<String> getImagens() {
        return imagens;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public String getPreco() {
        return preco;
    }

    public String getNumero() {
        return numero;
    }

    public String getDescricao() {
        return descricao;
    }

    public Integer getNum_quartos() {
        return num_quartos;
    }

    public Integer getNum_banheiros() {
        return num_banheiros;
    }

    public Boolean getMobiliado() {
        return mobiliado;
    }

    public Boolean getStatus() {
        return status;
    }
}
