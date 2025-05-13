package Ryan.StartEdu.dto;

public class AuthResponseDTO {
    private String token;

    // Construtor padrão necessário para Jackson
    public AuthResponseDTO() {
    }

    public AuthResponseDTO(String token) {
        this.token = token;
    }

    // Getter necessário para serialização JSON
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}