package br.com.reservahub.dto;

public record SalaDto(

        Integer id,
        String nome,
        String descricao,
        Boolean status,
        String nomeSala,
        Integer capacidade

) {
}