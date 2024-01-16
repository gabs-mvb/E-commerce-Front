import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CadastroPassos from "../../../components/Institucional/Cadastro/CadastroPassos";
import HeaderCliente from "../../../components/Cliente/HeaderCliente/HeaderCliente";
import styles from "./CadastroStyles.module.css";
import api from "../../../api/api";
import Swal from "sweetalert2";

function Checkout() {

    const navigate = useNavigate();

    const [endereco, setEndereco] = useState([]);
    const [plano, setPlano] = useState([]);
    const [precoMes, setPrecoMes] = useState([]);

    useEffect(() => {
        buscarEnderecoUsuario();
        buscarPlanoUsuario();
    }, []);

    const buscarEnderecoUsuario = () => {
        api
            .get(`/enderecos/usuarios/${sessionStorage.getItem("idUsuario")}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                setEndereco(response.data[0].endereco);
                console.log("ENDERECO:", response)
            })
            .catch((erro) => {
                console.log("Erro", erro);
            });
    }

    const buscarPlanoUsuario = () => {
        api
            .get(`/planos/${sessionStorage.getItem("idUsuario")}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log(response.data)
                setPlano(response.data);
            })
            .catch((erro) => {
                console.log("Erro", erro);
            });
    }

    const checkout = () => {
        api
            .put(`/usuarios/permissionar/cliente/${sessionStorage.getItem("idUsuario")}`, null, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Resposta", response);
                sessionStorage.setItem('permissao', response.data.permissao)
                criarPagamentoUsuario();

            })
            .catch((erro) => {
                console.log("Erro ", erro);
            });
    }

    const criarPagamentoUsuario = () => {
        api
            .post(`/pagamentos/solicitar/${sessionStorage.getItem("idUsuario")}`, null, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Resposta Pagamento: ", response);
                Swal.fire({
                    title: "Checkout realizado com sucesso!",
                    confirmButtonColor: "#F29311",
                });

                window.open(`${response.data.linkCobranca}`, '_blank');

                setTimeout(() => {
                    navigate('/cliente/pedidos');
                }, 2000);

            })
            .catch((erro) => {
                console.log("Erro ", erro);
                Swal.fire({
                    title: "Erro ao realizar o checkout! Confira se as informações inseridas são válidas.",
                    confirmButtonColor: "#F29311",
                });
            });
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                <HeaderCliente />
                <CadastroPassos corPlano="#F29311" corCheckout="#F29311" />
                <div className={`bg ${styles.bg}`}>
                    <div className={`card ${styles.card} flex`}>
                        <div className="flex flex-col w-full items-center">
                            <div className="flex flex-col items-center">
                                <h2 className="text-[#DC7726] font-bold text-2xl mb-8">Checkout</h2>
                            </div>
                            <div className="flex">
                                <div>
                                    <div className="flex justify-between mb-6">
                                        <div className="mr-8">
                                            + {plano.qtdDiasSemana * plano.qtdPessoas * plano.qtdRefeicoesDia * 4} Refeições por mês
                                        </div>
                                        <div>
                                            R$ {plano.valorPlano ? plano.valorPlano.toFixed(2).replace('.', ',') : '500,00'}
                                        </div>
                                    </div>
                                    <span className={`${styles.divisorTotalPreco}`}></span>
                                    <div className="flex justify-between mb-6 mt-2">
                                        <div className="font-semibold">
                                            Total à pagar
                                        </div>
                                        <div className="font-semibold">
                                            R$ {plano.valorPlano ? plano.valorPlano.toFixed(2).replace('.', ',') : '500,00'}
                                        </div>
                                    </div>
                                </div>
                                <span className={`${styles.divisor} ml-6 mr-6`}></span>
                                <div className="flex-col">
                                    <div className="flex-col mt-4">
                                        <div className="font-medium">
                                            Destinatário
                                        </div>
                                        <div>
                                            {sessionStorage.getItem('nome')}
                                        </div>
                                    </div>
                                    <div className="flex-col mt-4">
                                        <div className="font-medium">
                                            Endereço de Entrega
                                        </div>
                                        <div>
                                            {`${endereco.logradouro}, ${endereco.numero}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`bg-[#F29311] ${styles.btnCadastro} mt-8`}
                                onClick={checkout}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout;
