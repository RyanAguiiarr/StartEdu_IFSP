package Ryan.StartEdu.service;

import Ryan.StartEdu.model.Aluno;
import Ryan.StartEdu.model.Imovel;
import Ryan.StartEdu.model.Interesse;
import Ryan.StartEdu.repository.AlunoRepository;
import Ryan.StartEdu.repository.ImovelRepository;
import Ryan.StartEdu.repository.InteresseRepository;
import org.springframework.stereotype.Service;

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
}
