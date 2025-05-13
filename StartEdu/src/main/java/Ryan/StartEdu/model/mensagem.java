package Ryan.StartEdu.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "chat_id")
    private Chat chat; // Em vez de chat_id
    @ManyToOne
    private Aluno aluno_id;
    private String conteudo;
    private Date data_envio;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat_id) {
        this.chat = chat_id;
    }

    public Aluno getAluno_id() {
        return aluno_id;
    }

    public void setAluno_id(Aluno aluno_id) {
        this.aluno_id = aluno_id;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public Date getData_envio() {
        return data_envio;
    }

    public void setData_envio(Date data_envio) {
        this.data_envio = data_envio;
    }
}
