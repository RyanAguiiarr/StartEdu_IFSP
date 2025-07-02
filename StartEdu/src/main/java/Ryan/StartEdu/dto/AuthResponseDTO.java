package Ryan.StartEdu.dto;

public class AuthResponseDTO {
    private String token;
    private Number id;


    public AuthResponseDTO(Number id, String token) {
        this.id = id;
        this.token = token;
    }

    // Getter necessário para serialização JSON


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