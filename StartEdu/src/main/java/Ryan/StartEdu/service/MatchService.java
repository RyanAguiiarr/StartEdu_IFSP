package Ryan.StartEdu.service;

import Ryan.StartEdu.model.Aluno;
import Ryan.StartEdu.model.Interesse;
import Ryan.StartEdu.model.Match;
import Ryan.StartEdu.repository.InteresseRepository;
import Ryan.StartEdu.repository.MatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatchService {

    private MatchRepository matchRepository;
    private InteresseRepository interesseRepository;

    public MatchService(MatchRepository matchRepository, InteresseRepository interesseRepository) {
        this.matchRepository = matchRepository;
        this.interesseRepository = interesseRepository;
    }

    public List<Match> listarMatchsDoAluno(Long id) throws Exception{

        try{
            List<Match> matchsAluno = matchRepository.findByAlunoMatchId(id);
            if(matchsAluno.isEmpty()){
                throw new Exception("aluno nao possui matchs");
            }

            return matchsAluno;
        }catch (Exception ex){
            throw new Exception("erro ao buscar matchs de aluno" + ex);
        }


    }

    public Match alterarMatch(Long match_id, String statusNovo) throws Exception{


        try{
            Optional<Match> matchAlter = matchRepository.findById(match_id);

            if(matchAlter.isEmpty()){
                throw new Exception("imovel com id " + match_id + "nao encontrado");
            }

            matchAlter.get().setStatus(statusNovo);

            matchRepository.save(matchAlter.get());

            return matchAlter.get();



        }catch (Exception ex){
            throw new Exception("erro ao alterar match");
        }
    }

}
