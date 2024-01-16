
import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import HeaderFornecedor from '../../../components/Fornecedor/HeaderFornecedor/HeaderFornecedor';
import style from './EditarReceita.module.css';
import trash from '../../../assets/Fornecedor/Receitas/trash.svg';
import { FaUpload } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import ModalPreferencias from '../../../components/Fornecedor/ModalPreferencias/ModalPreferencias';
import ModalCategorias from '../../../components/Fornecedor/ModalCategorias/ModalCategorias';
import { useNavigate } from "react-router-dom";

function EditarReceita() {

    const { id } = useParams();
    const [exibirModalPreferencias, setExibirModalPreferencias] = useState(false);
    const [exibirModalCategorias, setExibirModalCategorias] = useState(false);

    const [imagem, setImagem] = useState(null);
    const [categorias, setCategorias] = useState([])
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [preferencias, setPreferencias] = useState([])

    const [preferenciasSelecionadas, setPreferenciasSelecionadas] = useState([]);
    const navigate = useNavigate();

    const [receita, setReceita] = useState({
        nome: '',
        horas: '',
        minutos: '',
        qtdPorcoes: '',
        descricao: '',
        ingredientes: [{
            quantidade: '',
            unidade: '',
            nome: ''
        }],
        modoPreparo: [{
            passo: ''
        }],
    });

    console.log(receita)

    const atualizarCategoriasSelecionadas = (categorias) => {
        setCategoriasSelecionadas(categorias);
    };

    const atualizarPreferenciasSelecionadas = (preferencias) => {
        setPreferenciasSelecionadas(preferencias);
    };

    const handleFileUploadClick = () => {
        document.getElementById('seuInputFile').click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log('Arquivo selecionado:', selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagem(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const adicionarPasso = () => {
        setReceita((prevState) => ({
            ...prevState,
            modoPreparo: [...prevState.modoPreparo, { passo: '' }],
        }));
    };

    const adicionarIngrediente = () => {
        setReceita((prevState) => ({
            ...prevState,
            ingredientes: [...prevState.ingredientes, { quantidade: '', unidade: '', nome: '' }],
        }));
    };

    const handleSubmit = (e) => {
        const corpoRequisicao = {
            nome: receita.nome,
            horas: receita.horas,
            minutos: receita.minutos,
            descricao: receita.descricao,
            qtdPorcoes: receita.qtdPorcoes,
            imagem: '',
            ingredientes: receita.ingredientes,
            modoPreparos: receita.modoPreparo,
            categorias: categoriasSelecionadas,
            preferencias: preferenciasSelecionadas
        };

        e.preventDefault();
        api.put(`/receitas/${id}`, corpoRequisicao, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
        })
            .then((response) => {
                console.log('Nova receita adicionada:', response.data);
                navigate("/fornecedor/receitas");
            })
            .catch((error) => {
                console.error('Erro ao adicionar receita:', error);
            });
        console.log('Esta é a receita', corpoRequisicao);
    };

    const buscarPreferencias = () => {
        api.get('/preferencias', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        }).then((response) => {
            setPreferencias(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const buscarReceita = () => {
        api.get(`/receitas/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        }).then((response) => {
            setReceita({
                nome: response.data.nome,
                horas: response.data.horas,
                minutos: response.data.minutos,
                qtdPorcoes: response.data.qtdPorcoes,
                descricao: response.data.descricao,
                ingredientes: response.data.ingredientes,
                modoPreparo: response.data.modoPreparos,
            });

            const categoriasDaReceita = response.data.categorias.map(categoria => categoria.categoria);
            setCategoriasSelecionadas(categoriasDaReceita);

            const preferenciasDaReceita = response.data.preferencias.map(preferencia => preferencia.preferencia);
            setPreferenciasSelecionadas(preferenciasDaReceita);
        }).catch((error) => {
            console.log(error);
        });
    };

    const buscarCategorias = () => {
        api.get('/categorias', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        }).then((response) => {
            setCategorias(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleInputChange = (index, field, value, arrayField) => {
        setReceita((prevState) => {
            const newArrayField = [...prevState[arrayField]];
            newArrayField[index][field] = value;
            return { ...prevState, [arrayField]: newArrayField };
        });
    };

    const removerIngrediente = (index) => {
        if (receita.ingredientes.length > 1) {
            setReceita((prevState) => {
                const novosIngredientes = prevState.ingredientes.filter((_, i) => i !== index);
                return { ...prevState, ingredientes: novosIngredientes };
            });
        }
    };

    const removerPasso = (index) => {
        if (receita.modoPreparo.length > 1) {
            setReceita((prevState) => {
                const novoModoPreparo = prevState.modoPreparo.filter((_, i) => i !== index);
                return { ...prevState, modoPreparo: novoModoPreparo };
            });
        }
    };


    const handleAbrirModalPreferencias = () => {
        setExibirModalPreferencias(true);
    };

    const handleFecharModalPreferencias = () => {
        setExibirModalPreferencias(false);
    };

    const handleAbrirModalCategorias = () => {
        setExibirModalCategorias(true);
    };

    const handleFecharModalCategorias = () => {
        setExibirModalCategorias(false);
    };

    useEffect(() => {
        buscarPreferencias();
        buscarCategorias();
        buscarReceita();
    }, []);

    return (
        <>
            <HeaderFornecedor />
            <section onSubmit={handleSubmit} className={style.body}>
                <div className={style.topo}>
                    <h1 className={`${style.titulo_pagina} mt-8 text-2xl`}>Editar Receita</h1>
                    <div className={style.linha_horizontal} />
                </div>
                <div className={style.container_imagem_titulo}>
                    <div className={style.container_imagem}>
                        <div className={style.icone_upload} onClick={handleFileUploadClick}>
                            <FaUpload size={25} color="rgba(0, 0, 0, 0.5)" />
                        </div>
                        {imagem && (
                            <div className={style.imagem}>
                                <img src={imagem} alt="Imagem selecionada" />
                            </div>
                        )}
                        <input
                            type="file"
                            id="seuInputFile"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png"
                        />
                    </div>
                    <div className={style.container_titulo_categoria}>
                        <label>
                            <span className=' text-base'>Titulo</span>
                            <input
                                className={style.input_titulo}
                                defaultValue={receita.nome}
                                onChange={(e) => setReceita({
                                    ...receita,
                                    nome: e.target.value,
                                })}
                            />
                        </label>
                        <label>
                            <span className=' text-base'>Descrição</span>
                            <textarea cols="30" rows="3"
                                // value={receita.descricao || ''}
                                defaultValue={receita.descricao}
                                onChange={(e) => setReceita({
                                    ...receita,
                                    descricao: e.target.value,
                                })}
                            />
                        </label>
                        <div className={style.container_categoria_preferencia}>
                            <div onClick={handleAbrirModalPreferencias} className={style.itens}>
                                <FaPlus /> ⠀
                                <b>Preferências: </b>
                                {preferenciasSelecionadas.slice(0, 1).map((preferencia, index) => (
                                    <React.Fragment key={index}>
                                        <span style={{ backgroundColor: '#' + preferencia.corFundo, color: '#' + preferencia.corTexto }} className={style.item}>{preferencia.nome}</span>
                                    </React.Fragment>
                                ))}
                                {preferenciasSelecionadas.length > 1 && (
                                    <span>⠀e⠀mais {preferenciasSelecionadas.length - 1}</span>
                                )}
                            </div>
                            <div onClick={handleAbrirModalCategorias} className={style.itens}>
                                <FaPlus /> ⠀
                                <b>Categorias:</b>
                                {categoriasSelecionadas.slice(0, 1).map((categoria, index) => (
                                    <React.Fragment key={index}>
                                        <span>{categoria.nome}</span>
                                    </React.Fragment>
                                ))}
                                {categoriasSelecionadas.length > 1 && (
                                    <span>⠀e⠀mais {categoriasSelecionadas.length - 1}</span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                <div className={style.container_medida_rendimento}>
                    <div className={style.container_rendimento_tempo}>
                        <div className={style.container_rendimento}>
                            <h1 className=' text-base'>Rendimento</h1>
                            <div className={style.rendimento}>
                                <span>Ingredientes para render</span>
                                <input
                                    type='number'
                                    value={receita.qtdPorcoes || ''}
                                    onChange={(e) => setReceita({
                                        ...receita,
                                        qtdPorcoes: e.target.value
                                    })}
                                    min={0}
                                />
                                <span>porções</span>
                            </div>
                        </div>
                        <div className={style.container_tempo}>
                            <h1 className=' text-base'>Tempo de preparo</h1>
                            <div className={style.tempo}>
                                <input
                                    type='number'
                                    // value={receita.horas || ''}
                                    defaultValue={receita.horas}
                                    onChange={(e) => setReceita({
                                        ...receita,
                                        horas: e.target.value
                                    })}
                                    min={0}
                                />
                                <span>Hora(s) e</span>
                                <input
                                    type='number'
                                    // value={receita.minutos || ''}
                                    defaultValue={receita.minutos}
                                    onChange={(e) => setReceita({
                                        ...receita,
                                        minutos: e.target.value,
                                    })}
                                    min={0}
                                />
                                <span>Minuto(s)</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.unidade_medida}>
                        <div className={style.titulos_medida}>
                            <h1 className={`${style.titulo_quantidade} text-base`}>Quantidade</h1>
                            <h1 className={`${style.titulo_unidade} text-base`}>Unidade</h1>
                            <h1 className={`${style.titulo_ingrediente} text-base`}>Ingrediente</h1>
                        </div>
                        {receita.ingredientes.map((ingrediente, index) => (
                            <div className={style.inputs_medida} key={index}>
                                <input
                                    type="number"
                                    value={ingrediente.quantidade || ''}
                                    className={style.input_quantidade}
                                    onChange={(e) => handleInputChange(index, 'quantidade', e.target.value, 'ingredientes')}
                                    min={0}
                                />
                                <select
                                    name="select"
                                    defaultValue={ingrediente.unidadeMedidaEnum || ''}
                                    className={style.input_unidade}
                                    onChange={(e) => handleInputChange(index, 'unidade', e.target.value, 'ingredientes')}
                                >
                                    <option value="">--</option>
                                    <option value="UNIDADE">Unidade</option>
                                    <option value="LITRO">Litro</option>
                                    <option value="KILO">Kilo</option>
                                    <option value="GRAMA">Grama</option>
                                    <option value="MILIGRAMA">Miligrama</option>
                                    <option value="MILILITRO">Mililitro</option>
                                    <option value="XICARA">Xicara</option>
                                    <option value="SEM_UNIDADE">Sem Unidade</option>
                                    <option value="COLHER_SOPA">Colher de sopa</option>
                                    <option value="COLHER_CHA">Colher de chá</option>
                                </select>
                                <input
                                    type="text"
                                    value={ingrediente.nome || ''}
                                    className={style.input_ingrediente}
                                    onChange={(e) => handleInputChange(index, 'nome', e.target.value, 'ingredientes')}
                                />
                                <img src={trash} className={style.icone} onClick={() => removerIngrediente(index)} alt="icone de lata de lixo" />
                            </div>
                        ))}

                        <button className={style.adicionar_ingrediente} onClick={adicionarIngrediente}>
                            Adicionar Ingrediente
                        </button>
                    </div>
                </div>
                <div className={style.container_modo_preparo}>
                    <h1 className={style.titulo_preparo}>Modo de preparo</h1>
                    {receita.modoPreparo.map((passo, index) => (
                        <div key={index}>
                            <div className={style.passo}>
                                <span>Passo {index + 1}</span>
                                <img src={trash} className={style.icone} onClick={() => removerPasso(index)} alt="icone de lata de lixo" />
                                <textarea cols="30" rows="3" value={passo.passo} onChange={(e) => handleInputChange(index, 'passo', e.target.value, 'modoPreparo')} />
                            </div>
                        </div>
                    ))}
                    <button className={style.adicionar_ingrediente} onClick={adicionarPasso}>
                        Adicionar passo
                    </button>
                </div>
                <div className={style.botoes}>
                    <button className={style.cancelar} onClick={() => navigate(-1)}> Cancelar </button>
                    <button onClick={handleSubmit} className={style.confirmar}>Confirmar</button>
                </div>
            </section>
            {exibirModalPreferencias && (
                <ModalPreferencias
                    handleFecharModal={handleFecharModalPreferencias}
                    preferencias={preferencias}
                    atualizarPreferenciasSelecionadas={atualizarPreferenciasSelecionadas}
                    listaPreferenciasSelecionadas={preferenciasSelecionadas}
                />
            )}
            {exibirModalCategorias && (
                <ModalCategorias
                    handleFecharModal={handleFecharModalCategorias}
                    categorias={categorias}
                    atualizarCategoriasSelecionadas={atualizarCategoriasSelecionadas}
                    listaCategoriasSelecionadas={categoriasSelecionadas}
                />
            )}
        </>
    );
}

export default EditarReceita;