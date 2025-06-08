package Ryan.StartEdu.service;

import Ryan.StartEdu.config.FileStorageConfig;
import Ryan.StartEdu.repository.AlunoRepository;
import org.springframework.stereotype.Service;

@Service
public class AlunoService {

    private AlunoRepository alunoRepository;
    private FileStorageConfig fileStorageConfig;

    public AlunoService(AlunoRepository alunoRepository, FileStorageConfig fileStorageConfig) {
        this.alunoRepository = alunoRepository;
        this.fileStorageConfig = fileStorageConfig;
    }


}
