package br.com.reservahub.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.reservahub.dto.UsuarioDto;
import br.com.reservahub.entity.Usuario;
import br.com.reservahub.exception.ResourceNotFoundException;
import br.com.reservahub.repository.UsuarioRepository;

@SuppressWarnings("null")
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioDto> listar() {
        return usuarioRepository.findAll().stream().map(this::toDto).toList();
    }

    public UsuarioDto buscarPorId(Integer id) {
        return toDto(buscarEntidade(id));
    }

    @Transactional
    public UsuarioDto criar(UsuarioDto dto) {
        if (usuarioRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF ja cadastrado");
        }
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email ja cadastrado");
        }
        Usuario usuario = new Usuario();
        aplicarDados(usuario, dto);
        return toDto(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioDto atualizar(Integer id, UsuarioDto dto) {
        Usuario usuario = buscarEntidade(id);
        aplicarDados(usuario, dto);
        return toDto(usuarioRepository.save(usuario));
    }

    @Transactional
    public void excluir(Integer id) {
        usuarioRepository.delete(Objects.requireNonNull(buscarEntidade(id)));
    }

    public Usuario buscarEntidade(Integer id) {
        return usuarioRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado: " + id));
    }

    private void aplicarDados(Usuario usuario, UsuarioDto dto) {
        usuario.setNome(dto.nome());
        usuario.setCpf(dto.cpf());
        usuario.setEmail(dto.email());
        usuario.setSenha(dto.senha());
        usuario.setTelefone(dto.telefone());
        usuario.setAtivo(dto.ativo() != null ? dto.ativo() : Boolean.TRUE);
        usuario.setIdPerfil(1);
    }

    public UsuarioDto toDto(Usuario usuario) {
        return new UsuarioDto(
                usuario.getId(),
                usuario.getNome(),
                usuario.getCpf(),
                usuario.getEmail(),
                null,
                usuario.getTelefone(),
                usuario.getAtivo(),
                usuario.getCreatedAt(),
                usuario.getUpdatedAt());
    }
}
