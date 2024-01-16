import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import HeaderCliente from "../../components/Cliente/HeaderCliente/HeaderCliente";
import iconeCarne from "../../assets/Institucional/Cadastro/iconeCarne.svg";
import iconePeixe from "../../assets/Institucional/Cadastro/iconePeixe.svg";
import iconeRelogio from "../../assets/Institucional/Cadastro/iconeRelogio.svg";
import iconeSuco from "../../assets/Institucional/Cadastro/iconeSuco.svg";
import iconePlanta from "../../assets/Institucional/Cadastro/iconePlanta.svg";
import iconeMaca from "../../assets/Institucional/Cadastro/iconeMaca.svg";
import styles from "./MeuPlano.module.css";
import api from "../../api/api";
import AlertaClienteInativo from "../../components/Cliente/AlertaClienteInativo";

function MeuPlano() {

    const [isEditing, setIsEditing] = useState(false);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [pessoasSelecionadas, setPessoasSelecionadas] = useState(0);
    const [refeicoesSelecionadas, setRefeicoesSelecionadas] = useState(0);
    const [diasSelecionados, setDiasSelecionados] = useState(0);
    const [diaSemanaSelecionado, setDiaSemanaSelecionado] = useState(0);
    const [selectedTime, setSelectedTime] = useState("");
    const [error, setError] = useState("");
    const [isAtivo, setAtivo] = useState(sessionStorage.getItem('isAtivo'));
    const [permissao, setPermissao] = useState(sessionStorage.getItem('permissao'));
    const [planId, setPlanId] = useState("");
    const [categoriasSelecionadasAntigas, setCategoriasSelecionadasAntigas] = useState([]);
    const [plano, setPlano] = useState([]);
    const [highestValorCategoria, setHighestValorCategoria] = useState(1);
    const [novoValorPlano, setNovoValorPlano] = useState(pessoasSelecionadas * refeicoesSelecionadas * diasSelecionados * 4 * highestValorCategoria);

    useEffect(() => {
        buscarPlano();
        buscarCategorias();
        buscarCategoriasPlano();
    }, []);
    
    useEffect(() => {
        console.log("Categorias Selecionadas:", categoriasSelecionadas);
        highestCategoria();
    }, [categoriasSelecionadas, pessoasSelecionadas, refeicoesSelecionadas, diasSelecionados]);
    
    useEffect(() => {
        console.log("Valor Plano:", categoriasSelecionadas);
        atualizarValorPlano();
    }, [categoriasSelecionadas, pessoasSelecionadas, refeicoesSelecionadas, diasSelecionados, highestValorCategoria]);

    const atualizarValorPlano = () => {
        setNovoValorPlano(pessoasSelecionadas * refeicoesSelecionadas * diasSelecionados * 4 * highestValorCategoria);
    }
    
    const highestCategoria = () => {
        const valoresCategorias = categoriasSelecionadas.map(
            (categoria) => categoria.valor
        );
        const highestValorCategoria = valoresCategorias.length > 0 ? Math.max(...valoresCategorias) : 0;
        setHighestValorCategoria(highestValorCategoria);
        console.log("maior valor categoria", highestValorCategoria);
    };    

    const handlePreferencias = (preferencia) => {
        const isCategoriaSelected = categoriasSelecionadas.some(
            (selectedCategoria) => selectedCategoria.id === preferencia.id
        );

        if (isCategoriaSelected) {
            setCategoriasSelecionadas((prevCategorias) =>
                prevCategorias.filter((categoria) => categoria.id !== preferencia.id)
            );
        } else {
            setCategoriasSelecionadas((prevCategorias) => [...prevCategorias, preferencia]);
        }
    };


    const buscarCategorias = () => {
        api
            .get(`/categorias`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Resposta", response);
                setCategorias(response.data)
                setCategoriasSelecionadasAntigas(response.data)
            })
            .catch((erro) => {
                console.log("Erro", erro);
            });
    }

    const diasSemanaData = [
        {
            label: "S",
            data: "SEGUNDA",
        },
        {
            label: "T",
            data: "TERCA",
        },
        {
            label: "Q",
            data: "QUARTA",
        },
        {
            label: "Q",
            data: "QUINTA",
        },
        {
            label: "S",
            data: "SEXTA",
        },
    ];

    const createNumberArray = (n) => {
        return Array.from({ length: n }, (_, i) => i + 1);
    };

    const pessoasData = createNumberArray(8);
    const refeicoesData = createNumberArray(6);
    const diasData = createNumberArray(7);

    const horariosData = [
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00"
    ];

    const splitCategorias = categorias.reduce((result, item, index) => {
        if (index % 3 === 0) {
            result.push([item]);
        } else {
            result[result.length - 1].push(item);
        }
        return result;
    }, []);

    const handlePessoas = (count) => {
        setPessoasSelecionadas(count);
    };

    const handleRefeicoes = (count) => {
        setRefeicoesSelecionadas(count);
    };

    const handleDias = (count) => {
        setDiasSelecionados(count);
    };

    const handleDiaSemana = (dia) => {
        setDiaSemanaSelecionado(dia.data);
    };

    const validateConstants = () => {
        if (
            !Array.isArray(categoriasSelecionadas) ||
            categoriasSelecionadas.length === 0 ||
            pessoasSelecionadas === 0 ||
            refeicoesSelecionadas === 0 ||
            diasSelecionados === 0 ||
            diaSemanaSelecionado === 0 ||
            selectedTime === ""
        ) {
            setError("Selecione suas preferências e complete o seu plano");
            return false;
        }
        setError("");
        return true;
    };

    const buscarPlano = () => {
        api
            .get(`/planos/${sessionStorage.getItem('idUsuario')}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Resposta", response);
                setPessoasSelecionadas(response.data.qtdPessoas);
                setRefeicoesSelecionadas(response.data.qtdRefeicoesDia);
                setDiasSelecionados(response.data.qtdDiasSemana);
                setDiaSemanaSelecionado(response.data.diaSemana);
                setSelectedTime(response.data.horaEntrega);
                setPlanId(response.data.id);
                setPlano(response.data);

                buscarCategoriasPlano();
            })
            .catch((erro) => {
                console.log("Erro", erro);
            });
    };

    const buscarCategoriasPlano = () => {
        api
            .get(`/planos/categorias/${sessionStorage.getItem('idUsuario')}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Categorias Plano: ", response.data);

                const categorias = response.data.map(item => item.categoria);

                console.log("CATEGORIAS SELECIONADAS", categorias)

                setCategoriasSelecionadas(categorias);
            })
            .catch((erro) => {
                console.log("Erro", erro);
            })
    };


    const atualizarPlano = async () => {
        if (validateConstants()) {
            try {
    
                const responsePlano = await api.put(
                    `/planos/${sessionStorage.getItem("idUsuario")}`,
                    {
                        qtdPessoas: pessoasSelecionadas,
                        qtdRefeicoesDia: refeicoesSelecionadas,
                        valorPlano: novoValorPlano,
                        valorAjuste: 0.0,
                        qtdDiasSemana: diasSelecionados,
                        horaEntrega: selectedTime,
                        diaSemana: diaSemanaSelecionado,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                        },
                    }
                );

                const planoId = responsePlano.data.id;
                window.location.reload();

                // const categoriasAtuais = categoriasSelecionadas.map(categoria => categoria.id);

                // const categoriasNovas = categoriasAtuais.filter(categoria => !categoriasSelecionadasAntigas.includes(categoria));
                // const categoriasRemovidas = categoriasSelecionadasAntigas.filter(categoria => !categoriasAtuais.includes(categoria));

                // if (categoriasNovas.length > 0) {
                //     const newPlanoCategorias = {
                //         planoId,
                //         categoriaId: categoriasNovas,
                //     };

                //     await api.post(
                //         `/planos/categorias`,
                //         newPlanoCategorias,
                //         {
                //             headers: {
                //                 Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                //             },
                //         }
                //     );
                // }

                // for (const categoriaId of categoriasRemovidas) {
                //     await api.delete(
                //         `/planos/categorias/${categoriaId}`,
                //         {
                //             headers: {
                //                 Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                //             },
                //         }
                //     );
                // }

                console.log("Plano atualizado com sucesso!");
            } catch (error) {
                console.error("Erro", error);
            }
        }
    };



    const cancelarEdicao = () => {
        window.location.reload();
    }

    const getIconByCategoriaNome = (nome) => {
        switch (nome) {
            case "Carnes":
                return iconeCarne;
            case "Pescetariano":
                return iconePeixe;
            case "Rápido e Fácil":
                return iconeRelogio;
            case "Vegetariano":
                return iconeSuco;
            case "Vegano":
                return iconePlanta;
            case "Fit e Saudável":
                return iconeMaca;
            default:
                return "";
        }
    };


    return (
        <>
            <div className="flex flex-col">
                <HeaderCliente />
                <AlertaClienteInativo permissao={permissao} />
                <div className={`bg ${styles.bg} mt-10 mb-10`}>
                    <div className={`card ${styles.card} flex relative`}>
                        {!isEditing && (
                            <FiEdit
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer text-[#DC7726] text-2xl absolute top-10 right-14 z-20"
                            />
                        )}
                        {!isEditing && (
                            <div className="flex absolute w-full h-full bg-transparent z-10"></div>
                        )}
                        <div className="flex flex-col w-full items-center">
                            <div className="flex items-center">
                                <h2 className="text-[#045D53] font-semibold text-2xl mb-2 mt-8">Meu Plano</h2>
                            </div>
                            <div className="flex mt-4 mb-4">
                                <div className="px-8 ml-12 mr-12">
                                    <h3 className="text-center font-semibold">Categorias</h3>
                                    <div className="flex w-full items-center justify-center">
                                        {splitCategorias.map((columnData, columnIndex) => (
                                            <div className="flex-col items-center justify-center" key={columnIndex}>
                                                {columnData.map((categoria, index) => (
                                                    <div
                                                        key={index}
                                                        className={`card ${styles.card_plano} flex-col items-center justify-center ${categoriasSelecionadas.some((selectedCategoria) => selectedCategoria.id === categoria.id)
                                                            ? styles.card_plano_selecionado
                                                            : ''
                                                            }`}
                                                        onClick={() => handlePreferencias(categoria)}
                                                    >
                                                        <img
                                                            src={getIconByCategoriaNome(categoria.nome)}
                                                            className="mx-auto my-auto w-10"
                                                            alt={categoria.nome}
                                                        />
                                                        <div className={`${styles.texto_card_plano}`}>{categoria.nome}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="flex-col items-center justify-center px-8">
                                    <h3 className="text-center font-semibold mb-4">Quantidades</h3>
                                    <div>
                                        <div className="flex justify-between items-center mb-4" >
                                            <div className="mr-2">Pessoas</div>
                                            <div className="flex">
                                                {pessoasData.map((count, index) => (
                                                    <div
                                                        key={count}
                                                        className={`card flex-col items-center justify-center ${index === 0 ? styles.customizacao_plano_comeco : ''} ${index === pessoasData.length - 1 ? styles.customizacao_plano_fim : ''} ${pessoasSelecionadas === count ? styles.customizacao_plano_selecionado_pontas : ''
                                                            } ${pessoasSelecionadas !== count && index !== 0 && index !== pessoasData.length - 1 ? styles.customizacao_plano : ''
                                                            }`}
                                                        onClick={() => handlePessoas(count)}
                                                    >
                                                        {count}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="mr-2">Refeições por dia</div>
                                            <div className="flex">
                                                {refeicoesData.map((count, index) => (
                                                    <div
                                                        key={count}
                                                        className={`card flex-col items-center justify-center ${index === 0 ? styles.customizacao_plano_comeco : ''} ${index === refeicoesData.length - 1 ? styles.customizacao_plano_fim : ''} ${refeicoesSelecionadas === count ? styles.customizacao_plano_selecionado_pontas : ''
                                                            } ${refeicoesSelecionadas !== count && index !== 0 && index !== refeicoesData.length - 1 ? styles.customizacao_plano : ''
                                                            }`}
                                                        onClick={() => handleRefeicoes(count)}
                                                    >
                                                        {count}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="mr-2">Dias por semana</div>
                                            <div className="flex">
                                                {diasData.map((count, index) => (
                                                    <div
                                                        key={count}
                                                        className={`card flex-col items-center justify-center ${index === 0 ? styles.customizacao_plano_comeco : ''} ${index === diasData.length - 1 ? styles.customizacao_plano_fim : ''} ${diasSelecionados === count ? styles.customizacao_plano_selecionado_pontas : ''} ${diasSelecionados !== count && index !== 0 && index !== diasData.length - 1 ? styles.customizacao_plano : ''}`}
                                                        onClick={() => handleDias(count)}
                                                    >
                                                        {count}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="mr-2">Dia para entrega</div>
                                            <div className="flex">
                                                {diasSemanaData.map((dia) => (
                                                    <div
                                                        key={dia.data}
                                                        className={`card ${styles.dia_semana_plano} flex-col items-center justify-center ${diaSemanaSelecionado === dia.data ? styles.dia_semana_plano_selecionado : ''}`}
                                                        onClick={() => handleDiaSemana(dia)}
                                                    >
                                                        {dia.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="mr-2">Horário para entrega</div>
                                            <div className="flex">
                                                <select
                                                    className={`${styles.combobox_plano}`}
                                                    value={selectedTime}
                                                    onChange={(e) => setSelectedTime(e.target.value)}
                                                >
                                                    <option value="">Horário</option>
                                                    {horariosData.map((time, index) => (
                                                        <option key={index} value={time}>
                                                            {time}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <div style={{ color: "red" }}>
                                    {error}
                                </div>
                            )}
                            {isEditing && (
                                <>
                                    <div className="flex flex-col w-full items-center mt-4">
                                        <div className="flex flex-col items-center">
                                            <h2 className="text-[#045D53] font-semibold text-2xl mb-6">Checkout</h2>
                                        </div>
                                        <div className="flex">
                                            <div>
                                                <div className="flex-col">
                                                    <div className="flex justify-between mb-6">
                                                        <div className="mr-8">
                                                            + {pessoasSelecionadas * refeicoesSelecionadas * diasSelecionados * 4} Refeições por mês
                                                        </div>
                                                        <div>
                                                            R$ {novoValorPlano.toFixed(2).replace('.', ',')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`${styles.divisorTotalPreco}`}></span>
                                                <div className="flex justify-between mb-6 mt-2">
                                                    <div className="font-semibold">
                                                        Total à pagar
                                                    </div>
                                                    <div className="font-semibold">
                                                        R$ {novoValorPlano.toFixed(2).replace('.', ',')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-12 mt-4 mb-4">
                                        <button
                                            className={` bg-gray-400 ${styles.btnCadastroCancelar}`}
                                            onClick={cancelarEdicao}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className={`bg-[#F29311] ${styles.btnCadastro}`}
                                            onClick={atualizarPlano}
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default MeuPlano;