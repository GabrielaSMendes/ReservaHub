package br.com.reservahub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.reservahub.entity.Sala;

public interface SalaRepository extends JpaRepository<Sala, Integer> {

    List<Sala> findByStatusTrue();

}