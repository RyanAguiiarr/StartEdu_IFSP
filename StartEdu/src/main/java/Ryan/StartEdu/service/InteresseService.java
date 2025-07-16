package Ryan.StartEdu.service;

import Ryan.StartEdu.model.Aluno;
import Ryan.StartEdu.model.ApiResponse;
import Ryan.StartEdu.model.Imovel;
import Ryan.StartEdu.model.Interesse;
import Ryan.StartEdu.repository.AlunoRepository;
import Ryan.StartEdu.repository.ImovelRepository;
import Ryan.StartEdu.repository.InteresseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InteresseService {

    private AlunoRepository alunoRepository;
    private ImovelRepository imovelRepository;
    private InteresseRepository interesseRepository;


    public InteresseService(InteresseRepository interesseRepository,
                            AlunoRepository alunoRepository,
                            ImovelRepository imovelRepository) {
        this.interesseRepository = interesseRepository;
        this.alunoRepository = alunoRepository;
        this.imovelRepository = imovelRepository;
    }

    public Interesse cadastrarInteresse(Interesse interesse) throws Exception {
        try {
            // Carregar entidades completas
            Aluno aluno = alunoRepository.findById(interesse.getAluno().getId())
                    .orElseThrow(() -> new Exception("Aluno não encontrado"));

            Imovel imovel = imovelRepository.findById(interesse.getImovel_id().getId())
                    .orElseThrow(() -> new Exception("Imóvel não encontrado"));

            interesse.setAluno(aluno);
            interesse.setImovel_id(imovel);

            return interesseRepository.save(interesse);
        } catch (Exception e) {
            System.out.println("erro ao cadastrar interesse: " + e.getMessage());
            throw new Exception("erro ao cadastrar novo interesse");
        }
    }

    public List<Interesse> listarTodosInteresses() throws Exception{

        try{
            List interesses = new ArrayList();
            interesses = alunoRepository.findAll();
            if(interesses.size() == 0){
                throw new Exception("nenhum interesse encontrado");
            }
            return interesses;
        }catch (Exception ex){
            throw new Exception("erro ao buscar interesses");
        }

    }

    public List<Interesse> interessesPorAluno(Long alunoId) throws Exception{

        try{
            //recuperer aluno
            Optional<Aluno> aluno = alunoRepository.findById(alunoId);
            if(aluno.isEmpty()){
                throw new Exception("aluno com id: " +alunoId + " não encontrado");
            }

            //recuperar interesses deste aluno
            List<Interesse> interesses = interesseRepository.findByaluno_id(alunoId);

            if(interesses.size() < 1 ){
                throw new Exception("nenhum interesse encontrado.");
            }

            return interesses;

        }catch (Exception ex){
            throw new Exception("erro ao buscar interesses deste aluno.");
        }
    }

}
