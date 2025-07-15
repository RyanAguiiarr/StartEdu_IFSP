package Ryan.StartEdu.dto;

import Ryan.StartEdu.model.Role;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;

public class RegisterRequestDTO {

    private String nome;
    @Email
    @Column(unique = true)
    private String email;
    private String senha;
    private Role tipoUsuario;


    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Role getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(Role tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }
}
