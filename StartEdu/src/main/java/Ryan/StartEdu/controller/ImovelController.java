package Ryan.StartEdu.controller;

import Ryan.StartEdu.config.FileStorageConfig;
import Ryan.StartEdu.dto.ImovelRequestDTO;
import Ryan.StartEdu.dto.ImovelResponseDTO;
import Ryan.StartEdu.model.Imovel;
import Ryan.StartEdu.service.ImovelService;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/imovel")
public class ImovelController {

    private ImovelService imovelService;
    private FileStorageConfig fileStorageConfig;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ImovelController.class);

    @Autowired
    public ImovelController(ImovelService imovelService, FileStorageConfig fileStorageConfig) {
        this.imovelService = imovelService;
        this.fileStorageConfig = fileStorageConfig;
    }

    @PostMapping
    public ResponseEntity<ImovelResponseDTO> cadastrarImovel(@ModelAttribute ImovelRequestDTO imovelRequestDTO, @RequestParam(value = "imagens", required = false) List<MultipartFile> imagens) {


        try {
            if (imagens == null || imagens.isEmpty()) {
                logger.error("Nenhuma imagem foi enviada para o imóvel: {}", imovelRequestDTO.getNome());
            }

            ImovelResponseDTO imovelSalvo = imovelService.cadastrarImovel(imovelRequestDTO, imagens);

            Map<String, Object> logData = new HashMap<>();
            logData.put("event", "CRIAÇÃO_IMOVEL");
            logData.put("imovelId", imovelSalvo.getId());
            if (imovelSalvo != null) {
                logger.info("Imóvel cadastrado com sucesso: {}", logData);
            } else {
                logger.error("Erro ao cadastrar imóvel: {}", logData);
            }
            return ResponseEntity.ok(imovelSalvo);
        } catch (Exception e) {
            logger.error("Erro ao cadastrar imóvel: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }


        // rota para buscar todos os imóveis
        @GetMapping
        public ResponseEntity<List<ImovelResponseDTO>> buscarImoveis () {
            List<ImovelResponseDTO> imoveis = imovelService.buscarImoveis();

            Map<String, Object> logData = new HashMap<>();
            logData.put("event", "BUSCA_IMOVEIS");
            if (imoveis != null) {
                logger.info("Imoveis cadastrados: {}", logData);
            } else {
                logger.error("Nenhum imovel cadastrado: {}", logData);
            }
            return ResponseEntity.ok(imoveis);
        }

        @GetMapping("/{nome}")
        public ResponseEntity<List<ImovelResponseDTO>> buscarIMovelPorNome (@PathVariable String nome){
            List<ImovelResponseDTO> imovelResponseDTO = imovelService.buscarImovelPorNome(nome);

            Map<String, Object> logData = new HashMap<>();
            logData.put("event", "BUSCA_IMOVEL_POR_ID");
            logData.put("imovelName", nome);
            if (imovelResponseDTO != null) {
                logger.info("Imóvel encontrado: {}", logData);
            } else {
                logger.error("Imóvel não encontrado: {}", logData);
            }
            return ResponseEntity.ok(imovelResponseDTO);
        }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = fileStorageConfig.getUploadPath().resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            Map<String, Object> logData = new HashMap<>();
            logData.put("event", "SERVER_FILE");
            logData.put("imagemFile", filename);

            if (resource.exists() || resource.isReadable()) {
                logger.info("Imagem encontrada: {}", logData);

                // Detectar o Content-Type da imagem
                String contentType = null;
                try {
                    contentType = Files.probeContentType(file);
                } catch (IOException e) {
                    logger.warn("Não foi possível determinar o tipo de conteúdo: {}", e.getMessage());
                }

                // Se não conseguir determinar, use um tipo padrão baseado na extensão
                if (contentType == null) {
                    if (filename.toLowerCase().endsWith(".png")) {
                        contentType = "image/png";
                    } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                        contentType = "image/jpeg";
                    } else {
                        contentType = "application/octet-stream";
                    }
                }

                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                logger.error("Arquivo de imagem não encontrado: {}", logData);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Erro ao acessar arquivo: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    }

