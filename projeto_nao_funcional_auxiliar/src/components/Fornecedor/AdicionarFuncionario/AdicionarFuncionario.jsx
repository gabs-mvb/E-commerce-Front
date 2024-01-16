import axios from "axios";
import React, { useState } from "react";
import style from "./AdicionarFuncionario.module.css"

import x from "../../../assets/Institucional/Funcionarios/x.svg";
import user from "../../../assets/Institucional/Funcionarios/user.svg"
import icon_email from "../../../assets/Institucional/Funcionarios/email.svg"
import api from "../../../api/api";
import Swal from 'sweetalert2';

function AdicionarFuncionario({ handleFecharModal }) {
    const [novoFuncionario, setNovoFuncionario] = useState({
        nome: "",
        email: "",
        permissao: "FUNCIONARIO",
    });

    const handleNomeChange = (event) => {
        setNovoFuncionario({ ...novoFuncionario, nome: event.target.value });
    };

    const handleEmailChange = (event) => {
        setNovoFuncionario({ ...novoFuncionario, email: event.target.value });
    };

    const handlePermissaoChange = (event) => {
        let permissao
        if (event.target.checked) {
            permissao = "ADMINISTRADOR"
        }
        setNovoFuncionario({ ...novoFuncionario, permissao: permissao });
    };

    const adicionarFunc = () => {

        const validarEmail = (email) => {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regexEmail.test(email);
        };

        const emailValido = validarEmail(novoFuncionario.email);

        if (novoFuncionario.nome.length >= 3 && emailValido) {
            api.post(`/funcionarios`, novoFuncionario, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
                .then(response => {

                    console.log("Novo funcionário adicionado:", response.data);
                    window.location.reload();
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Erro',
                        text: 'Email já cadastrado',
                        icon: 'error',
                        timer: 1800,
                        showConfirmButton: false,
                    });
                });
        } else {
            Swal.fire({
                title: 'Atenção',
                text: 'Nome do funcionário ou e-mail estão inválidos',
                icon: 'warning',
                timer: 1800,
                showConfirmButton: false,
            });
        }
    };

    const handleCliqueForaModal = (event) => {
        if (event.target === event.currentTarget) {
            handleFecharModal();
        }
    };

    return (
        <div className={style.fundo_modal} onClick={handleCliqueForaModal}>
            <section className={style.card}>
                <img onClick={handleFecharModal} src={x} alt="Sair" className={style.x} />
                <h1 className={style.titulo}>Adicionar Funcionário</h1>
                <section className={style.container_itens}>
                    <div className={style.item}>
                        <img src={user} alt="Icone de usuario" />
                        <input
                            type="text"
                            placeholder="Nome e sobrenome"
                            value={novoFuncionario.nome}
                            onChange={handleNomeChange}
                        />
                    </div>
                    <div className={style.item}>
                        <img src={icon_email} alt="Icone de usuario" />
                        <input
                            type="email"
                            placeholder="funcionario@mail.com"
                            value={novoFuncionario.email}
                            onChange={handleEmailChange}
                        />
                    </div>
                </section>
                <h1 className={style.subtitulo}>Conceder Permissão:</h1>
                <div className={style.container_permissao}>
                    <label>
                        <input
                            type="checkbox"
                            onChange={handlePermissaoChange}
                        />
                        <span className={style.adm}>Administrador</span>
                    </label>
                </div>
                <div className={style.informativo}>
                    <p>A permissão de administrador permite que o usuário tenha acesso à manipulação dos funcionários atrelados à empresa.</p>
                </div>
                <div className={style.botoes}>
                    <button onClick={handleFecharModal} className={style.cancelar}>
                        Cancelar
                    </button>
                    <button className={style.confirmar} onClick={adicionarFunc}>
                        Confirmar
                    </button>
                </div>
            </section>
        </ div>
    );
}

export default AdicionarFuncionario;