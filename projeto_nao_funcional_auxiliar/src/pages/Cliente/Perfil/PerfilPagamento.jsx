import React, { useState, useEffect } from "react";
import HeaderCliente from "../../../components/Cliente/HeaderCliente/HeaderCliente";
import SidebarPerfil from "../../../components/Cliente/Perfil/SidebarPerfil";
import { useNavigate } from 'react-router-dom';
import api from "../../../api/api";
import Swal from "sweetalert2";

function PerfilPagamento() {

    const navigate = useNavigate();

    const [plano, setPlano] = useState("");
    const [statusPlano, setStatusPlano] = useState("");
    const [pagamento, setPagamento] = useState("");

    useEffect(() => {
        if (sessionStorage.getItem('permissao') == null || sessionStorage.getItem('permissao') == '') {
            navigate('/')
        } else if (sessionStorage.getItem('permissao') == 'USUARIO') {
            navigate('/cadastro/endereco')
        }
        buscarPlano();
        buscarPagamento();
    }, []);

    const buscarPlano = () => {
        api.get(`/planos/${sessionStorage.getItem('idUsuario')}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                setPlano(response.data);
                setStatusPlano(response.data.isAtivo);
            }).catch((error) => {
                console.log(error);
            });
    }

    const buscarPagamento = () => {
        api.get(`/pagamentos/${sessionStorage.getItem('idUsuario')}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                setPagamento(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    const cancelarAssinatura = () => {
        api.delete(`/pagamentos/assinatura/${plano.id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                Swal.fire({
                    title: "Assinatura cancelada com sucesso!",
                    confirmButtonColor: "#F29311",
                });

                setTimeout(() => {
                    window.location.reload();
                }
                    , 2000);

            }).catch((error) => {
                console.log(error);
            });
    }

    const desativarPlanoPagamento = () => {
        api.delete(`/pagamentos/plano/${plano.id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                cancelarAssinatura();
            }).catch((error) => {
                console.log(error);
            });
    }

    const desativarPlano = () => {
        const corpoRequisicao = {
            qtdPessoas: plano.qtdPessoas,
            qtdRefeicoesDia: plano.qtdRefeicoesDia,
            valorPlano: plano.valorPlano,
            valorAjuste: plano.valorAjuste,
            qtdDiasSemana: plano.qtdDiasSemana,
            horaEntrega: plano.horaEntrega,
            isAtivo: 'INATIVO',
            diaSemana: plano.diaSemana,
        }
        api.put(`/planos/${sessionStorage.getItem('idUsuario')}`, corpoRequisicao, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                desativarPlanoPagamento();
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    const ativarPagamento = () => {
        api.post(`/pagamentos/solicitar/${sessionStorage.getItem('idUsuario')}`, null, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {

                console.log(response)

            }).catch((error) => {
                console.log(error);
            });
    }

    const ativarPlano = () => {
        const corpoRequisicao = {
            qtdPessoas: plano.qtdPessoas,
            qtdRefeicoesDia: plano.qtdRefeicoesDia,
            valorPlano: plano.valorPlano,
            valorAjuste: plano.valorAjuste,
            qtdDiasSemana: plano.qtdDiasSemana,
            horaEntrega: plano.horaEntrega,
            isAtivo: 'ATIVO',
            diaSemana: plano.diaSemana,
        }
        api.put(`/planos/${sessionStorage.getItem('idUsuario')}`, corpoRequisicao, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                ativarPagamento();
                console.log(response);

                
                Swal.fire({
                    title: "Assinatura ativada com sucesso!",
                    confirmButtonColor: "#F29311",
                });

                setTimeout(() => {
                    window.location.reload();
                }
                    , 2000);

                    
            }).catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <HeaderCliente />
            <div className="flex h-screen">
                <SidebarPerfil nome={sessionStorage.getItem('nome')} />
                <div className="flex-grow p-6 flex items-start justify-center mt-12">
                    <div className="flex-col justify-center items-center w-full max-w-lg bg-white p-6 rounded-lg filter drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))">
                        <div className="w-full flex-col items-center justify-center">
                            <h1 className="text-[#DC7726] font-bold text-2xl mb-2 flex justify-center items-center w-full">
                                Pagamento
                            </h1>
                            {statusPlano === "ATIVO" ? (
                                <span>
                                    <p className="text-[#DC7726] font-medium mt-8 mb-6">
                                        Status Plano: {statusPlano}
                                    </p>
                                    <a
                                        className="text-[#00AE9E] font-medium mt-8 mb-8"
                                        href={pagamento.linkCobranca}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ wordWrap: "break-word" }}
                                    >
                                        Link Cobrança: {pagamento.linkCobranca}
                                    </a>
                                </span>
                            ) : (
                                <p className="text-[#DC7726] font-medium mt-8 mb-6">
                                    Status Plano: {statusPlano}
                                </p>
                            )}
                            {statusPlano == "ATIVO" ? <span>
                                <p className="mt-4 mb-4">
                                    Para cancelar sua assinatura, basta clicar na opção de cancelamento. Caso mude de ideia no futuro, a opção para reativar a assinatura estará disponível, permitindo que retorne ao seu plano anterior.
                                </p>
                                <span className="w-full flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={desativarPlano}
                                        className="border border-gray-300 rounded-md px-3 py-1 bg-[#DC7726] hover-bg-[#ba5a0d] text-white">
                                        Cancelar Assinatura
                                    </button>
                                </span>
                            </span> : <span>
                                <p className="mt-4 mb-4">
                                    Reative o seu pagamento e retorne ao seu plano anterior.
                                </p>
                                <span className="w-full flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={ativarPlano}
                                        className="border border-gray-300 rounded-md px-3 py-1 bg-[#DC7726] hover-bg-[#ba5a0d] text-white">
                                        Renovar Assinatura
                                    </button>
                                </span>
                            </span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PerfilPagamento;