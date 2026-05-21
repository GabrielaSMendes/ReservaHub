package br.com.reservahub.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioDto(
        Integer id,
        @NotBlank @Size(max = 100) String nome,
        @NotBlank @Size(max = 14) String cpf,
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(max = 255) String senha,
        @Size(max = 20) String telefone,
        Boolean ativo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
