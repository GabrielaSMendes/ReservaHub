package br.com.reservahub.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.reservahub.dto.ReservaDto;
import br.com.reservahub.entity.Reserva;
import br.com.reservahub.entity.Reserva.ReservaStatus;
import br.com.reservahub.entity.Sala;
import br.com.reservahub.entity.Usuario;
import br.com.reservahub.exception.ResourceNotFoundException;
import br.com.reservahub.repository.ReservaRepository;

@SuppressWarnings("null")
@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioService usuarioService;
    private final SalaService salaService;

    public ReservaService(ReservaRepository reservaRepository, UsuarioService usuarioService, SalaService salaService) {
        this.reservaRepository = reservaRepository;
        this.usuarioService = usuarioService;
        this.salaService = salaService;
    }

    @Transactional(readOnly = true)
    public List<ReservaDto> listar() {
        return reservaRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ReservaDto buscarPorId(Integer id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    public ReservaDto criar(ReservaDto dto) {
        validarHorario(dto);
        validarConflito(dto, null);
        Reserva reserva = new Reserva();
        aplicarDados(reserva, dto);
        return toDto(reservaRepository.save(reserva));
    }

    @Transactional
    public ReservaDto atualizar(Integer id, ReservaDto dto) {
        validarHorario(dto);
        validarConflito(dto, id);
        Reserva reserva = buscarEntidade(id);
        aplicarDados(reserva, dto);
        return toDto(reservaRepository.save(reserva));
    }

    @Transactional
    public ReservaDto cancelar(Integer id) {
        Reserva reserva = buscarEntidade(id);
        reserva.setStatus(ReservaStatus.CANCELADA);
        return toDto(reservaRepository.save(reserva));
    }

    @Transactional
    public void excluir(Integer id) {
        reservaRepository.delete(Objects.requireNonNull(buscarEntidade(id)));
    }

    public Reserva buscarEntidade(Integer id) {
        return reservaRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Reserva nao encontrada: " + id));
    }

    private void aplicarDados(Reserva reserva, ReservaDto dto) {
        Usuario usuario = usuarioService.buscarEntidade(dto.usuarioId());
        Sala sala = salaService.buscarEntidade(dto.salaId());
        reserva.setUsuario(usuario);
        reserva.setSala(sala);
        reserva.setDataReserva(dto.dataReserva());
        reserva.setHoraInicio(dto.horaInicio());
        reserva.setHoraFim(dto.horaFim());
        reserva.setStatus(dto.status() != null ? dto.status() : ReservaStatus.ATIVA);
        reserva.setObservacao(dto.observacao());
    }

    private void validarHorario(ReservaDto dto) {
        if (!dto.horaInicio().isBefore(dto.horaFim())) {
            throw new IllegalArgumentException("Hora de inicio deve ser anterior a hora de fim");
        }
    }

    private void validarConflito(ReservaDto dto, Integer reservaId) {
        boolean existeConflito = reservaRepository.existsConflitoHorario(
                dto.salaId(),
                dto.dataReserva(),
                dto.horaInicio(),
                dto.horaFim(),
                reservaId,
                ReservaStatus.ATIVA);
        if (existeConflito) {
            throw new IllegalArgumentException("Ja existe uma reserva ativa para esta sala neste horario");
        }
    }

    public ReservaDto toDto(Reserva reserva) {
        return new ReservaDto(
                reserva.getId(),
                reserva.getUsuario().getId(),
                reserva.getUsuario().getNome(),
                reserva.getSala().getId(),
                reserva.getSala().getNomeSala(),
                reserva.getDataReserva(),
                reserva.getHoraInicio(),
                reserva.getHoraFim(),
                reserva.getStatus(),
                reserva.getObservacao(),
                reserva.getCreatedAt(),
                reserva.getUpdatedAt());
    }
}