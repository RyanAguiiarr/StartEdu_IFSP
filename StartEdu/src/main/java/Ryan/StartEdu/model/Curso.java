package Ryan.StartEdu.model;

import jakarta.persistence.*;

import java.util.List;
@Entity
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String sigla;
    @ManyToMany
    @JoinTable(
            name = "curso_turma",
            joinColumns = @JoinColumn(name = "curso_id"),
            inverseJoinColumns = @JoinColumn(name = "turma_id")
    )
    private List<Turma> turmas;

    @ManyToMany
    @JoinTable(
            name = "curso_campus",
            joinColumns = @JoinColumn(name = "curso_id"),
            inverseJoinColumns = @JoinColumn(name = "campus_id")
    )
    private List<Campus> campus_id;

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

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public List<Turma> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<Turma> turmas) {
        this.turmas = turmas;
    }

    public List<Campus> getCampus_id() {
        return campus_id;
    }

    public void setCampus_id(List<Campus> campus_id) {
        this.campus_id = campus_id;
    }
}
