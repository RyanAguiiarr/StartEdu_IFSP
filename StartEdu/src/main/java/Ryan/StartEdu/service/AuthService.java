package Ryan.StartEdu.service;

import Ryan.StartEdu.dto.AuthRequestDTO;
import Ryan.StartEdu.dto.AuthResponseDTO;
import Ryan.StartEdu.dto.GoogleAuthRequestDTO;
import Ryan.StartEdu.dto.RegisterRequestDTO;
import Ryan.StartEdu.model.Cadastro;
import Ryan.StartEdu.model.Role;
import Ryan.StartEdu.repository.CadastroRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Random;

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

    public AuthResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) throws Exception {

            Cadastro cadastro = new Cadastro();
            cadastro.setNome(registerRequestDTO.getNome());
            var email = cadastroRepository.findByEmail(registerRequestDTO.getEmail());
            if(email.isPresent()){
                throw new Exception("Email atual já cadastrado.");
            }else{
                cadastro.setEmail(registerRequestDTO.getEmail());
            }
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

    public AuthResponseDTO loginWithGoogle(GoogleAuthRequestDTO request) throws Exception {
        try {
            // Verificar se usuário existe
            var cadastroExistente = cadastroRepository.findByEmail(request.getEmail());
            
            Cadastro cadastro;
            if (cadastroExistente.isEmpty()) {
                // Criar novo cadastro
                cadastro = new Cadastro();
                cadastro.setEmail(request.getEmail());
                cadastro.setNome(request.getNome());
                cadastro.setGoogleId(request.getGoogleId());
                cadastro.setFoto(request.getFoto());
                // Gerar uma senha aleatória para usuários do Google
                String randomPassword = generateRandomPassword();
                cadastro.setSenha(passwordEncoder.encode(randomPassword));
                cadastro.setRole(Role.ALUNO); // Valor padrão para usuários do Google
                
                cadastro = cadastroRepository.save(cadastro);
            } else {
                cadastro = cadastroExistente.get();
                // Atualizar informações do Google se necessário
                cadastro.setGoogleId(request.getGoogleId());
                if (request.getFoto() != null) {
                    cadastro.setFoto(request.getFoto());
                }
                cadastro = cadastroRepository.save(cadastro);
            }
            
            // Gerar token JWT
            String token = jwtService.generateToken(cadastro);
            
            return new AuthResponseDTO(cadastro.getId(), token);
            
        } catch (Exception e) {
            throw new Exception("Erro na autenticação com Google: " + e.getMessage());
        }
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
