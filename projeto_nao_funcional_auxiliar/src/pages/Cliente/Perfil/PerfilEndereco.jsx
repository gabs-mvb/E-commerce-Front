import React, { useEffect, useState } from "react";
import HeaderCliente from "../../../components/Cliente/HeaderCliente/HeaderCliente";
import SidebarPerfil from "../../../components/Cliente/Perfil/SidebarPerfil";
import { FiHome } from "react-icons/fi";
import { BiTrash } from 'react-icons/bi';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import api from "../../../api/api";
import Swal from "sweetalert2";


function PerfilEndereco() {

    const navigate = useNavigate();

    const [enderecos, setEnderecos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeEnderecoId, setActiveEnderecoId] = useState(null);

    useEffect(() => {
        buscarEnderecos();
        if (sessionStorage.getItem('permissao') == null || sessionStorage.getItem('permissao') === '') {
            navigate('/');
        } else if (sessionStorage.getItem('permissao') === 'USUARIO') {
            navigate('/cadastro/endereco');
        }
    }, []);

    const deleteEndereco = (id) => {
        api
            .delete(`/enderecos/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Resposta DELETE:", response);
                buscarEnderecos();
                Swal.fire({
                    title: "Endereço deletado com sucesso.",
                    confirmButtonColor: "#F29311",
                });
            })
            .catch((erro) => {
                console.log("Erro", erro);
                setLoading(false);
            });
    }    

    const buscarEnderecos = () => {
        api
            .get(`/enderecos/usuarios/${sessionStorage.getItem('idUsuario')}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Resposta GET", response);
                setEnderecos(response.data);
                setLoading(false);
            })
            .catch((erro) => {
                console.log("Erro", erro);
                setLoading(false);
            });
    }

    const setEnderecoAsFavorito = (id) => {
        api
            .put(`/enderecos/ativar/${id}/${sessionStorage.getItem("idUsuario")}`, null, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log('Endereço ativo:', response);
                setActiveEnderecoId(id); 
                Swal.fire({
                    title: "Endereço ativo alterado com sucesso.",
                    confirmButtonColor: "#F29311",
                });
                buscarEnderecos();
            })
            .catch((erro) => {
                console.log("Erro", erro);
            });
    }
    
    return (
        <>
            <HeaderCliente />
            <div className="flex h-screen">
                <SidebarPerfil nome={sessionStorage.getItem('nome')} />
                <div className="flex-grow p-6 flex items-start justify-center mt-12">
                    <div className="flex-col justify-center items-center w-2/4 bg-white p-6 rounded-lg filter drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))">
                        <div className="flex">
                            <h1 className="text-[#DC7726] font-bold text-2xl mb-2 flex justify-center items-center w-full">
                                Meus Endereços
                            </h1>
                        </div>
                        {loading ? (
                            <p>Carregando...</p>
                        ) : (
                            enderecos.length > 0 ? (
                                enderecos.map((endereco) => (
                                    <div
                                        key={endereco.id}
                                        className={`border p-4 my-2 ${endereco.isAtivo === 'ATIVO'
                                            ? "border-[#DC7726] border-2 bg-[#FFEDD3] rounded-md cursor-pointer"
                                            : "border-gray-300 rounded-md cursor-pointer"
                                            }`}
                                    >
                                        <div className="flex items-start">
                                            <div className="w-full">
                                                <div className="flex w-full justify-between">
                                                    <p className="font-bold mr-16"  onClick={() => (endereco.isAtivo === 'INATIVO' ? setEnderecoAsFavorito(endereco.id) : "")}>
                                                        {endereco.endereco.logradouro}, {endereco.endereco.numero}
                                                        {endereco.endereco.complemento ? `, ${endereco.endereco.complemento}` : ""}
                                                    </p>
                                                    {endereco.isAtivo === 'ATIVO' ? (
                                                        <FiHome className="text-[#FFA500] text-2xl ml-2" />
                                                    ) : (
                                                        <BiTrash className="text-2xl text-gray-500 cursor-pointer" onClick={() => deleteEndereco(endereco.id)} />
                                                    )}
                                                </div>
                                                <p>{endereco.endereco.bairro}</p>
                                                <div className="flex w-full justify-between">
                                                    <p>
                                                        {endereco.endereco.cidade} - {endereco.endereco.uf}
                                                    </p>
                                                    <p>{endereco.endereco.cep}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhum Endereço Encontrado.</p>
                            )
                        )}
                        <Link to="/cliente/adicionar/endereco">
                            <div className="border p-4 mt-4 cursor-pointer border-gray-300 rounded-md flex justify-center items-center">
                                + Adicionar Endereço
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PerfilEndereco;
