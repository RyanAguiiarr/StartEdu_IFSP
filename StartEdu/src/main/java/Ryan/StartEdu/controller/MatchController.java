package Ryan.StartEdu.controller;

import Ryan.StartEdu.model.ApiResponse;
import Ryan.StartEdu.model.Interesse;
import Ryan.StartEdu.model.Match;
import Ryan.StartEdu.service.MatchService;
import ch.qos.logback.classic.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/match")
public class MatchController {

    private MatchService matchService;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(InteresseController.class);

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/{id}")
    private ResponseEntity<?> listarMatchsPorAluno(@PathVariable long id){
        try{

            List<Match> matchsAluno = matchService.listarMatchsDoAluno(id);

            if (matchsAluno != null && !matchsAluno.isEmpty()) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "LISTAR_MATCHS_POR_ALUNO");
                logData.put("alunoId", id);
                logData.put("quantidadeInteresses", matchsAluno.size());

                logger.info("matchs retornados com sucesso: {}", logData);
                return ResponseEntity.ok(new ApiResponse<>(true, "matchs listados com sucesso", matchsAluno));
            } else {
                logger.warn("Nenhum match encontrado para aluno ID: {}", id);
                return ResponseEntity.ok(new ApiResponse<>(true, "Nenhum matc encontrado", java.util.Collections.emptyList()));
            }
        }catch (Exception ex){
            ex.printStackTrace();
            logger.error("Erro ao buscar matchs para aluno {}: {}", id, ex.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Erro interno: " + ex.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    private ResponseEntity<?> alterarMatch(@PathVariable long id, @RequestBody Map<String, Object> request){
        try{
            String statusNovo = (String) request.get("status");
            System.out.println("=== CONTROLLER: Alterando match ID: " + id + " para status: " + statusNovo + " ===");

            Match matchAlter = matchService.alterarMatch(id, statusNovo);

            if (matchAlter != null) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "ALTERAR_MATCH");
                logData.put("matchId", id);

                logger.info("match retornados com sucesso: {}", logData);
                return ResponseEntity.ok(new ApiResponse<>(true, "match alterado com sucesso", matchAlter));
            } else {
                logger.warn("Nenhum match encontrado para o ID: {}", id);
                return ResponseEntity.ok(new ApiResponse<>(true, "Nenhum match encontrado", java.util.Collections.emptyList()));
            }
        }catch (Exception ex){
            ex.printStackTrace();
            logger.error("Erro ao alterar match com id {}", ex.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Erro interno: " + ex.getMessage(), null));
        }
    }
}
