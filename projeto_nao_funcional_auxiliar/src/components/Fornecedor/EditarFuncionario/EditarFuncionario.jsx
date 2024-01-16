import React, { useState } from "react";
import style from "./EditarFuncionario.module.css";
import x from "../../../assets/Institucional/Funcionarios/x.svg";
import user from "../../../assets/Institucional/Funcionarios/user.svg";
import icon_email from "../../../assets/Institucional/Funcionarios/email.svg";
import apiMock from "../../../api/mockapi";
import api from "../../../api/api";
import Swal from 'sweetalert2';

function EditarFuncionario({ id, nome, email, permissao, handleFecharModal }) {
    const [inputNome, setInputNome] = useState(nome);
    const [inputEmail, setInputEmail] = useState(email);
    const [inputPermissao, setInputPermissao] = useState(permissao);

    function atualizarFuncionario(id) {
        const corpoRequisicao = {
            nome: inputNome,
            email: inputEmail,
            permissao: inputPermissao,
        };

        const validarEmail = (email) => {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regexEmail.test(email);
        };

        const emailValido = validarEmail(corpoRequisicao.email);

        if (corpoRequisicao.nome.length >= 3 && emailValido) {
            api.put(`funcionarios/${id}`, corpoRequisicao, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
                .then((response) => {
                    console.log("Resposta", response);
                    handleFecharModal();
                    window.location.reload();
                })
                .catch((erro) => {
                    console.log("Erro", erro);
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
    }

    const handleCliqueForaModal = (event) => {
        if (event.target === event.currentTarget) {
            handleFecharModal();
        }
    };

    return (
        <div className={style.fundo_modal} onClick={handleCliqueForaModal}>
            <section className={style.card}>
                <img onClick={handleFecharModal} src={x} alt="Sair" className={style.x} />
                <h1 className={style.titulo}>Editar Funcionário</h1>
                <section className={style.container_itens}>
                    <div className={style.item}>
                        <img src={user} alt="Icone de usuario" />
                        <input
                            type="text"
                            defaultValue={nome}
                            onChange={(e) => {
                                setInputNome(e.target.value);
                            }}
                        />
                    </div>
                    <div className={style.item}>
                        <img src={icon_email} alt="Icone de usuario" />
                        <input
                            type="text"
                            defaultValue={email}
                            onChange={(e) => {
                                setInputEmail(e.target.value);
                            }}
                        />
                    </div>
                </section>
                <h1 className={style.subtitulo}>Conceder Permissão:</h1>
                <div className={style.container_permissao}>
                    <label>
                        <input
                            type="radio"
                            value="ADMINISTRADOR"
                            checked={inputPermissao === "ADMINISTRADOR"}
                            onChange={() => {
                                setInputPermissao("ADMINISTRADOR");
                            }}
                        />
                        <span className={style.adm}>Administrador</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="FUNCIONARIO"
                            checked={inputPermissao === "FUNCIONARIO"}
                            onChange={() => {
                                setInputPermissao("FUNCIONARIO");
                            }}
                        />
                        <span className={style.adm}>Comum</span>
                    </label>
                </div>
                <div className={style.informativo}>
                    <p>A permissão de administrador permite que o usuário tenha acesso à manipulação dos funcionários atrelados à empresa.</p>
                </div>
                <div className={style.botoes}>
                    <button onClick={handleFecharModal} className={style.cancelar}>Cancelar</button>
                    <button className={style.confirmar} onClick={() => {
                        atualizarFuncionario(id);
                    }}>Confirmar</button>
                </div>
            </section>
        </ div>
    );
}

export default EditarFuncionario;
