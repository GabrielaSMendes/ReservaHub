package br.com.reservahub.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sala")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sala")
    private Integer id;

    /*
     * Campo mantido apenas para compatibilidade
     * com frontend/swagger.
     * Não existe na tabela SQL.
     */
    @Transient
    private String nome;

    @Column(name = "nome_sala")
    private String nomeSala;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "capacidade")
    private Integer capacidade;

    @Column(name = "status")
    private Boolean status;

    public Sala() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeSala() {
        return nomeSala;
    }

    public void setNomeSala(String nomeSala) {
        this.nomeSala = nomeSala;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}