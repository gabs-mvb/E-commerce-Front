import React from 'react';
import style from './ModalPedido.module.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaUserAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";



function ModalPedido({ id, usuario, logradouro, numero, data, qtdReceitas, qtdPorcoes, receitas, categorias, fecharModal }) {

    const dataEntrega = data;
    const dataFormatada = format(new Date(dataEntrega), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

    const handleCliqueForaModal = (event) => {
        if (event.target === event.currentTarget) {
            fecharModal();
        }
    };

    return (
        <>
            <div className={style.fundo_modal} onClick={handleCliqueForaModal}>
                <div className={style.card}>
                    <h1 className={style.titulo}>Cliente</h1>
                    <div className={style.container_cliente}>
                        <div className={style.info_cliente}>
                            <div className={style.container_icone}>
                                <FaUserAlt className={style.icone} />
                            </div>
                            <span>{usuario}</span>
                        </div>
                        <div className={style.info_cliente}>
                            <div className={style.container_icone}>
                                <IoLocationSharp className={style.icone} />
                            </div>
                            <span>{logradouro}, {numero}</span>
                        </div>
                    </div>
                    <h1 className={style.titulo}>Pedido #{id}</h1>
                    <div className={style.container_infos_pedidos}>
                        <span>
                            <b>Data de entrega: </b>
                            <span>{dataFormatada}</span>
                        </span>
                        <span>
                            <b>  {categorias.length > 1 ? 'Categorias: ' : 'Categoria: '} </b>
                            {categorias.map((categoria, index) => (
                                <span key={index}>
                                    {index > 0 && index !== categorias.length - 1 ? ', ' : ''}
                                    {index > 0 && index === categorias.length - 1 ? ' e ' : ''}
                                    {categoria}
                                </span>
                            ))}
                        </span>
                        <span>
                            <b>{receitas.length > 1 ? 'Receitas: ' : 'Receita: '} </b>
                            {receitas.map((receita, index) => (
                                <span key={index}>
                                    {index > 0 && index !== receitas.length - 1 ? ', ' : ''}
                                    {index > 0 && index === receitas.length - 1 ? ' e ' : ''}
                                    {receita}
                                </span>
                            ))}
                        </span>
                        <span>
                            <b>{qtdReceitas} </b><span>{qtdReceitas > 1 ? 'Receitas ' : 'Receita '} e </span>
                            <b>{qtdPorcoes} </b><span>Porções</span>
                        </span>
                    </div>
                    <div className={style.container_botao}>
                        <button onClick={fecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalPedido;