package br.com.reservahub.service;

import br.com.reservahub.dto.SalaDto;
import br.com.reservahub.entity.Sala;
import br.com.reservahub.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalaService {

    @Autowired
    private SalaRepository salaRepository;

    public Sala criar(SalaDto dto) {

        Sala sala = new Sala();

        sala.setNome(dto.nome());
        sala.setDescricao(dto.descricao());
        sala.setStatus(dto.status());
        sala.setNomeSala(dto.nomeSala());
        sala.setCapacidade(dto.capacidade());

        return salaRepository.save(sala);
    }

    public List<Sala> listar() {
        return salaRepository.findAll();
    }

    public List<Sala> listarAtivas() {
        return salaRepository.findByStatusTrue();
    }

    /*
     * RETORNA Sala AO INVÉS DE Optional<Sala>
     * PARA COMPATIBILIDADE COM O CONTROLLER
     */
    public Sala buscarPorId(Integer id) {

        Optional<Sala> sala = salaRepository.findById(id);

        return sala.orElse(null);
    }

    public Sala buscarEntidade(Integer id) {

        Optional<Sala> sala = salaRepository.findById(id);

        return sala.orElse(null);
    }

    public Sala atualizar(Integer id, SalaDto dto) {

        Optional<Sala> salaExistente = salaRepository.findById(id);

        if (salaExistente.isPresent()) {

            Sala sala = salaExistente.get();

            sala.setNome(dto.nome());
            sala.setDescricao(dto.descricao());
            sala.setStatus(dto.status());
            sala.setNomeSala(dto.nomeSala());
            sala.setCapacidade(dto.capacidade());

            return salaRepository.save(sala);
        }

        return null;
    }

    public void deletar(Integer id) {
        salaRepository.deleteById(id);
    }
}