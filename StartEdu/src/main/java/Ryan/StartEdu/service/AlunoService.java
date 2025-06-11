package Ryan.StartEdu.service;

import Ryan.StartEdu.config.FileStorageConfig;
import Ryan.StartEdu.model.Aluno;
import Ryan.StartEdu.model.ImagemAluno;
import Ryan.StartEdu.repository.AlunoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class AlunoService {

    private AlunoRepository alunoRepository;
    private FileStorageConfig fileStorageConfig;

    public AlunoService(AlunoRepository alunoRepository, FileStorageConfig fileStorageConfig) {
        this.alunoRepository = alunoRepository;
        this.fileStorageConfig = fileStorageConfig;
    }

    public Aluno CadastrarAluno(Aluno aluno, MultipartFile foto){
        Aluno alunoNovo = new Aluno();
        alunoNovo.setNome(aluno.getNome());
        alunoNovo.setCpf(aluno.getCpf());
        alunoNovo.setEmail(aluno.getEmail());
        alunoNovo.setTelefone(aluno.getTelefone());
        alunoNovo.setSexo(aluno.getSexo());
        alunoNovo.setDataNascimento(aluno.getDataNascimento());


        if (foto != null && !foto.isEmpty()) {
            try {
                // Inicialize o objeto image primeiro
                ImagemAluno imagemAluno = new ImagemAluno();
                alunoNovo.setImage(imagemAluno);

                Path uploadDir = fileStorageConfig.getUploadPath();
                Files.createDirectories(uploadDir);

                String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
                Path filePath = uploadDir.resolve(fileName);
                Files.copy(foto.getInputStream(), filePath);

                // Agora é seguro definir a URL
                imagemAluno.setUrl(filePath.toString());


            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Erro ao criar diretório para upload de arquivos", e);
            }
        }

        alunoRepository.save(alunoNovo);

        return alunoNovo;
    }


}
