package Ryan.StartEdu.dto;

import Ryan.StartEdu.model.Aluno;

public class AlunoResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String telefone;

    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.email = aluno.getEmail();
        this.telefone = aluno.getTelefone();
    }
}
