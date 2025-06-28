package Ryan.StartEdu.controller;

import Ryan.StartEdu.model.Interesse;
import Ryan.StartEdu.service.InteresseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/interesse")
public class InteresseController {

    private InteresseService interesseService;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ImovelController.class);

    public InteresseController(InteresseService interesseService) {
        this.interesseService = interesseService;
    }

    @PostMapping
    public ResponseEntity<Interesse> cadastrarInteresse(@RequestBody Interesse interesse){
        try{
           Interesse novoInteresse = interesseService.cadastrarInteresse(interesse);
            if (novoInteresse != null) {
                Map<String, Object> logData = new HashMap<>();
                logData.put("event", "CADASTRO_INTERESSE");
                logData.put("interesseId", novoInteresse.getId());
                logger.info("Interesse cadastrado com sucesso: {}", logData);
                return ResponseEntity.ok(novoInteresse);
            } else {
                logger.error("Interesse nao cadastrado: {}", novoInteresse);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
