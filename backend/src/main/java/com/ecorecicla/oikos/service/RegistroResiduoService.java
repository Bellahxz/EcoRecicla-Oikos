package com.ecorecicla.oikos.service;

import com.ecorecicla.oikos.exception.CsvImportException;
import com.ecorecicla.oikos.model.RegistroResiduo;
import com.ecorecicla.oikos.repository.RegistroResiduoRepository;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistroResiduoService {

    private final RegistroResiduoRepository repository;

    public List<RegistroResiduo> listarTodos() {
        return repository.findAll();
    }

    public Optional<RegistroResiduo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public RegistroResiduo salvar(RegistroResiduo registro) {
        return repository.save(registro);
    }

    public Optional<RegistroResiduo> atualizar(Long id, RegistroResiduo dadosNovos) {
        return repository.findById(id).map(existente -> {
            existente.setMunicipio(dadosNovos.getMunicipio());
            existente.setEstado(dadosNovos.getEstado());
            existente.setQuantidadeGerada(dadosNovos.getQuantidadeGerada());
            existente.setTaxaReciclagem(dadosNovos.getTaxaReciclagem());
            existente.setAno(dadosNovos.getAno());
            return repository.save(existente);
        });
    }

    public boolean deletar(Long id) {
        return repository.findById(id).map(registro -> {
            repository.delete(registro);
            return true;
        }).orElse(false);
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
        // Valida extensão do arquivo
        String nomeArquivo = arquivo.getOriginalFilename();
        if (nomeArquivo == null || !nomeArquivo.toLowerCase().endsWith(".csv")) {
            throw new CsvImportException("O arquivo enviado não é um CSV. Envie um arquivo com extensão .csv");
        }

        // Valida content-type (navegadores modernos preenchem isso)
        String contentType = arquivo.getContentType();
        if (contentType != null && !contentType.contains("csv") && !contentType.contains("text")) {
            throw new CsvImportException("Tipo de arquivo inválido: '" + contentType + "'. Envie um arquivo CSV de texto.");
        }

        List<RegistroResiduo> registros = new ArrayList<>();
        int linhasLidas = 0;

        byte[] bytes = arquivo.getBytes();
        Charset charset = detectarCharset(bytes);

        try (CSVReader reader = new CSVReaderBuilder(
                new InputStreamReader(new ByteArrayInputStream(bytes), charset))
                .withCSVParser(new CSVParserBuilder().withSeparator(';').build())
                .withSkipLines(1) // pula cabeçalho
                .build()) {

            String[] linha;
            while ((linha = reader.readNext()) != null) {
                linhasLidas++;

                // Ignora linha de rodapé "TOTAL da AMOSTRA"
                if (linha.length < 4 || linha[0].trim().startsWith("TOTAL")) {
                    continue;
                }

                try {
                    String municipio = linha[1].trim();
                    String estado    = linha[2].trim();
                    String anoStr    = linha[3].trim();

                    if (municipio.isBlank() || estado.isBlank() || anoStr.isBlank()) continue;

                    int ano = Integer.parseInt(anoStr);

                    // Quantidade total recebida na unidade (coluna UP080, índice 13)
                    double quantidadeGerada = parsarDouble(linha, 13);

                    // RDO+RPU recebidos (coluna UP007, índice 6) — resíduos domiciliares e públicos
                    // Usamos como proxy da fração orgânica/convencional dentro do total recebido
                    double quantidadeRDO = parsarDouble(linha, 6);

                    // Taxa estimada: proporção de RDO+RPU sobre o total recebido
                    double taxaReciclagem = 0.0;
                    if (quantidadeGerada > 0) {
                        taxaReciclagem = Math.min((quantidadeRDO / quantidadeGerada) * 100.0, 100.0);
                    }

                    RegistroResiduo registro = RegistroResiduo.builder()
                            .municipio(municipio)
                            .estado(estado)
                            .quantidadeGerada(quantidadeGerada)
                            .taxaReciclagem(taxaReciclagem)
                            .ano(ano)
                            .build();

                    registros.add(registro);

                } catch (Exception e) {
                    // Linha com dado inválido: ignora e continua processando as demais
                }
            }

        } catch (CsvImportException e) {
            throw e; // já tratada, repassa direto
        } catch (Exception e) {
            throw new CsvImportException("Falha ao ler o arquivo CSV. Verifique se o arquivo não está corrompido.", e);
        }

        // Arquivo lido mas sem nenhuma linha de dados reconhecida
        if (linhasLidas == 0) {
            throw new CsvImportException("O arquivo CSV está vazio.");
        }
        if (registros.isEmpty()) {
            throw new CsvImportException(
                "Nenhum registro válido encontrado. Verifique se o CSV segue o formato do SNIS (separador ';')."
            );
        }

        repository.saveAll(registros);
        return registros.size();
    }

    private Charset detectarCharset(byte[] bytes) {
        if (bytes.length >= 2) {
            // UTF-16 Little Endian com BOM: FF FE
            if ((bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xFE) {
                return StandardCharsets.UTF_16LE;
            }
            // UTF-16 Big Endian com BOM: FE FF
            if ((bytes[0] & 0xFF) == 0xFE && (bytes[1] & 0xFF) == 0xFF) {
                return StandardCharsets.UTF_16BE;
            }
            // UTF-16 LE sem BOM: byte nulo no segundo byte (ex: 22 00 = '"' em LE)
            // O SNIS exporta assim — sem BOM, mas em UTF-16 LE
            if (bytes[1] == 0x00) {
                return StandardCharsets.UTF_16LE;
            }
        }
        if (bytes.length >= 3) {
            // UTF-8 com BOM: EF BB BF
            if ((bytes[0] & 0xFF) == 0xEF && (bytes[1] & 0xFF) == 0xBB && (bytes[2] & 0xFF) == 0xBF) {
                return StandardCharsets.UTF_8;
            }
        }
        return StandardCharsets.UTF_8; // padrão
    }

    private double parsarDouble(String[] linha, int indice) {
        if (indice >= linha.length) return 0.0;
        String valor = linha[indice].trim().replace(".", "").replace(",", ".");
        if (valor.isBlank()) return 0.0;
        try {
            return Double.parseDouble(valor);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
