import React, { useState, useEffect } from "react";
import api from "../../../../api/api";
import Preferencia from "../Preferencia";
import style from "./ModalReceita.module.css"
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";

import editar from "../../../../assets/Fornecedor/Receitas/Edit.svg"
import lixo from "../../../../assets/Fornecedor/Receitas/trash.svg"
import sair from "../../../../assets/Fornecedor/Receitas/exit.svg"

function ModalReceita({ id, nome, ingredientes, rendimento, horas, minutos, qtdAvaliacao, mediaAvaliacao, preparo, categoria, preferencia, imagem, fecharModal }) {

    const [listaIngredientes, setListaIngredientes] = useState(ingredientes);
    const [listaPreparo, setListaPreparo] = useState(preparo);
    const [listaPreferencia, setListaPreferencia] = useState(preferencia);
    const [listaCategoria, setListaCategoria] = useState(categoria);
    const location = useLocation();

    const isPaginaReceitasCliente = location.pathname === '/fornecedor/receitas';

    const excluirReceitaAlerta = () => {
        Swal.fire({
            title: "Tem certeza de que você deseja excluir a receita?",
            confirmButtonColor: "#FF9F1C",
            denyButtonColor: "#787878",
            showDenyButton: true,
            denyButtonText: `Não`,
            confirmButtonText: "Sim",
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
                exluir();
            }
          });
    }

    function exluir() {
        api.delete(`/receitas/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then(response => {
                console.log(response.data)
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const closeModal = () => {
        fecharModal();
    }

    const formatarEnum = (enumValue) => {
        switch (enumValue) {
            case 'LITRO':
                return 'Litros de';
            case 'KILO':
                return 'Quilos';
            case 'GRAMA':
                return 'Gramas de';
            case 'MILIGRAMA':
                return 'Miligramas de';
            case 'MILILITRO':
                return 'Mililitros de';
            case 'XICARA':
                return 'Xícaras de';
            case 'SEM_UNIDADE':
                return '';
            case 'COLHER_SOPA':
                return 'Colheres de Sopa de';
            case 'COLHER_CHA':
                return 'Colheres de Chá de';
            case 'UNIDADE':
                return 'Unidades de';
            default:
                return '';
        }
    };


    return (
        <>
            <div className={style.body}>
                <section className={style.card} onClick={(e) => { e.stopPropagation(); }}>
                    <img src={sair} className={style.icone_sair} alt="sair" onClick={closeModal} />
                    <div className={style.esquerda}>
                        <div className={style.container_avaliacao}>
                            <div className={style.avaliacao}>
                                <span>⭐{mediaAvaliacao} ({qtdAvaliacao} Avaliações)</span>
                            </div>
                            {isPaginaReceitasCliente && (
                                <div className={style.editar_excluir}>
                                    <a href={`/fornecedor/editar-receita/${id}`}>
                                        <img src={editar} className={style.icone} alt="Icone de lápis" />
                                    </a>
                                    <img src={lixo} onClick={excluirReceitaAlerta} className={style.icone} alt="Icone de lixo" />
                                </div>
                            )}
                        </div>
                        <div className={style.imagem}>
                            <img src={imagem} alt="Foto da receita" />
                        </div>
                        <div className={style.container_nome}>
                            <h1 className={style.nome_receita}>{nome}</h1>
                        </div>

                        <h2 className={style.titulo_ingredientes}>Ingredientes:</h2>
                        <ul className={style.container_ingredientes}>
                            {listaIngredientes.map((ingrediente) => (
                                <li key={ingrediente.id}>
                                    {ingrediente.quantidade} <span> </span>
                                    {formatarEnum(ingrediente.unidadeMedidaEnum)} <span> </span>
                                    {ingrediente.nome} <span> </span>
                                </li>
                            ))}
                        </ul>
                        {(() => {
                            if (rendimento == 1) {
                                return <span className={style.porcoes}>Ingredientes para render <b>{rendimento}</b> porção</span>;
                            } else if (rendimento > 1) {
                                return <span className={style.porcoes}>Ingredientes para render <b>{rendimento}</b> porções</span>;
                            }
                        })()}
                    </div>
                    <div className={style.linha_vertical} />
                    <div className={style.direita}>
                        <h2 className={style.titulo_preparo}>Modo de preparo:</h2>
                        <ol className={style.container_preparo}>
                            {listaPreparo.map((passoPreparo) => (
                                <li key={passoPreparo.id}>
                                    {passoPreparo.passo}
                                </li>
                            ))}
                        </ol>
                        <div className={style.container_tempo_categoria_preferencia}>
                            <div className={style.categoria}>
                                <b>Categoria: </b>
                                {Array.isArray(categoria) && categoria.map((cat, index) => (
                                    <span className={`${style.nome_categoria} mr-2`} key={index}>
                                        {cat.categoria.nome} |
                                    </span>
                                ))}
                            </div>
                            <div className={style.preferencia}>
                                <b>Prefêrencias:</b>
                                {Array.isArray(preferencia) && preferencia.map((pref, index) => (
                                    <Preferencia key={index} preferencia={pref.preferencia} />
                                ))}
                            </div>
                            <span>
                                <b>Tempo de preparo: </b>
                                {(() => {
                                    if (horas == 0) {
                                        return <span>{minutos} minutos</span>;
                                    } else if (horas == 1 && minutos == 0) {
                                        return <span>{horas} hora</span>;
                                    } else if (horas == 1 && minutos > 0) {
                                        return <span>{horas} hora e {minutos} minutos</span>;
                                    } else if (horas > 1 && minutos == 0) {
                                        return <span>{horas} horas</span>;
                                    } else if (horas > 1 && minutos > 0) {
                                        return <span>{horas} horas e {minutos} minutos</span>;
                                    }
                                })()}
                            </span>
                        </div>
                    </div>
                </section >
            </div >
        </>
    )
}

export default ModalReceita;