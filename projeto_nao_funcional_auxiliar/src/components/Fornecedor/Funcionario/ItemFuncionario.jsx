import React, { useState } from "react";
import estilo from './ItemFuncionario.module.css';
import EditarFuncionario from "../EditarFuncionario/EditarFuncionario";

import editar from '../../../assets/Institucional/Funcionarios/edit.svg';
import lixo from '../../../assets/Institucional/Funcionarios/trash.svg';
import api from "../../../api/api";

function ItemFuncionario({ id, nome, email, permissao }) {
    const [exibirEditar, setExibirEditar] = useState(false);

    const handleAbrirModal = () => {
        setExibirEditar(true);
    };

    const handleFecharModal = () => {
        setExibirEditar(false);
    }

    const excluirFuncionario = () => {
        api.delete(`/funcionarios/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                console.log('Funcionário excluído com sucesso:', response);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Erro ao excluir funcionário:', error);
            });
    };

    return (
        <>
            <section className={estilo.funcionario} key={id}>
                <div className={estilo.item_nome}>
                    <span>{nome}</span>
                </div>
                <div className={estilo.item_email}>
                    <span>{email}</span>
                </div>
                <div className={estilo.item_permissao}>
                    <span>{permissao}</span>
                </div>
                <div className={estilo.item_icones}>
                    <img src={editar} alt="Icone de lápis" onClick={handleAbrirModal} className={estilo.editar} />
                    <img src={lixo} alt="Icone de lata de lixo" onClick={excluirFuncionario} />
                </div>
                {exibirEditar && <EditarFuncionario
                    handleFecharModal={handleFecharModal}
                    id={id}
                    nome={nome}
                    email={email}
                    permissao={permissao}
                />}
            </section>
        </>
    )
}

export default ItemFuncionario;