package Ryan.StartEdu.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @Bean
    public Path getUploadPath() throws IOException {
        Path path = Paths.get(uploadDir).toAbsolutePath().normalize();

        // Cria diretório se não existir
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        return path;
    }
}
