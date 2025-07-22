package Ryan.StartEdu.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "`match`")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "match_aluno",
            joinColumns = @JoinColumn(name = "match_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id")
    )
    private List<Aluno> alunoMatch;

    @ManyToOne
    @NotNull(message = "o campo Imovel é obrigatório")
    private Imovel imovelMatch;

    @Column(nullable = false)
    private Date dataMatch;

    @Column(nullable = false)
    private String status;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Aluno> getAlunoMatch() {
        return alunoMatch;
    }

    public void setAlunoMatch(List<Aluno> alunoMatch) {
        this.alunoMatch = alunoMatch;
    }

    public Imovel getImovelMatch() {
        return imovelMatch;
    }

    public void setImovelMatch(Imovel imovelMatch) {
        this.imovelMatch = imovelMatch;
    }

    public Date getDataMatch() {
        return dataMatch;
    }

    public void setDataMatch(Date dataMatch) {
        this.dataMatch = dataMatch;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
