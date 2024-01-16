import React, { useState, useEffect } from 'react';
import api from "../../../api/api";
import style from "./ModalPreferencias.module.css";
import { IoClose } from "react-icons/io5";


function ModalPreferencias({ handleFecharModal, preferencias, atualizarPreferenciasSelecionadas, listaPreferenciasSelecionadas }) {

    const enviar = () => {
        atualizarPreferenciasSelecionadas(listaPreferenciasSelecionadas);
        handleFecharModal();
    };

    const handleSpanClick = (categoria) => {
        if (!listaPreferenciasSelecionadas.includes(categoria)) {
            atualizarPreferenciasSelecionadas([...listaPreferenciasSelecionadas, categoria]);
        }
    };

    const handleRemoverPreferencias = (categoria) => {
        atualizarPreferenciasSelecionadas(listaPreferenciasSelecionadas.filter((cat) => cat !== categoria));
    };

    const handleCliqueForaModal = (event) => {
        if (event.target === event.currentTarget) {
            handleFecharModal();
        }
    };

    return (
        <>
            <div className={style.fundo_modal} onClick={handleCliqueForaModal}>
                <div className={style.card}>
                    <IoClose onClick={handleFecharModal} size={25} className={style.fechar} />
                    <h1 className={style.titulo}>Adicionar Preferências</h1>
                    <div className={style.container_itens_selecionados}>
                        <h2 className={style.subtitulo}>preferencias Selecionadas</h2>
                        {listaPreferenciasSelecionadas.map((preferencias) => (
                            <span
                                style={{ backgroundColor: '#' + preferencias.corFundo, color: '#' + preferencias.corTexto }}
                                onClick={() => handleRemoverPreferencias(preferencias)}
                                className={style.item}
                                key={preferencias.id}>
                                {preferencias.nome}
                            </span>
                        ))}
                    </div>
                    <div className={style.container_itens}>
                        <h2 className={style.subtitulo}>preferencias Disponíveis</h2>
                        {preferencias.map((preferencias) => (
                            <span
                                style={{ backgroundColor: '#' + preferencias.corFundo, color: '#' + preferencias.corTexto }}
                                onClick={() => handleSpanClick(preferencias)}
                                className={style.item}
                                key={preferencias.id}
                            >
                                {preferencias.nome}
                            </span>
                        ))}
                    </div>
                    <div className={style.botoes}>
                        <button onClick={handleFecharModal} className={style.cancelar}>
                            Cancelar
                        </button>
                        <button onClick={enviar} className={style.confirmar}>Confirmar</button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ModalPreferencias;