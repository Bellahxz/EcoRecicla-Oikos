package com.ecorecicla.oikos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MultipartException;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Registro não encontrado pelo ID → 404 Not Found
    @ExceptionHandler(RegistroNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleNaoEncontrado(RegistroNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erroMap(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        ));
    }

    // Registro duplicado: mesmo município + estado + ano → 409 Conflict
    @ExceptionHandler(RegistroDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicado(RegistroDuplicadoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erroMap(
                HttpStatus.CONFLICT,
                ex.getMessage()
        ));
    }

    // Tipo de parâmetro inválido na URL (ex: /api/residuos/abc quando espera Long)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(erroMap(
                HttpStatus.BAD_REQUEST,
                "Parâmetro inválido: '" + ex.getName() + "' deve ser do tipo " + ex.getRequiredType().getSimpleName()
        ));
    }

    // @RequestParam obrigatório ausente (ex: /municipio sem ?nome=)
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> handleMissingParam(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(erroMap(
                HttpStatus.BAD_REQUEST,
                "Parâmetro obrigatório ausente: '" + ex.getParameterName() + "'"
        ));
    }

    // Corpo JSON malformado no POST/PUT
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleJsonMalformado(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(erroMap(
                HttpStatus.BAD_REQUEST,
                "Corpo da requisição inválido. Verifique se o JSON está bem formatado."
        ));
    }

    // CSV inválido: extensão errada, encoding corrompido, sem dados válidos, etc.
    @ExceptionHandler(CsvImportException.class)
    public ResponseEntity<Map<String, Object>> handleCsvImport(CsvImportException ex) {
        return ResponseEntity.badRequest().body(erroMap(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        ));
    }

    // Requisição multipart malformada
    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Map<String, Object>> handleMultipart(MultipartException ex) {
        return ResponseEntity.badRequest().body(erroMap(
                HttpStatus.BAD_REQUEST,
                "Requisição inválida: envie o arquivo no campo 'arquivo' como multipart/form-data."
        ));
    }

    // Qualquer outra exceção não tratada explicitamente
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erroMap(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno inesperado: " + ex.getMessage()
        ));
    }

    private Map<String, Object> erroMap(HttpStatus status, String mensagem) {
        return Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "erro", status.getReasonPhrase(),
                "mensagem", mensagem
        );
    }
}