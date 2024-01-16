import React, { useState } from "react";
import { FaHeart, FaStar, FaPlusCircle, FaCheckCircle } from 'react-icons/fa';
import Preferencia from "./Preferencia";
import ModalPedido from "../Pedido/ModalPedido";
import ModalReceita from "./ModalReceita/ModalReceita";
import api from "../../../api/api";

function CardReceita(/*props*/{ nome, tempoPreparo, categoria, preferencia, imagem , avaliacao}) {

    // const {
    //     id,
    //     imagem,
    //     nome,
    //     categorias,
    //     preferencias,
    //     nota,
    //     qtdAvaliacoes,
    //     favorito,
    //     pedido,
    // } = props.receita;

    // console.log(preferencia)

    // const [isFavorito, setIsFavorito] = useState(favorito);
    // const [isReceitaNoPedido, setIsReceitaNoPedido] = useState(pedido);
    const [isModalReceitaOpen, setIsModalReceitaOpen] = useState(false);
    const [isModalPedidoOpen, setIsModalPedidoOpen] = useState(false);
    const [preferenciasDTO, setPreferenciaDTO] = useState(preferencia);

    const handleFavoritedClick = async (e) => {
        e.stopPropagation();
        setIsFavorito(!isFavorito);
        try {
            await api.post(`/receitas/favorito/${id}`, {
                Favorito: !isFavorito,
            });
        } catch (error) {
            console.log(error);
        }
    }


    const handleAdicionarClick = (e) => {
        e.stopPropagation();
        if (isReceitaNoPedido) {
            setIsReceitaNoPedido(!isReceitaNoPedido);
        }
        setIsModalPedidoOpen(true);
    };

    const openModalReceita = () => {
        setIsModalReceitaOpen(true);
    };

    const closeModalReceita = () => {
        setIsModalReceitaOpen(false);
    };

    const closeModalPedido = () => {
        setIsModalPedidoOpen(false);
    };

    return (
        <div className="p-4 border rounded-lg mb-4 bg-white hover:shadow-md hover:border-orange-400" onClick={openModalReceita}>
            <div className="relative">
                <button
                    className="absolute top-0 left-0 bg-white rounded-lg p-2"
                    onClick={handleFavoritedClick}
                >
                    <FaHeart
                        className={/*isFavorito ? "text-red-500 text-2xl" : */"text-gray-400 text-2xl"}
                    />
                </button>
                <img src={imagem} alt="Imagem da Receita" style={{ width: '280px', height: '160px', borderRadius: '1.2rem' }} />
            </div>
            <h2 className=" text-lg font-semibold mt-2">{nome}</h2>
            <div>
                {/* {categorias.map((categoria) => (
                    <span key={categoria} className=" text-sm mr-2 text-gray-600"> */}
                <span className=" text-sm mr-2 text-gray-600">
                    {categoria}
                </span>
                {/* ))} */}
            </div>
            <div className="flex items-center mt-2">
                {/* {preferencias.map((preferencia) => (
                    <Preferencia key={preferencia.nome} preferencia={preferencia} /> */}
                {/* ))} */}

                {/* <Preferencia /> */}

                {/* {preferencias.map((preferencia) => (
                    <Preferencia key={preferencia.id} preferencia={preferencia} />
                ))} */}

                {preferenciasDTO.map((preferencia) => (
                    <Preferencia key={preferencia.id} preferencia={preferencia} />
                ))}
            </div>
            <div className="flex items-center mt-2">
                <div className="flex items-center">
                    <FaStar className="text-yellow-400 text-xl mr-2" />
                    <span className="text-sm">{avaliacao}</span>
                </div>
                <div className="ml-2 mr-4 items-center">
                    <span className="text-sm">Avaliações</span>
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={handleAdicionarClick}>
                    {/* {isReceitaNoPedido ? (
                        <FaCheckCircle className="text-green-500 text-2xl hover:text-green-700" />
                    ) : (
                        <FaPlusCircle className="text-green-500 text-2xl hover:text-green-700" />
                    )} */}
                    <FaPlusCircle className="text-green-500 text-2xl hover:text-green-700" />
                </button>
            </div>
            {isModalReceitaOpen && (
                <ModalReceita receita={props.receita} oncloseModalReceita={closeModalReceita} />
            )}
            {isModalPedidoOpen && (
                <ModalPedido receita={props.receita} oncloseModalPedido={closeModalPedido} />
            )}
        </div>
    );
}

export default CardReceita;
