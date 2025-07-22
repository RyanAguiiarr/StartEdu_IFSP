package Ryan.StartEdu.repository;

import Ryan.StartEdu.model.Interesse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InteresseRepository extends JpaRepository<Interesse, Long> {
    // Busca interesses por ID do aluno (propriedade: aluno.id)
    List<Interesse> findByAluno_Id(Long alunoId);

    // Busca interesses por ID do imóvel (propriedade: imovel.id)
    List<Interesse> findByImovel_Id(Long imovelId);
    
    // Método para verificar se aluno já manifestou interesse em um imóvel específico
    List<Interesse> findByAluno_IdAndImovel_Id(Long alunoId, Long imovelId);
}
