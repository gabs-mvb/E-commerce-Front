import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CadastroPassos from "../../../components/Institucional/Cadastro/CadastroPassos";
import HeaderCliente from "../../../components/Cliente/HeaderCliente/HeaderCliente";
import iconeCarne from "../../../assets/Institucional/Cadastro/iconeCarne.svg";
import iconePeixe from "../../../assets/Institucional/Cadastro/iconePeixe.svg";
import iconeRelogio from "../../../assets/Institucional/Cadastro/iconeRelogio.svg";
import iconeSuco from "../../../assets/Institucional/Cadastro/iconeSuco.svg";
import iconePlanta from "../../../assets/Institucional/Cadastro/iconePlanta.svg";
import iconeMaca from "../../../assets/Institucional/Cadastro/iconeMaca.svg";
import styles from "./CadastroStyles.module.css";
import api from "../../../api/api";

function Plano() {

    const navigate = useNavigate();

    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [pessoasSelecionadas, setPessoasSelecionadas] = useState(0);
    const [refeicoesSelecionadas, setRefeicoesSelecionadas] = useState(0);
    const [diasSelecionados, setDiasSelecionados] = useState(0);
    const [diaSemanaSelecionado, setDiaSemanaSelecionado] = useState(0);
    const [selectedTime, setSelectedTime] = useState("");
    const [highestValorCategoria, setHighestValorCategoria] = useState(1);
    const [error, setError] = useState("");
    const [novoValorPlano, setNovoValorPlano] = useState(pessoasSelecionadas * refeicoesSelecionadas * diasSelecionados * 4 * highestValorCategoria);


    useEffect(() => {
        buscarPlanoUsuario();
        buscarCategorias();
    }, []);

    useEffect(() => {
        console.log("Categorias Selecionadas:", categoriasSelecionadas);
        highestCategoria();
    }, [categoriasSelecionadas, pessoasSelecionadas, refeicoesSelecionadas, diasSelecionados]);
    
    useEffect(() => {
        console.log("Valor Plano:", categoriasSelecionadas);
        atualizarValorPlano();
    }, [categoriasSelecionadas, pessoasSelecionadas, refeicoesSelecionadas, diasSelecionados, highestValorCategoria]);

    const handlePreferencias = (preferencia) => {
        if (categoriasSelecionadas.includes(preferencia)) {
            setCategoriasSelecionadas(categoriasSelecionadas.filter((item) => item !== preferencia));
        } else {
            setCategoriasSelecionadas([...categoriasSelecionadas, preferencia]);
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

    const splitCategorias = categorias && Array.isArray(categorias) ? categorias.reduce((result, item, index) => {
        if (index % 3 === 0) {
            result.push([item]);
        } else {
            result[result.length - 1].push(item);
        }
        return result;
    }, []) : [];

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
            categoriasSelecionadas === "" ||
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
      

    const cadastrarPlano = async () => {
        if (validateConstants()) {
            try {

                const responsePlano = await api.post(
                    `/planos/${sessionStorage.getItem("idUsuario")}`,
                    {
                        categoria: categoriasSelecionadas,
                        qtdPessoas: pessoasSelecionadas,
                        qtdRefeicoesDia: refeicoesSelecionadas,
                        valorPlano: novoValorPlano,
                        valorAjuste: 0,
                        qtdDiasSemana: diasSelecionados,
                        horaEntrega: selectedTime,
                        isAtivo: 'ATIVO',
                        diaSemana: diaSemanaSelecionado,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                        },
                    }
                );
    
                const planoId = responsePlano.data.id;
    
                const categoriaIds = categoriasSelecionadas.map(categoria => ({ idCategoria: categoria.id }));
    
                const responsePlanoCategoria = await api.post(
                    '/planos/categorias',
                    { planoId, categoriaId: categoriaIds },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                        },
                    }
                );
    
                console.log("Resposta Plano Categorias", responsePlanoCategoria);
    
                navigate('/cadastro/checkout');
            } catch (error) {
                console.error("Erro", error);
            }
        }
    };    

    const buscarPlanoUsuario = () => {
        api
            .get(`/planos/${sessionStorage.getItem("idUsuario")}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Usuário já possui plano cadastrado: ", response);
                navigate('/cadastro/checkout');
            })
            .catch((erro) => {
                console.log("Usuário ainda não possui um plano. ", erro);
            });
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
            <div className="flex flex-col h-screen">
                <HeaderCliente />
                <CadastroPassos corPlano="#F29311" corCheckout="#CCD7D6" />
                <div className={`bg ${styles.bg}`}>
                    <div className={`card ${styles.card} flex`}>
                        <div className="flex flex-col w-full items-center">
                            <div className="flex flex-col items-center">
                                <h2 className="text-[#DC7726] font-bold text-2xl mb-2">Personalize seu Plano!</h2>
                            </div>
                            <div className="flex mt-4 mb-4">
                                <div className="px-8 ml-12 mr-12">
                                    <h3 className="text-center">1. Selecione suas preferências</h3>
                                    <div className="flex w-full items-center justify-center">
                                        {splitCategorias.map((columnData, columnIndex) => (
                                            <div className="flex-col items-center justify-center" key={columnIndex}>
                                                {columnData.map((categoria, index) => (
                                                    <div
                                                        key={index}
                                                        className={`card ${styles.card_plano} flex-col items-center justify-center ${categoriasSelecionadas.includes(categoria) ? styles.card_plano_selecionado : ''
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
                                <span className={`${styles.divisor}`}></span>
                                <div className="flex-col items-center justify-center px-8">
                                    <h3 className="text-center mb-4">2. Customize o seu plano</h3>
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
                            <button
                                type="submit"
                                className={`bg-[#F29311] ${styles.btnCadastro}`}
                                onClick={cadastrarPlano}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Plano;
