package Ryan.StartEdu.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String periodo_letivo;

    @ManyToMany
    @JoinTable(
            name = "turma_alunos",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "alunos_id")
    )
    private List<Aluno> alunos;

    @ManyToMany
    @JoinTable(
            name = "turma_campus",  // Renomeie para evitar confusão com "_id"
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "campus_id")
    )
    private List<Campus> campus_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriodo_letivo() {
        return periodo_letivo;
    }

    public void setPeriodo_letivo(String periodo_letivo) {
        this.periodo_letivo = periodo_letivo;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }

    public List<Campus> getCampus_id() {
        return campus_id;
    }

    public void setCampus_id(List<Campus> campus_id) {
        this.campus_id = campus_id;
    }
}
