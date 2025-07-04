package Ryan.StartEdu.controller;

import Ryan.StartEdu.dto.AuthRequestDTO;
import Ryan.StartEdu.dto.AuthResponseDTO;
import Ryan.StartEdu.dto.RegisterRequestDTO;
import Ryan.StartEdu.dto.UpdateEmailRequestDTO;
import Ryan.StartEdu.model.Cadastro;
import Ryan.StartEdu.service.AuthService;
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
    public ResponseEntity<AuthResponseDTO> registerUser(@RequestBody RegisterRequestDTO registerRequestDTO) {
        AuthResponseDTO authResponse = authService.registerUser(registerRequestDTO);
        System.out.println("User registered: " + registerRequestDTO.getNome());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponseDTO> loginUser(@RequestBody AuthRequestDTO authRequestDTO) {
        AuthResponseDTO authResponse = authService.loginUser(authRequestDTO);
        return ResponseEntity.ok(authResponse);
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
