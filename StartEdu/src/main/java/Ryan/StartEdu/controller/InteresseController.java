package Ryan.StartEdu.controller;

import Ryan.StartEdu.model.ApiResponse;
import Ryan.StartEdu.model.Interesse;
import Ryan.StartEdu.service.InteresseService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/interesse")
public class InteresseController {

    private InteresseService interesseService;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ImovelController.class);

    public InteresseController(InteresseService interesseService) {
        this.interesseService = interesseService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrarInteresse(@Valid @RequestBody Interesse interesse){
        try{
           Interesse novoInteresse = interesseService.cadastrarInteresse(interesse);
            if (novoInteresse != null) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "CADASTRO_INTERESSE");
                logData.put("interesseId", novoInteresse.getId());
                logger.info("Interesse cadastrado com sucesso: {}", logData);
                return ResponseEntity.ok(new ApiResponse<>(true, "Interesse cadastrado", novoInteresse));
            } else {
                logger.error("Interesse nao cadastrado: {}", novoInteresse);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodosInteresses(){

        try {
            List<Interesse> interesses = interesseService.listarTodosInteresses();
            if (interesses != null) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "LISTAR_INTERESSES");
                logger.info("Interesse retornando com sucesso: {}", logData);
                return ResponseEntity.ok(new ApiResponse<>(true, "Interesses listados com sucesso", interesses));
            } else {
                logger.error("Interesses nao encontrados: {}", interesses);
                return ResponseEntity.notFound().build();
            }
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{aluno_id}")
    public ResponseEntity<?> listarInteressesPorAluno(@PathVariable long aluno_id){
        try{
            List<Interesse> interesses = interesseService.interessesPorAluno(aluno_id);

            if (interesses != null) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "LISTAR_INTERESSES_POR_ALUNO");
                logger.info("Interesses retornando com sucesso: {}", logData);
                return ResponseEntity.ok(new ApiResponse<>(true, "Interesses listados com sucesso", interesses));
            } else {
                logger.error("Interesses nao encontrados: {}", interesses);
                return ResponseEntity.notFound().build();
            }
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }

    @DeleteMapping("/{interesse_id}")
    public ResponseEntity<?> deletarInteressePorId(@PathVariable long interesse_id){
        try{
            Optional<Interesse> interesseDeletado = interesseService.deletarInteressePorId(interesse_id);

            if (interesseDeletado != null) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "DELETAR_INTESSSE");
                logger.info("Interesses deletado com sucesso: {}", logData);
                return ResponseEntity.ok(new ApiResponse<>(true, "Interesse deletado com sucesso", interesseDeletado));
            } else {
                logger.error("Interesse nao deletado: {}", interesseDeletado);
                return ResponseEntity.notFound().build();
            }
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }
}
