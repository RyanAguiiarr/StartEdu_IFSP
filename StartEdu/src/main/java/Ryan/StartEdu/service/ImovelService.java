package Ryan.StartEdu.service;

import Ryan.StartEdu.config.FileStorageConfig;
import Ryan.StartEdu.dto.ImovelRequestDTO;
import Ryan.StartEdu.dto.ImovelResponseDTO;
import Ryan.StartEdu.model.ImagemImovel;
import Ryan.StartEdu.model.Imovel;
import Ryan.StartEdu.repository.ImovelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImovelService {

    private ImovelRepository imovelRepository;
    private FileStorageConfig fileStorageConfig;

    public ImovelService(ImovelRepository imovelRepository, FileStorageConfig fileStorageConfig) {
        this.imovelRepository = imovelRepository;
        this.fileStorageConfig = fileStorageConfig;
    }

    public ImovelResponseDTO cadastrarImovel(ImovelRequestDTO imovelRequestDTO, List<MultipartFile> imagens) throws IOException {
        Imovel imovel = new Imovel();
        imovel.setNome(imovelRequestDTO.getNome());
        imovel.setDescricao(imovelRequestDTO.getDescricao());
        imovel.setEndereco(imovelRequestDTO.getEndereco());
        imovel.setMobiliado(imovelRequestDTO.getMobiliado());
        imovel.setNum_banheiros(imovelRequestDTO.getNum_banheiros());
        imovel.setNum_quartos(imovelRequestDTO.getNum_quartos());
        imovel.setStatus(imovelRequestDTO.getStatus());
        imovel.setNumero(imovelRequestDTO.getNumero());
        imovel.setPreco(imovelRequestDTO.getPreco());
        imovel.setLocalizacao(imovelRequestDTO.getLocalizacao());

        Path uploadDir = fileStorageConfig.getUploadPath();
        Files.createDirectories(uploadDir);

        List<ImagemImovel> listaImagens = new ArrayList<>();
        if (imagens != null && !imagens.isEmpty()) {
            for (MultipartFile imagem : imagens) {
                String fileName = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
                Path filePath = uploadDir.resolve(fileName);
                Files.copy(imagem.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                ImagemImovel imagemImovel = new ImagemImovel();
                imagemImovel.setUrl(filePath.toString());
                imagemImovel.setImovel(imovel);
                listaImagens.add(imagemImovel);
            }
            imovel.setImagens(listaImagens);
        }

        var imovelNovo = imovelRepository.save(imovel);

        return new ImovelResponseDTO(imovelNovo);
    }

    public List<ImovelResponseDTO> buscarImoveis() {
        var imoveis = imovelRepository.findAll();
        return imoveis.stream()
                .map(imovel -> new ImovelResponseDTO(imovel))
                .toList();
    }

    public List<ImovelResponseDTO> buscarImovelPorNome(String name) {
        var imoveis = imovelRepository.findByNomeContaining(name);
        return imoveis.stream()
                .filter(imovel -> imovel.getNome() != null)
                .map(imovel -> new ImovelResponseDTO(imovel))
                .toList();
    }
}
