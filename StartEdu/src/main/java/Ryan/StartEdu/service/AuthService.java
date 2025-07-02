package Ryan.StartEdu.service;

import Ryan.StartEdu.dto.AuthRequestDTO;
import Ryan.StartEdu.dto.AuthResponseDTO;
import Ryan.StartEdu.dto.RegisterRequestDTO;
import Ryan.StartEdu.model.Cadastro;
import Ryan.StartEdu.model.Role;
import Ryan.StartEdu.repository.CadastroRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private CadastroRepository cadastroRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;

    public AuthService(CadastroRepository cadastroRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.cadastroRepository = cadastroRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) {
        Cadastro cadastro = new Cadastro();
        cadastro.setNome(registerRequestDTO.getNome());
        cadastro.setEmail(registerRequestDTO.getEmail());
        cadastro.setSenha(passwordEncoder.encode(registerRequestDTO.getSenha()));

        // Define um valor padrão se for nulo
        if (registerRequestDTO.getTipoUsuario() == null) {
            cadastro.setRole(Role.ALUNO);
        } else {
            cadastro.setRole(registerRequestDTO.getTipoUsuario());
        }

        Cadastro cadastroUser = cadastroRepository.save(cadastro);

        String token = jwtService.generateToken(cadastro);
        return new AuthResponseDTO(cadastroUser.getId(), token);
    }

    public AuthResponseDTO loginUser(AuthRequestDTO authRequestDTO) {
        Cadastro cadastro = cadastroRepository.findByEmail(authRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(authRequestDTO.getSenha(), cadastro.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        String token = jwtService.generateToken(cadastro);
        return new AuthResponseDTO(cadastro.getId(), token);

    }

    public Cadastro atualizarEmailCadastro(String email, String novoEmail) {
        Cadastro cadastro = cadastroRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        cadastro.setEmail(novoEmail);
        return cadastroRepository.save(cadastro);
    }
}
