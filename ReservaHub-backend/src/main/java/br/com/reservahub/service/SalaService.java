package br.com.reservahub.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.reservahub.dto.SalaDto;
import br.com.reservahub.entity.Sala;
import br.com.reservahub.exception.ResourceNotFoundException;
import br.com.reservahub.repository.SalaRepository;

@SuppressWarnings("null")
@Service
public class SalaService {

    private final SalaRepository salaRepository;

    public SalaService(SalaRepository salaRepository) {

    }

    public List<SalaDto> listar() {

    }

    public List<SalaDto> listarAtivas() {

    }

    public SalaDto buscarPorId(Integer id) {

    }

    @Transactional
    public SalaDto criar(SalaDto dto) {

    }

    @Transactional
    public SalaDto atualizar(Integer id, SalaDto dto) {

    }

    @Transactional
    public void excluir(Integer id) {

    }

    public Sala buscarEntidade(Integer id) {

    }

    private void aplicarDados(Sala sala, SalaDto dto) {

    }

    public SalaDto toDto(Sala sala) {

    }
}
