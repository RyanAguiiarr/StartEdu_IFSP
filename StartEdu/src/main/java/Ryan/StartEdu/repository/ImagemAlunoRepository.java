package Ryan.StartEdu.repository;

import Ryan.StartEdu.model.ImagemAluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagemAlunoRepository extends JpaRepository<ImagemAluno, Long> {

}
