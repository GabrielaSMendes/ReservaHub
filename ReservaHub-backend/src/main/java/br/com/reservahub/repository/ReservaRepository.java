package br.com.reservahub.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.reservahub.entity.Reserva;
import br.com.reservahub.entity.Reserva.ReservaStatus;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    List<Reserva> findByUsuarioId(Integer usuarioId);
    List<Reserva> findBySalaId(Integer salaId);
    List<Reserva> findByStatus(ReservaStatus status);

    @Query("""
            select count(r) > 0
            from Reserva r
            where r.sala.id = :salaId
              and r.dataReserva = :dataReserva
              and r.status = :status
              and r.horaInicio < :horaFim
              and r.horaFim > :horaInicio
              and (:reservaId is null or r.id <> :reservaId)
            """)
    boolean existsConflitoHorario(
            @Param("salaId") Integer salaId,
            @Param("dataReserva") LocalDate dataReserva,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFim") LocalTime horaFim,
            @Param("reservaId") Integer reservaId,
            @Param("status") ReservaStatus status);
}
