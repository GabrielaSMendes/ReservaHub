package br.com.reservahub.controller;

import br.com.reservahub.dto.SalaDto;
import br.com.reservahub.entity.Sala;
import br.com.reservahub.service.SalaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@CrossOrigin("*")
public class SalaController {

    private final SalaService salaService;

    public SalaController(SalaService salaService) {
        this.salaService = salaService;
    }

    @PostMapping
    public ResponseEntity<Sala> criar(@RequestBody SalaDto dto) {

        Sala sala = salaService.criar(dto);

        return ResponseEntity.ok(sala);
    }

    @GetMapping
    public ResponseEntity<List<Sala>> listar() {

        return ResponseEntity.ok(salaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sala> buscarPorId(@PathVariable Integer id) {

        Sala sala = salaService.buscarPorId(id);

        return ResponseEntity.ok(sala);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sala> atualizar(
            @PathVariable Integer id,
            @RequestBody SalaDto dto
    ) {

        Sala salaAtualizada = salaService.atualizar(id, dto);

        return ResponseEntity.ok(salaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {

        salaService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}