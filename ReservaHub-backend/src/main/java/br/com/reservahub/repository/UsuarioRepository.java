package br.com.reservahub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.reservahub.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCpf(String cpf);
    Optional<Usuario> findByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
}
