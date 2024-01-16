import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import api from "../../api/api";

import { toast } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";

import Swal from "sweetalert2";

import Header from "../../components/Institucional/Header/Header";
import imgLogin from "../../assets/Institucional/Login/imgLoginFunc.png"
import ondaSuperiorDireita from "../../assets/Institucional/Login/ondaSuperiorDireitaAzul.png"
import ondaInferiorEsquerda from "../../assets/Institucional/Login/ondaInferiorEsquerdaAzul.png"
import ondaInferiorDireita from "../../assets/Institucional/Login/ondaInferiorDireitaAzul.png"

import styles from "../Institucional/Login/LoginStyles.module.css";

function LoginFuncionario() {

    injectStyle();
    const navigate = useNavigate();

    const loginFunc = () => {
        navigate('/fornecedor/perfil/info-pessoal');
    }

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const alertaErro = () => {
        Swal.fire({
            icon: "error",
            iconColor: "#FF9F1C",
            title: "<b>Acesso Negado!</b>",
            text: "Confira suas credênciais",
            position: "center",
            confirmButtonColor: "#FF9F1C",
            footer: "Certifique-se de estar inserindo as credênciais de uma conta existente"
        })
    }

    const alertaErroInterno = () => {
        Swal.fire({
            icon: "error",
            title: "<b>Acesso Negado!</b>",
            text: "Verifique suas informações e tente novamente",
            position: "center",
        })
    }

    const login = async (e) => {

        e.preventDefault();

        api.post('/funcionarios/login', {
            email: email,
            senha: senha
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                console.log("Entrei no .then -> Login")
                if (response.status == 200 && response.data?.token) {

                    console.log("Entrei na validação de status do .then -> Login")

                    sessionStorage.setItem('authToken', response.data.token);
                    sessionStorage.setItem('nome', response.data.nome);
                    sessionStorage.setItem('funcId', response.data.userID);
                    sessionStorage.setItem('email', response.data.email);
                    sessionStorage.setItem('telefone', response.data.telefone)
                    sessionStorage.setItem('permissao', response.data.permissao);

                    console.log(response.data);

                    loginFunc();

                    toast.success('Login realizado com sucesso!');
                }
            })
            .catch(error => {
                console.log("Entrei no catch das validações -> Login")

                if (error.response.status == 401 || error.response.status == 403) {
                    console.log("Entrei na validação de status do catch-> Login")
                    alertaErro()

                } else {
                    console.log("STATUS DO ERRO: " + error.response.status)
                    console.error(error.message);

                    alertaErroInterno()
                }
            })
    }


    return (
        <>
            <div className="flex flex-col h-screen">
                <Header />
                <div className={styles.bodyLogin}>
                    <img src={ondaSuperiorDireita} className={styles.ondaSuperiorDireita} />
                    <img src={ondaInferiorEsquerda} className={styles.ondaInferiorEsquerda} />
                    <img src={ondaInferiorDireita} className={styles.ondaInferiorDireita} />
                    <div className={`${styles.containerCard} flex`}>
                        <img src={imgLogin} alt="Mulher cozinhando" />
                        <div className={`${styles.card_formulario} flex justify-center`}>
                            <p className="text-[#3D7872] text-3xl font-semibold">Boas vindas!</p>
                            <div className={styles.campo}>
                                <b>Email</b>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="user@mail.com"
                                    value={email}
                                    className={styles.input}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={styles.campo}>
                                <b>Senha</b>
                                <input
                                    type="password"
                                    placeholder="************"
                                    id="senha"
                                    value={senha}
                                    className={styles.input}
                                    onChange={(e) => {
                                        setSenha(e.target.value)
                                    }}
                                />
                            </div>
                            <span><input type="checkbox" /> Mantenha-me conectado</span>
                            <button type="submit" onClick={login}>Entrar</button>
                            <a href="/login" className={styles.esqueci_senha}>Login de Cliente</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LoginFuncionario;