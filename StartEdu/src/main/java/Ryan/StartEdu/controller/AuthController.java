package Ryan.StartEdu.controller;

import Ryan.StartEdu.dto.AuthRequestDTO;
import Ryan.StartEdu.dto.AuthResponseDTO;
import Ryan.StartEdu.dto.RegisterRequestDTO;
import Ryan.StartEdu.dto.UpdateEmailRequestDTO;
import Ryan.StartEdu.model.Cadastro;
import Ryan.StartEdu.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {

        try{
            AuthResponseDTO authResponse = authService.registerUser(registerRequestDTO);
            System.out.println("User registered: " + registerRequestDTO.getNome());
            return ResponseEntity.ok(authResponse);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthRequestDTO authRequestDTO) {

        try{
            AuthResponseDTO authResponse = authService.loginUser(authRequestDTO);
            return ResponseEntity.ok(authResponse);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }

    }

    @PutMapping
    public ResponseEntity<Cadastro> atualizarCadastro(@RequestBody UpdateEmailRequestDTO updateEmailRequest){
        Cadastro cadastroNovo = authService.atualizarEmailCadastro(
            updateEmailRequest.getEmailAntigo(), 
            updateEmailRequest.getNovoEmail()
        );
        return ResponseEntity.ok(cadastroNovo);
    }



}
