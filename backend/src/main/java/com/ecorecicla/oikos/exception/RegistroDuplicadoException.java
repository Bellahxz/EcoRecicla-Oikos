package com.ecorecicla.oikos.exception;

public class RegistroDuplicadoException extends RuntimeException {

    public RegistroDuplicadoException(String municipio, String estado, Integer ano) {
        super("Já existe um registro para o município '" + municipio +
                "' (" + estado + ") no ano " + ano + ".");
    }
}