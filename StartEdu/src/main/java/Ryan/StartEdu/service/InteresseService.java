package Ryan.StartEdu.service;

import Ryan.StartEdu.model.*;
import Ryan.StartEdu.repository.AlunoRepository;
import Ryan.StartEdu.repository.ImovelRepository;
import Ryan.StartEdu.repository.InteresseRepository;
import Ryan.StartEdu.repository.MatchRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InteresseService {

    private AlunoRepository alunoRepository;
    private ImovelRepository imovelRepository;
    private InteresseRepository interesseRepository;
    private MatchRepository matchRepository;


    public InteresseService(InteresseRepository interesseRepository,
                            AlunoRepository alunoRepository,
                            ImovelRepository imovelRepository,
                            MatchRepository matchRepository) {
        this.interesseRepository = interesseRepository;
        this.alunoRepository = alunoRepository;
        this.imovelRepository = imovelRepository;
        this.matchRepository = matchRepository;
    }

    public Interesse cadastrarInteresse(Interesse interesse) throws Exception {
        try {
            // Validações básicas
            if (interesse == null) {
                throw new Exception("Dados do interesse não podem ser nulos");
            }
            
            if (interesse.getAluno() == null || interesse.getAluno().getId() == null) {
                throw new Exception("ID do aluno não pode ser nulo");
            }
            
            if (interesse.getImovel() == null || interesse.getImovel().getId() == null) {
                throw new Exception("ID do imóvel não pode ser nulo");
            }

            System.out.println("=== CADASTRANDO INTERESSE ===");
            System.out.println("Aluno ID: " + interesse.getAluno().getId());
            System.out.println("Imóvel ID: " + interesse.getImovel().getId());
            System.out.println("Mensagem: " + interesse.getMensagem());
            System.out.println("Status: " + interesse.getStatus());

            // Carregar entidades completas
            Aluno aluno = alunoRepository.findById(interesse.getAluno().getId())
                    .orElseThrow(() -> new Exception("Aluno não encontrado com ID: " + interesse.getAluno().getId()));

            Imovel imovel = imovelRepository.findById(interesse.getImovel().getId())
                    .orElseThrow(() -> new Exception("Imóvel não encontrado com ID: " + interesse.getImovel().getId()));

            System.out.println("Aluno encontrado: " + aluno.getNome());
            System.out.println("Imóvel encontrado: " + imovel.getNome());

            // Verificar se o aluno já manifestou interesse neste imóvel
            List<Interesse> interesseExistente = interesseRepository.findByAluno_IdAndImovel_Id(
                    aluno.getId(), imovel.getId());
            
            if (!interesseExistente.isEmpty()) {
                throw new Exception("Aluno já manifestou interesse neste imóvel");
            }

            // Criar novo interesse com dados completos
            Interesse novoInteresse = new Interesse();
            novoInteresse.setAluno(aluno);
            novoInteresse.setImovel(imovel);
            novoInteresse.setMensagem(interesse.getMensagem());
            novoInteresse.setData_interesse(interesse.getData_interesse());
            novoInteresse.setStatus(interesse.getStatus());

            System.out.println("Salvando interesse...");

            // Salvar o interesse primeiro
            Interesse interesseSalvo = interesseRepository.save(novoInteresse);
            
            System.out.println("Interesse salvo com ID: " + interesseSalvo.getId());

            // Buscar todos os interesses deste imóvel (incluindo o recém-criado)
            List<Interesse> interessesDesseImovel = interesseRepository.findByImovel_Id(imovel.getId());

            System.out.println("Total de interesses para este imóvel: " + interessesDesseImovel.size());

            // Só cria match se houver mais de um interesse (pelo menos 2 pessoas interessadas)
            if(interessesDesseImovel.size() > 1){
                System.out.println("Criando match...");
                
                List<Aluno> alunosDosInteresses = new ArrayList<>();
                for(Interesse interesse_item : interessesDesseImovel){
                    alunosDosInteresses.add(interesse_item.getAluno());
                }

                System.out.println("Alunos no match: " + alunosDosInteresses);

                Match novoMatch = new Match();
                novoMatch.setAlunoMatch(alunosDosInteresses);
                novoMatch.setImovelMatch(imovel);
                novoMatch.setDataMatch(new Date());
                novoMatch.setStatus("NOVO");

                matchRepository.save(novoMatch);
                
                System.out.println("Match criado com sucesso!");
            }

            return interesseSalvo;
            
        } catch (Exception e) {
            System.out.println("Erro ao cadastrar interesse: " + e.getMessage());
            e.printStackTrace(); // Para debug
            throw new Exception("Erro ao cadastrar novo interesse: " + e.getMessage());
        }
    }

    public List<Interesse> listarTodosInteresses() throws Exception{
        try{
            List<Interesse> interesses = interesseRepository.findAll();
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
            
            //recuperar aluno
            Optional<Aluno> aluno = alunoRepository.findById(alunoId);
            if(aluno.isEmpty()){
                throw new Exception("aluno com id: " +alunoId + " não encontrado");
            }


            //recuperar interesses deste aluno
            List<Interesse> interesses = interesseRepository.findByAluno_Id(alunoId);


            // Não lance exceção se não houver interesses, apenas retorne lista vazia
            return interesses;

        }catch (Exception ex){
            ex.printStackTrace();
            throw new Exception("erro ao buscar interesses deste aluno: " + ex.getMessage());
        }
    }

    public Optional<Interesse> deletarInteressePorId(Long id) throws Exception{

        try{
            Optional<Interesse> interesseDeletado = interesseRepository.findById(id);
            if(interesseDeletado.isEmpty()){
                throw new Exception("Nenhum interesse a ser deletado");
            }

            interesseRepository.deleteById(id);

            return interesseDeletado;
        }catch (Exception ex){
            throw new Exception("Erro ao deletar interesse");
        }
    }

    public List<Interesse> verificaMatch(Long imovel_id) throws Exception{
        try{
            List<Interesse> interessesDesseImovel = interesseRepository.findByImovel_Id(imovel_id);

            if(interessesDesseImovel.isEmpty()){
                throw new Exception("Nenhum interesse para este imovel");
            }

            return interessesDesseImovel;

        }catch (Exception ex){
            throw new Exception("erro ao procurar interesses neste imovel");
        }
    }

}
