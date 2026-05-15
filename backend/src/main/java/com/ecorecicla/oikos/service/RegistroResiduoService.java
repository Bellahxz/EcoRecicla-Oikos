package com.ecorecicla.oikos.service;

import com.ecorecicla.oikos.exception.CsvImportException;
import com.ecorecicla.oikos.exception.RegistroDuplicadoException;
import com.ecorecicla.oikos.exception.RegistroNaoEncontradoException;
import com.ecorecicla.oikos.model.RegistroResiduo;
import com.ecorecicla.oikos.repository.RegistroResiduoRepository;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistroResiduoService {

    private static final String CHARSET_CSV  = "UTF-16LE";
    private static final char   SEPARADOR    = ';';

    private final RegistroResiduoRepository repository;

    public List<RegistroResiduo> listarTodos() {
        return repository.findAll();
    }


    public RegistroResiduo buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RegistroNaoEncontradoException(id));
    }

    public RegistroResiduo salvar(RegistroResiduo registro) {
        if (repository.existsByMunicipioIgnoreCaseAndEstadoIgnoreCaseAndAno(
                registro.getMunicipio(), registro.getEstado(), registro.getAno())) {
            throw new RegistroDuplicadoException(
                    registro.getMunicipio(), registro.getEstado(), registro.getAno());
        }
        return repository.save(registro);
    }


    public RegistroResiduo atualizar(Long id, RegistroResiduo dadosNovos) {
        RegistroResiduo existente = repository.findById(id)
                .orElseThrow(() -> new RegistroNaoEncontradoException(id));

        boolean mudouChave = !existente.getMunicipio().equalsIgnoreCase(dadosNovos.getMunicipio())
                || !existente.getEstado().equalsIgnoreCase(dadosNovos.getEstado())
                || !existente.getAno().equals(dadosNovos.getAno());

        if (mudouChave && repository.existsByMunicipioIgnoreCaseAndEstadoIgnoreCaseAndAno(
                dadosNovos.getMunicipio(), dadosNovos.getEstado(), dadosNovos.getAno())) {
            throw new RegistroDuplicadoException(
                    dadosNovos.getMunicipio(), dadosNovos.getEstado(), dadosNovos.getAno());
        }

        existente.setMunicipio(dadosNovos.getMunicipio());
        existente.setEstado(dadosNovos.getEstado());
        existente.setQuantidadeGerada(dadosNovos.getQuantidadeGerada());
        existente.setTaxaReciclagem(dadosNovos.getTaxaReciclagem());
        existente.setAno(dadosNovos.getAno());
        return repository.save(existente);
    }

    public void deletar(Long id) {
        RegistroResiduo registro = repository.findById(id)
                .orElseThrow(() -> new RegistroNaoEncontradoException(id));
        repository.delete(registro);
    }

    public List<RegistroResiduo> buscarPorEstado(String estado) {
        return repository.findByEstado(estado.toUpperCase());
    }

    public List<RegistroResiduo> buscarPorMunicipio(String municipio) {
        return repository.findByMunicipioContainingIgnoreCase(municipio);
    }

    public List<RegistroResiduo> buscarPorAno(Integer ano) {
        return repository.findByAno(ano);
    }

    public List<RegistroResiduo> buscarAbaixoDaMeta(Double meta) {
        return repository.findByTaxaReciclagemLessThan(meta);
    }

    public int importarCsv(MultipartFile arquivo) throws IOException {
        String nomeArquivo = arquivo.getOriginalFilename();
        if (nomeArquivo == null || !nomeArquivo.toLowerCase().endsWith(".csv")) {
            throw new CsvImportException("O arquivo enviado não é um CSV. Envie um arquivo com extensão .csv");
        }

        List<RegistroResiduo> registros = new ArrayList<>();
        int linhasLidas       = 0;
        int duplicatasIgnoradas = 0;

        try (CSVReader reader = new CSVReaderBuilder(
                new InputStreamReader(arquivo.getInputStream(), CHARSET_CSV))
                .withCSVParser(new CSVParserBuilder().withSeparator(SEPARADOR).build())
                .withSkipLines(1) // pula cabeçalho
                .build()) {

            String[] linha;
            while ((linha = reader.readNext()) != null) {
                linhasLidas++;

                // Ignora rodapé "TOTAL da AMOSTRA" e linhas curtas
                if (linha.length < 14 || linha[0].trim().startsWith("TOTAL")) continue;

                try {
                    String municipio = linha[1].trim();
                    String estado    = linha[2].trim();
                    int    ano       = Integer.parseInt(linha[3].trim());

                    if (municipio.isBlank() || estado.isBlank()) continue;

                    // Pula duplicatas silenciosamente
                    if (repository.existsByMunicipioIgnoreCaseAndEstadoIgnoreCaseAndAno(municipio, estado, ano)) {
                        duplicatasIgnoradas++;
                        continue;
                    }

                    // Coluna UP080 [13] = quantidade total recebida
                    // Coluna UP067 [12] = quantidade de RPO recebida
                    double quantidadeGerada = parsarBR(linha[13]);
                    double quantidadeRPO    = parsarBR(linha[12]);

                    double taxaReciclagem = quantidadeGerada > 0
                            ? Math.min((quantidadeRPO / quantidadeGerada) * 100.0, 100.0)
                            : 0.0;

                    registros.add(RegistroResiduo.builder()
                            .municipio(municipio)
                            .estado(estado)
                            .quantidadeGerada(quantidadeGerada)
                            .taxaReciclagem(taxaReciclagem)
                            .ano(ano)
                            .build());

                } catch (Exception e) {
                    // linha com dado inválido — ignora e continua
                }
            }

        } catch (CsvImportException e) {
            throw e;
        } catch (Exception e) {
            throw new CsvImportException("Falha ao ler o arquivo CSV: " + e.getMessage(), e);
        }

        if (linhasLidas == 0) {
            throw new CsvImportException("O arquivo CSV está vazio.");
        }
        if (registros.isEmpty() && duplicatasIgnoradas == 0) {
            throw new CsvImportException(
                    "Nenhum registro válido encontrado. Verifique se o CSV segue o formato do SNIS.");
        }

        if (!registros.isEmpty()) {
            repository.saveAll(registros);
        }

        return registros.size();
    }


    private double parsarBR(String valor) {
        if (valor == null || valor.isBlank()) return 0.0;
        try {
            return Double.parseDouble(valor.trim().replace(".", "").replace(",", "."));
        } catch (NumberFormatException e) {
            return 0.0;
        }

    }
}