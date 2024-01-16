import React from "react";

function SidebarPerfil(props) {
    return (
        <div className="h-screen bg-[#00AE9E] w-1/6 p-4 relative">
            <div className="mt-6 w-full border-b-2 border-white mb-12 text-center">
                <h1 className="text-white font-semibold text-lg">{props.nome}</h1>
            </div>
            <ul className="space-y-10">
                <li className="relative">
                    <a className="text-white px-4 py-2 transition duration-300 block" href="/cliente/perfil/info-pessoal">
                        Informações Pessoais
                        <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 hover:bg-white"></div>
                    </a>
                </li>
                <li className="relative">
                    <a className="text-white px-4 py-2 transition duration-300 block" href="/cliente/perfil/senha-autenticacao">
                        Senha e Autenticação
                        <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 hover:bg-white"></div>
                    </a>
                </li>
                <li className="relative">
                    <a className="text-white px-4 py-2 transition duration-300 block" href="/cliente/perfil/endereco">
                        Meus Endereços
                        <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 hover:bg-white"></div>
                    </a>
                </li>
                <li className="relative">
                    <a className="text-white px-4 py-2 transition duration-300 block" href="/cliente/perfil/pagamento">
                        Pagamento
                        <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 hover:bg-white"></div>
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default SidebarPerfil;
