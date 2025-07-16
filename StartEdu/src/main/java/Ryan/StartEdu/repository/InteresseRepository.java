package Ryan.StartEdu.repository;

import Ryan.StartEdu.model.Imovel;
import Ryan.StartEdu.model.Interesse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InteresseRepository extends JpaRepository<Interesse, Long> {
    List<Interesse> findByaluno_id(Long aluno_id);
}
