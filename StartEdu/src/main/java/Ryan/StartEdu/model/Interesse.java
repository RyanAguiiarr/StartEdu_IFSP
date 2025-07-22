package Ryan.StartEdu.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;

@Entity
@Table(name = "interesse")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Interesse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id")
    @NotNull(message = "o campo aluno é obrigatório")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Aluno aluno;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "imovel_id", referencedColumnName = "id")
    @NotNull(message = "o campo Imovel é obrigatório")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Imovel imovel;
    
    @Column(name = "mensagem", nullable = false)
    private String mensagem;
    
    @Column(name = "data_interesse", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date data_interesse;
    
    @Column(name = "status", nullable = false)
    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno_id) {
        this.aluno = aluno_id;
    }

    public Imovel getImovel() {
        return imovel;
    }

    public void setImovel(Imovel imovel) {
        this.imovel = imovel;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Date getData_interesse() {
        return data_interesse;
    }

    public void setData_interesse(Date data_interesse) {
        this.data_interesse = data_interesse;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
