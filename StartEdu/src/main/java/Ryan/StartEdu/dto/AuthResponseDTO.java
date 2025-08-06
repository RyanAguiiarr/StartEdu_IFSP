package Ryan.StartEdu.dto;

public class AuthResponseDTO {
    private String token;
    private Number id;
    private String nome;
    private String email;


    public AuthResponseDTO(Number id, String token, String nome, String email) {
        this.id = id;
        this.token = token;
        this.nome = nome;
        this.email = email;
    }

    // Getter necessário para serialização JSON


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

    public Number getId() {
        return id;
    }

    public void setId(Number id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}