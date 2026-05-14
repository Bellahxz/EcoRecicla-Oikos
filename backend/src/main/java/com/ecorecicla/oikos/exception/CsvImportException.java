package com.ecorecicla.oikos.exception;

public class CsvImportException extends RuntimeException {

    public CsvImportException(String mensagem) {

        super(mensagem);
    }

    public CsvImportException(String mensagem, Throwable causa) {

        super(mensagem, causa);
    }
}
