package Ryan.StartEdu.dto;

public class UpdateEmailRequestDTO {
    private String emailAntigo;
    private String novoEmail;

    public UpdateEmailRequestDTO() {}

    public UpdateEmailRequestDTO(String emailAntigo, String novoEmail) {
        this.emailAntigo = emailAntigo;
        this.novoEmail = novoEmail;
    }

    public String getEmailAntigo() {
        return emailAntigo;
    }

    public void setEmailAntigo(String emailAntigo) {
        this.emailAntigo = emailAntigo;
    }

    public String getNovoEmail() {
        return novoEmail;
    }

    public void setNovoEmail(String novoEmail) {
        this.novoEmail = novoEmail;
    }
}
