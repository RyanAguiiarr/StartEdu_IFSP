package Ryan.StartEdu.service;

import Ryan.StartEdu.dto.ImovelRequestDTO;
import Ryan.StartEdu.dto.ImovelResponseDTO;
import Ryan.StartEdu.model.Imovel;
import Ryan.StartEdu.repository.ImovelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class ImovelService {

    private ImovelRepository imovelRepository;

    public ImovelService(ImovelRepository imovelRepository) {
        this.imovelRepository = imovelRepository;
    }

    public ImovelResponseDTO cadastrarImovel(ImovelRequestDTO imovelRequestDTO){
        Imovel imovel = new Imovel();
        imovel.setNome(imovelRequestDTO.getNome());
        imovel.setDescricao(imovelRequestDTO.getDescricao());
        imovel.setEndereco(imovelRequestDTO.getEndereco());
        imovel.setMobiliado(imovelRequestDTO.getMobiliado());
        imovel.setNum_banheiros(imovelRequestDTO.getNum_banheiros());
        imovel.setNum_quartos(imovelRequestDTO.getNum_quartos());
        imovel.setStatus(imovelRequestDTO.getStatus());
        imovel.setNumero(imovelRequestDTO.getNumero());

        var imovelNovo = imovelRepository.save(imovel);

        return new ImovelResponseDTO(imovelNovo);
    }

    public List<ImovelResponseDTO> buscarImoveis() {
        var imoveis = imovelRepository.findAll();
        return imoveis.stream()
                .map(imovel -> new ImovelResponseDTO(imovel))
                .toList();
    }
}
