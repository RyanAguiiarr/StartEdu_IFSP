package Ryan.StartEdu.model;

import jakarta.persistence.*;

@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;
    @OneToOne
    private Interesse interesse_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Interesse getInteresse_id() {
        return interesse_id;
    }

    public void setInteresse_id(Interesse interesse_id) {
        this.interesse_id = interesse_id;
    }
}
