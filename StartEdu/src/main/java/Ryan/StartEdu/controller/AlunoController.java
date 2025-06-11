package Ryan.StartEdu.controller;

import Ryan.StartEdu.config.FileStorageConfig;
import Ryan.StartEdu.model.Aluno;
import Ryan.StartEdu.service.AlunoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/aluno")
public class AlunoController {

    private FileStorageConfig fileStorageConfig;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ImovelController.class);
    private AlunoService alunoService;

    public AlunoController(AlunoService alunoService, FileStorageConfig fileStorageConfig) {
        this.alunoService = alunoService;
        this.fileStorageConfig = fileStorageConfig;
    }

    @PostMapping
    public ResponseEntity<Aluno> CadastrarAluno(@ModelAttribute Aluno aluno, @RequestParam(value = "imagen", required = false) MultipartFile foto){
        try{
               if(foto == null || foto.isEmpty()){
                     logger.error("Nenhuma imagem foi enviada para o aluno: {}", aluno.getNome());
               }
            Aluno alunoSalvo = alunoService.CadastrarAluno(aluno, foto);

            Map<String, Object> logData = new HashMap<>();
            logData.put("event", "CRIAÇÃO_ALUNO");
            logData.put("alunoId", alunoSalvo.getId());
            if (alunoSalvo != null) {
                logger.info("Aluno cadastrado com sucesso: {}", logData);
            } else {
                logger.error("Erro ao cadastrar aluno: {}", logData);
            }
            return ResponseEntity.ok(alunoSalvo);
        } catch (Exception e) {
            logger.error("Erro ao cadastrar aluno: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
