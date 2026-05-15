package com.ecorecicla.oikos.exception;

public class RegistroNaoEncontradoException extends RuntimeException {

    public RegistroNaoEncontradoException(Long id) {
        super("Registro não encontrado com o ID: " + id);
    }
}