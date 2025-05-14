package Ryan.StartEdu.controller;

import Ryan.StartEdu.dto.ImovelRequestDTO;
import Ryan.StartEdu.dto.ImovelResponseDTO;
import Ryan.StartEdu.service.ImovelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/imovel")
public class ImovelController {

    private ImovelService imovelService;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ImovelController.class);

    public ImovelController(ImovelService imovelService) {
        this.imovelService = imovelService;
    }

    @PostMapping
    public ResponseEntity<ImovelResponseDTO> cadastrarImovel(@RequestBody ImovelRequestDTO imovelRequestDTO) {
        ImovelResponseDTO imovelResponseDTO = imovelService.cadastrarImovel(imovelRequestDTO);

        Map<String, Object> logData = new HashMap<>();
        logData.put("event", "CRIAÇÃO_IMOVEL");
        logData.put("imovelId", imovelResponseDTO.getId());
        if(imovelResponseDTO != null) {
            logger.info("Imóvel cadastrado com sucesso: {}", logData);
        }
        else {
            logger.error("Erro ao cadastrar imóvel: {}", logData);
        }
        return ResponseEntity.ok(imovelResponseDTO);
    }

    // rota para buscar todos os imóveis
    @GetMapping
    public ResponseEntity<List<ImovelResponseDTO>> buscarImoveis() {
        List<ImovelResponseDTO> imoveis = imovelService.buscarImoveis();

        Map<String, Object> logData = new HashMap<>();
        logData.put("event", "BUSCA_IMOVEIS");
        if(imoveis != null) {
            logger.info("Imoveis cadastrados: {}", logData);
        }
        else {
            logger.error("Nenhum imovel cadastrado: {}", logData);
        }
        return ResponseEntity.ok(imoveis);
    }
}
