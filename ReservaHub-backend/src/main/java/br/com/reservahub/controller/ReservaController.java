package br.com.reservahub.controller;

import java.net.URI;
import java.util.List;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.reservahub.dto.ReservaDto;
import br.com.reservahub.service.ReservaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public List<ReservaDto> listar() {
        return reservaService.listar();
    }

    @GetMapping("/{id}")
    public ReservaDto buscarPorId(@PathVariable Integer id) {
        return reservaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ReservaDto> criar(@Valid @RequestBody ReservaDto dto) {
        ReservaDto criada = reservaService.criar(dto);
        return ResponseEntity.created(Objects.requireNonNull(URI.create("/api/reservas/" + criada.id()))).body(criada);
    }

    @PutMapping("/{id}")
    public ReservaDto atualizar(@PathVariable Integer id, @Valid @RequestBody ReservaDto dto) {
        return reservaService.atualizar(id, dto);
    }

    @PatchMapping("/{id}/cancelar")
    public ReservaDto cancelar(@PathVariable Integer id) {
        return reservaService.cancelar(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        reservaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}