import React, { useEffect, useState } from "react";
import style from "./Funcionarios.module.css";
import HeaderFornecedor from "../../../components/Fornecedor/HeaderFornecedor/HeaderFornecedor";
import AdicionarFuncionario from "../../../components/Fornecedor/AdicionarFuncionario/AdicionarFuncionario";
import ItemFuncionario from "../../../components/Fornecedor/Funcionario/ItemFuncionario";
import seta from "../../../assets/Institucional/Funcionarios/down.svg";
import buscar from "../../../assets/Institucional/Funcionarios/search.svg";
import api from "../../../api/api";
// import validator from 'validator';

function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [exibirModalAdicionar, setExibirModalAdicionar] = useState(false);
    const [novosFuncionarios, setNovosFuncionarios] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');

    const [arquivos, setArquivos] = useState([]);

    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

    useEffect(() => {
        listar();
    }, []);

    const handleArquivoChange = async (event) => {
        const arquivos = event.target.files;

        if (!arquivos || arquivos.length === 0) {
            alert("Selecione pelo menos um arquivo para fazer o upload.");
            return;
        }

        try {
            const formData = new FormData();

            // Iterar sobre todos os arquivos e adicioná-los ao FormData
            for (let i = 0; i < arquivos.length; i++) {
                formData.append("files", arquivos[i]);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                },
            };

            const response = await api.post(`/funcionarios/txt`, formData, config);
            console.log("Arquivos enviados com sucesso:", response.data);
            window.location.reload();
        } catch (error) {
            console.error("Erro ao enviar arquivos:", error);
        }
    };


    function listar() {
        api.get(`/funcionarios`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((respostaObtida) => {
                setFuncionarios(respostaObtida.data);
                console.log(respostaObtida.data);
            })
            .catch((erroOcorrido) => {
                console.log(erroOcorrido);
            });
    }

    const handleAbrirModalEdicao = (id) => {
        setFuncionarioSelecionado(id);
    };

    const handleAbrirModalAdicionar = () => {
        setExibirModalAdicionar(true);
    };

    const handleFecharModalAdicionar = () => {
        setExibirModalAdicionar(false);
    };

    const adicionarFuncionario = (novoFuncionario) => {
        setNovosFuncionarios([...novosFuncionarios, novoFuncionario]);
    };

    const handleBusca = (event) => {
        setTermoBusca(event.target.value);
    };

    const funcionariosFiltrados = Array.isArray(funcionarios)
        ? funcionarios.filter((funcionario) =>
            funcionario.nome.toLowerCase().includes(termoBusca.toLowerCase())
        )
        : [];

    return (
        <>
            <HeaderFornecedor />
            <div className={style.body}>
                <div className={style.conteudo}>
                    <div className={style.titulo}>
                        <h1>Funcionários</h1>
                    </div>
                    <div className={style.card}>
                        <div className={style.acoes}>
                            <button onClick={handleAbrirModalAdicionar}>
                                Adicionar Funcionário +
                            </button>
                            <div className={style.upload}>
                                <input type="file" multiple onChange={handleArquivoChange} accept="text/plain" className={style.upload_input} />
                            </div>
                            <div className={style.input_buscar}>
                                <input type="text" value={termoBusca} onChange={handleBusca} placeholder="Pesquise Aqui..." />
                                <img src={buscar} />
                            </div>
                        </div>
                        <div className={style.titulos}>
                            <div className={style.item_nome}>
                                <b>Nome</b>
                                <img src={seta} />
                            </div>
                            <div className={style.item_email}>
                                <b>Email</b>
                                <img src={seta} />
                            </div>
                            <div className={style.item_permissao}>
                                <b>Permissão</b>
                                <img src={seta} />
                            </div>
                            <div className={style.item_icones} />
                        </div>
                        {funcionariosFiltrados.map((funcionario) => (
                            <ItemFuncionario
                                key={funcionario.id}
                                id={funcionario.id}
                                nome={funcionario.nome}
                                email={funcionario.email}
                                permissao={funcionario.permissao}
                                handleAbrirModalEdicao={handleAbrirModalEdicao}
                                funcionarioSelecionado={funcionarioSelecionado}
                            />
                        ))}
                    </div>
                </div>
                {exibirModalAdicionar && (
                    <AdicionarFuncionario
                        handleFecharModal={handleFecharModalAdicionar}
                        adicionarFuncionario={adicionarFuncionario}
                    />
                )}
            </div>
        </>
    );
}

export default Funcionarios;