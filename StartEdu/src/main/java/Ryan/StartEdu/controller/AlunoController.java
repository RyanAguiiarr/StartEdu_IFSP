package Ryan.StartEdu.controller;

import Ryan.StartEdu.config.FileStorageConfig;
import Ryan.StartEdu.model.Aluno;
import Ryan.StartEdu.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
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

    @GetMapping
    public ResponseEntity<Aluno> RetornarDadosAluno(@RequestParam String email){
        try{
            Aluno aluno = alunoService.retornarDadosAluno(email);
            if (aluno != null) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "RETRIEVAL_ALUNO");
                logData.put("alunoId", aluno.getId());
                logger.info("Dados do aluno recuperados com sucesso: {}", logData);
                return ResponseEntity.ok(aluno);
            } else {
                logger.error("Aluno não encontrado com o email: {}", email);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Erro ao recuperar dados do aluno: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Aluno> CadastrarAluno(@Valid @ModelAttribute Aluno aluno, @RequestParam(value = "imagen", required = false) MultipartFile foto){
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

    @PutMapping
    public ResponseEntity<Aluno> AtualizarAluno(@Valid @ModelAttribute Aluno aluno, @RequestParam(value = "imagen", required = false) MultipartFile foto){
        try{
            if(foto == null || foto.isEmpty()){
                logger.error("Nenhuma imagem foi enviada para o aluno: {}", aluno.getNome());
            }
            Aluno alunoAtualizado = alunoService.atualizarAluno(aluno, foto);

            Map<String, Object> logData = new HashMap<>();
            logData.put("event", "ATUALIZAÇÃO_ALUNO");
            logData.put("alunoId", alunoAtualizado.getId());
            if (alunoAtualizado != null) {
                logger.info("Aluno atualizado com sucesso: {}", logData);
            } else {
                logger.error("Erro ao atualizar aluno: {}", logData);
            }
            return ResponseEntity.ok(alunoAtualizado);
        } catch (Exception e) {
            logger.error("Erro ao atualizar aluno: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String filename) {
        try {
            Path filePath;
            try {
                filePath = fileStorageConfig.getUploadPath().resolve(filename).normalize();
            } catch (java.io.IOException ioException) {
                logger.error("Erro ao obter o caminho do upload: {}", ioException.getMessage());
                return ResponseEntity.badRequest().build();
            }
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

}
