package Ryan.StartEdu.repository;

import Ryan.StartEdu.model.Interesse;
import Ryan.StartEdu.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    @Query("SELECT m FROM Match m JOIN m.alunoMatch a WHERE a.id = :alunoId")
    List<Match> findByAlunoMatchId(@Param("alunoId") Long alunoId);
}
