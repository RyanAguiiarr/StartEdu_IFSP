package Ryan.StartEdu.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Entity
public class Interesse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    @NotNull(message = "o campo aluno é obrigatório")
    private Aluno aluno; // Em vez de aluno_id
    @ManyToOne
    @NotNull(message = "o campo Imovel é obrigatório")
    private Imovel imovel_id;
    @Column(nullable = false)
    private String mensagem;
    @Column(nullable = false)
    private Date data_interesse;
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

    public Imovel getImovel_id() {
        return imovel_id;
    }

    public void setImovel_id(Imovel imovel_id) {
        this.imovel_id = imovel_id;
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
