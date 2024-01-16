import React from "react";

function ModalPedido({ receita, oncloseModalPedido }) {
    const { nome } = receita;

    const closeModalPedido = () => {
        oncloseModalPedido();
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeModalPedido}>
            <div className="p-4 border rounded-lg bg-white" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Pedido - {nome}</h2>
                <button className="text-blue-500" onClick={oncloseModalPedido}>Close</button>
            </div>
        </div>
    );
}

export default ModalPedido;