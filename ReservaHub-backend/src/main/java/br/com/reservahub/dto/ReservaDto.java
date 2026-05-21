package br.com.reservahub.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import br.com.reservahub.entity.Reserva.ReservaStatus;
import jakarta.validation.constraints.NotNull;

public record ReservaDto(
        Integer id,
        @NotNull Integer usuarioId,
        String usuarioNome,
        @NotNull Integer salaId,
        String salaNome,
        @NotNull LocalDate dataReserva,
        @NotNull LocalTime horaInicio,
        @NotNull LocalTime horaFim,
        ReservaStatus status,
        String observacao,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
