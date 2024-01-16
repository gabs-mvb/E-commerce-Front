import React from "react";
import style from "./Footer.module.css"

import imgRedesSociais from "../../../assets/Institucional/Footer/imgRedesSociais.png"
import imgContato from "../../../assets/Institucional/Footer/imgContato.png"

function Footer() {
    return (
        <>
            <footer className={style.footer}>
                <div className={style.containerFooter}>
                    <div className={style.containerCopyrights}>
                        <p className={style.tituloCopyrigths}>Culinart</p>
                        <p className={style.textoCopyrigths}>Copyrights  2023 Design feito por alunos SPTech</p>
                    </div>
                    <div className={style.containerContato}>
                        <ul className={style.formularioPaginas}>
                            <li className="mt-8"><a href="login">Entrar</a></li>
                            <li><a href="cadastro/info-pessoal">Cadastrar-se</a></li>
                            <li><a href="como-funciona">Como Funciona</a></li>
                        </ul>
                        <div className={style.containerRedesSociais}>
                            <div className={style.redeSociaisEContatos}>
                                <p>Redes Sociais</p>
                                <img src={imgRedesSociais} />
                                <p className="mt-4">Contato</p>
                                <img src={imgContato} />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;