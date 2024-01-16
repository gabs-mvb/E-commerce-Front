import React, { useState } from "react";
import CardReceitaAvaliacao from "./CardReceitaAvaliacao";
import api from "../../../api/api";
import Swal from "sweetalert2";

function ModalAvaliarReceitas({ recipes, oncloseModal }) {
  const [avaliacoes, setAvaliacoes] = useState(
    recipes.map((recipe) => ({
      idUsuario: sessionStorage.getItem("idUsuario"),
      idReceita: recipe.id,
      nota: null,
    }))
  );

  const closeModal = () => {
    oncloseModal();
  };

  const handleRate = (index, rating) => {
    setAvaliacoes((prevAvaliacoes) =>
      prevAvaliacoes.map((avaliacao, i) =>
        i === index ? { ...avaliacao, nota: rating } : avaliacao
      )
    );
  };

  const avaliarReceitas = () => {
    const corpoRequisicao = avaliacoes.map((avaliacao) => ({
      idUsuario: avaliacao.idUsuario,
      idReceita: avaliacao.idReceita,
      nota: avaliacao.nota || 0,
    }));

    console.log("AVALIACAO ", corpoRequisicao);
    
    api
      .post(`/avaliacoes`, corpoRequisicao, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        closeModal();

        Swal.fire({
          title: "Avaliação registrada com sucesso!",
          confirmButtonColor: "#F29311",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="p-8 border rounded-lg bg-white max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Avaliar Receitas</h2>
        <div className="grid grid-cols-3 gap-4">
          {recipes.map((recipe, index) => (
            <CardReceitaAvaliacao
              key={index}
              recipe={recipe}
              onSelect={(selectedRecipe) => {}}
              onRate={(rating) => handleRate(index, rating)}
            />
          ))}
        </div>
        <div className="flex justify-center items-center w-full mt-6 mb-2">
          <button
            className="mr-6 px-2 py-1 text-sm text-[#FFFFFF] bg-slate-400 rounded-md"
            onClick={oncloseModal}
          >
            Cancelar
          </button>
          <button
            className="ml-6 px-2 py-1 text-sm text-[#FFFFFF] bg-[#DC7726] rounded-md"
            onClick={avaliarReceitas}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAvaliarReceitas;
