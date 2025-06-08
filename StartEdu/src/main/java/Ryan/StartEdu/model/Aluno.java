package Ryan.StartEdu.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import java.util.Date;
import java.util.List;

@Entity
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    @Column(unique = true)
    private String cpf;
    @Email
    private String email;
    private String telefone;
    private Date dataNascimento;
    private String sexo;
    private String image;
    @ManyToMany
    @JoinTable(
            name = "aluno_curso",
            joinColumns = @JoinColumn(name = "aluno_id"),
            inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private List<Curso> curso_id;
    @OneToOne
    private Cadastro cadastro_id;

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

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(Date dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public List<Curso> getCurso_id() {
        return curso_id;
    }

    public void setCurso_id(List<Curso> curso_id) {
        this.curso_id = curso_id;
    }

    public Cadastro getCadastro_id() {
        return cadastro_id;
    }

    public void setCadastro_id(Cadastro cadastro_id) {
        this.cadastro_id = cadastro_id;
    }
}
