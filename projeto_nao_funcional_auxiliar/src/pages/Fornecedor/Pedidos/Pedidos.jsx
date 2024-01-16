import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import style from './Pedidos.module.css';
import HeaderFornecedor from '../../../components/Fornecedor/HeaderFornecedor/HeaderFornecedor';
import ItemPedido from '../../../components/Fornecedor/Pedidos/ItemPedido/ItemPedido';
import api from '../../../api/api';

function PedidosFornecedor() {
    const [pedidos, setPedidos] = useState([]);
    const PERMISSOES_PERMITIDAS = ['ADMINISTRADOR', 'FUNCIONARIO'];
    const navigate = useNavigate();

    const buscarPedidosFornecedor = () => {
        api.get('/pedidos/proximas', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        }).then((response) => {
            console.log("Resposta: ", response);
            setPedidos(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        const usuarioPermissao = sessionStorage.getItem('permissao');
        const possuiPermissao = PERMISSOES_PERMITIDAS.some(permissao =>
            usuarioPermissao.includes(permissao)
        );

        if (!possuiPermissao) {
            navigate('/cliente/pedidos'); // Utilize o navigate para a navegação
        } else {
            buscarPedidosFornecedor();
            document.body.style.backgroundColor = '#fff';
        }
    }, [navigate]);

    return (
        <>
            <HeaderFornecedor />
            <div className={style.container_topo}>
                <span className={`${style.posicaoTexto} text-2xl text-[#045D53] `}>Entrega das próximas semanas</span>
            </div>
            <div className={style.container_pedidos}>
                {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                        <ItemPedido
                            key={pedido.idPedido}
                            id={pedido.idPedido}
                            usuario={pedido.nomeUsuario}
                            logradouro={pedido.logradouro}
                            numero={pedido.numero}
                            data={pedido.dataEntrega}
                            qtdReceitas={pedido.qtdReceitas}
                            qtdPorcoes={pedido.qtdPorcoes}
                            receitas={pedido.receitas}
                            categorias={pedido.categorias}
                        />
                    ))
                ) : (
                    <div className="text-gray-600 text-2xl w-full text-center">
                        Nenhum resultado encontrado
                    </div>
                )}
            </div>
        </>
    );
}

export default PedidosFornecedor;
