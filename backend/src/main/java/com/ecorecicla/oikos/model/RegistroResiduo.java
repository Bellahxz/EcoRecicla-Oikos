package com.ecorecicla.oikos.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "registro_residuo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroResiduo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String municipio;

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(nullable = false)
    private Double quantidadeGerada; // toneladas

    @Column(nullable = false)
    private Double taxaReciclagem; // porcentagem

    @Column(nullable = false)
    private Integer ano;
}
