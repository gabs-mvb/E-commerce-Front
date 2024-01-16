// Header.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';
import style from './Header.module.css';

import logo from '../../../assets/Institucional/header/logo_header.png';

function Header() {

    const navigate = useNavigate();

    const login = () => {
        navigate('/login');
    }

    return (
        <>
            <header className={style.headerHome}>
                <div className={style.conteudo}>
                    <a href="/">
                        <img src={logo} alt="Logo Culinart" href="/" className={style.logo} />
                    </a>
                    <div className={style.itens}>
                        <a href="/como-funciona" className={style.como_funciona}>
                            Como Funciona
                        </a>
                        <button className={style.botao_login} onClick={login}>Login</button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;
