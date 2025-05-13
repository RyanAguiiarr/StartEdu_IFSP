package Ryan.StartEdu.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Imovel imovel_id;
    @ManyToOne
    private Imobiliaria imobiliaria_id;
    private Date data_publicacao;
    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Imovel getImovel_id() {
        return imovel_id;
    }

    public void setImovel_id(Imovel imovel_id) {
        this.imovel_id = imovel_id;
    }

    public Imobiliaria getImobiliaria_id() {
        return imobiliaria_id;
    }

    public void setImobiliaria_id(Imobiliaria imobiliaria_id) {
        this.imobiliaria_id = imobiliaria_id;
    }

    public Date getData_publicacao() {
        return data_publicacao;
    }

    public void setData_publicacao(Date data_publicacao) {
        this.data_publicacao = data_publicacao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
