import React from "react";
import imgReceitaPedido from "../../../assets/Cliente/Pedidos/imgReceitaPedido.png";
import Preferencia from "../Receitas/Preferencia";
import { FiTrash2 } from "react-icons/fi";
import api from "../../../api/api";
import Swal from "sweetalert2";

function CardPedido({ idPedido, nome, qtd_porcoes, preferencias, categorias, pedidoAtual, setPedidoAtual, idReceita, statusPedido }) {

    const handleRemoveRecipe = (recipeId) => {

        const updatedRecipes = pedidoAtual.listaReceitas.filter((recipe) => recipe.id !== recipeId);

        setPedidoAtual((prevPedido) => ({
            ...prevPedido,
            listaReceitas: updatedRecipes,
        }));

        api
            .put("/pedidos", {
                id: pedidoAtual.id,
                listaReceitas: updatedRecipes,
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {

                Swal.fire({
                    title: "Pedido atualizado com sucesso!",
                    confirmButtonColor: "#F29311",
                });

                console.log("Pedido atualizado: ", response.data);
            })
            .catch((error) => {
                console.error("Error updating pedido:", error);
            });
    };

    
    const excluirReceitaPedido = () => {
        api.delete(`/pedidos/deletar/${idReceita}/${idPedido}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                Swal.fire({
                    title: "Receita retirada do pedido com sucesso",
                    confirmButtonColor: "#F29311",
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            })
            .catch((error) => {
                console.log(error);
            });  
    }

    return (
        <div className="flex items-center flex-col w-10/12 h-auto bg-[#FFFFFF] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.5)] rounded-xl border-solid border border-[#DADADA]">
            <img src={imgReceitaPedido} className="w-[93%] h-40 mt-3" alt="Receita" />
            <div className="flex flex-col w-11/12 h-auto mt-2">
                <h2 className="text-[1.165rem] font-medium">{nome}</h2>
                <p className="text-[1rem] mt-[0.9rem]">{qtd_porcoes} no pacote</p>
                <p className="text-[1rem] mt-1">{qtd_porcoes} Porções</p>
                <div className="flex items-center mt-[1.1rem]">
                    <p className="text-sm font-light ml-1">{categorias.map((cat) => cat.nome).join(", ")}</p>
                </div>
                <div className="flex flex-wrap justify-start items-center w-full mt-[1.2rem]">
                    {preferencias.map((preferencia, index) => (
                        <div key={index} className="mb-2">
                            <Preferencia preferencia={preferencia} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end items-center w-full mt-2">
                    {statusPedido == "ATIVO" ? <FiTrash2 className="cursor-pointer text-red-500 text-2xl mr-4" onClick={excluirReceitaPedido} /> : ""}
                </div>
            </div>
            <div className="w-full h-5" />
        </div>
    );
}

export default CardPedido;
