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
    @Column(nullable = true)
    private String dataNascimento;
    private String sexo;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "imagem_id")
    private ImagemAluno image;
    @ManyToMany
    @JoinTable(
            name = "aluno_curso",
            joinColumns = @JoinColumn(name = "aluno_id"),
            inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
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

    public ImagemAluno getImage() {
        return image;
    }

    public void setImage(ImagemAluno image) {
        this.image = image;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }


    public Cadastro getCadastro_id() {
        return cadastro_id;
    }

    public void setCadastro_id(Cadastro cadastro_id) {
        this.cadastro_id = cadastro_id;
    }
}
