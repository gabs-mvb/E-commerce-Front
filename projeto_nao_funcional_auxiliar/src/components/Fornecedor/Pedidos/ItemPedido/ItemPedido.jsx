import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import ModalPedido from '../ModalPedido/ModalPedido';
import style from './ItemPedido.module.css'

function ItemPedido({ id, usuario, logradouro, numero, data, qtdReceitas, qtdPorcoes, receitas, categorias }) {

    const [listaReceitasAPI, setListaReceitasAPI] = useState(receitas);
    const [listaCategoriasAPI, setListaCategoriasAPI] = useState(categorias);
    const [listaReceitas, setListaReceitas] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [exibirModal, setExibirModal] = useState(false);

    const dataFormatada = format(new Date(data), 'dd/MM/yyyy');

    const converterParaLista = () => {
        const receitas = listaReceitasAPI.split(',');
        setListaReceitas(receitas);
        const categorias = listaCategoriasAPI.split(',');
        setListaCategorias(categorias);
    };

    useEffect(() => {
        converterParaLista();
    }, []);

    const handleAbrirModal = () => {
        setExibirModal(true);
    };

    const handleFecharModal = () => {
        setExibirModal(false);
    };

    return (
        <>
            <div className={style.card} onClick={handleAbrirModal}>
                <div className={style.titulo}>
                    <h1>Pedido #{id} - {dataFormatada}</h1>
                </div>
                <div className={style.container_informacoes}>
                    <div className={style.esquerda}>
                        <span>{usuario}</span>
                        <span>{logradouro}, {numero}</span>
                    </div>
                    <div className={style.linha} />
                    <div className={style.direita}>
                        <div className={style.container_categorias}>
                            {listaCategorias.map((categoria, index) => (
                                <span key={index}>
                                    {index > 0 && index !== listaCategorias.length - 1 ? ', ' : ''}
                                    {index > 0 && index === listaCategorias.length - 1 ? ' e ' : ''}
                                    {categoria}
                                </span>
                            ))}
                        </div>
                        <div className={style.container_receitas}>
                            {listaReceitas.map((receita, index) => (
                                <span key={index}>
                                    {index > 0 && index !== listaReceitas.length - 1 ? ', ' : ''}
                                    {index > 0 && index === listaReceitas.length - 1 ? ' e ' : ''}
                                    {receita}
                                </span>
                            ))}
                        </div>
                        <span>{qtdReceitas} Receitas</span>
                        <span>{qtdPorcoes} Porções</span>
                    </div>
                </div>
            </div >
            {exibirModal && (
                <ModalPedido
                    fecharModal={handleFecharModal}
                    key={id}
                    id={id}
                    usuario={usuario}
                    logradouro={logradouro}
                    numero={numero}
                    data={data}
                    qtdReceitas={qtdReceitas}
                    qtdPorcoes={qtdPorcoes}
                    receitas={listaReceitas}
                    categorias={listaCategorias}
                />
            )}
        </>
    );
}

export default ItemPedido;