package Ryan.StartEdu.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;

public class AuthRequestDTO {

    @Email
    @Column(unique = true)
    private String email;
    private String senha;

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
}
