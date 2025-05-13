package Ryan.StartEdu.model;

import jakarta.persistence.*;

@Entity
public class Imovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;
    private String numero;
    private Number num_quartos;
    private Number num_banheiros;
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

    public void setNome(String nome) {
        this.nome = nome;
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

    public Number getNum_quartos() {
        return num_quartos;
    }

    public void setNum_quartos(Number num_quartos) {
        this.num_quartos = num_quartos;
    }

    public Number getNum_banheiros() {
        return num_banheiros;
    }

    public void setNum_banheiros(Number num_banheiros) {
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
