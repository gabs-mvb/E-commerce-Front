import React from "react";

function Preferencia({ preferencia }) {

    return (
        <div
            className="rounded-full px-2 text-xs mr-2"
            style={{
                backgroundColor: `#${preferencia.corFundo}`,
                border: "1px solid black",
                color:  `#${preferencia.corTexto}`,
                marginBottom: `4px`
            }}
        >
            {preferencia.nome}
        </div>
    );
}

export default Preferencia;
