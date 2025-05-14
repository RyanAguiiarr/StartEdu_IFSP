package Ryan.StartEdu.dto;

import Ryan.StartEdu.model.Imobiliaria;
import Ryan.StartEdu.model.Imovel;
import jakarta.persistence.ManyToOne;

public class ImovelResponseDTO {

    private Long id;
    private String nome;
    private String endereco;
    private String numero;
    private String descricao;
    private Number num_quartos;
    private Number num_banheiros;
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

    public String getNumero() {
        return numero;
    }

    public String getDescricao() {
        return descricao;
    }

    public Number getNum_quartos() {
        return num_quartos;
    }

    public Number getNum_banheiros() {
        return num_banheiros;
    }

    public Boolean getMobiliado() {
        return mobiliado;
    }

    public Boolean getStatus() {
        return status;
    }
}
