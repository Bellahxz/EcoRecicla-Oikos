package com.ecorecicla.oikos.repository;

import com.ecorecicla.oikos.model.RegistroResiduo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistroResiduoRepository extends JpaRepository<RegistroResiduo, Long> {

    List<RegistroResiduo> findByEstado(String estado);

    List<RegistroResiduo> findByMunicipioContainingIgnoreCase(String municipio);

    List<RegistroResiduo> findByAno(Integer ano);

    List<RegistroResiduo> findByTaxaReciclagemLessThan(Double taxaMeta);

    boolean existsByMunicipioIgnoreCaseAndEstadoIgnoreCaseAndAno(String municipio, String estado, Integer ano);
}