package Ryan.StartEdu.repository;

import Ryan.StartEdu.model.Anuncio;
import Ryan.StartEdu.model.Cadastro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CadastroRepository extends JpaRepository<Cadastro, Long> {
    Optional<Cadastro> findByEmail(String email);
}