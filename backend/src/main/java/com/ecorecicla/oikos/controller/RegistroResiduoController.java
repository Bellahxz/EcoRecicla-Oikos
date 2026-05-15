package com.ecorecicla.oikos.controller;

import com.ecorecicla.oikos.model.RegistroResiduo;
import com.ecorecicla.oikos.service.RegistroResiduoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/residuos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RegistroResiduoController {

    private final RegistroResiduoService service;

    @GetMapping
    public ResponseEntity<List<RegistroResiduo>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroResiduo> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<RegistroResiduo> criar(@RequestBody RegistroResiduo registro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(registro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroResiduo> atualizar(@PathVariable Long id,
                                                     @RequestBody RegistroResiduo registro) {
        return ResponseEntity.ok(service.atualizar(id, registro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<RegistroResiduo>> porEstado(@PathVariable String estado) {
        List<RegistroResiduo> resultado = service.buscarPorEstado(estado);
        if (resultado.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/municipio")
    public ResponseEntity<List<RegistroResiduo>> porMunicipio(@RequestParam String nome) {
        List<RegistroResiduo> resultado = service.buscarPorMunicipio(nome);
        if (resultado.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/ano/{ano}")
    public ResponseEntity<List<RegistroResiduo>> porAno(@PathVariable Integer ano) {
        List<RegistroResiduo> resultado = service.buscarPorAno(ano);
        if (resultado.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/abaixo-da-meta")
    public ResponseEntity<List<RegistroResiduo>> abaixoDaMeta(
            @RequestParam(defaultValue = "20.0") Double meta) {
        return ResponseEntity.ok(service.buscarAbaixoDaMeta(meta));
    }

    @PostMapping("/importar-csv")
    public ResponseEntity<Map<String, Object>> importarCsv(@RequestParam("arquivo") MultipartFile arquivo) {
        if (arquivo.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Arquivo CSV não pode estar vazio."));
        }
        try {
            int total = service.importarCsv(arquivo);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensagem", "Importação concluída!", "registrosImportados", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Falha ao processar o CSV: " + e.getMessage()));
        }
    }
}