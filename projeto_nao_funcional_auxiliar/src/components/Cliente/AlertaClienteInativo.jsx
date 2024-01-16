import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

function AlertaClienteInativo(props) {

    const navigate = useNavigate();

    useEffect(() => {
      if (props.permissao == null || !props.permissao || props.permissao == "") {
        navigate("/")
      }
  }, []);
    
    const alertaFinalizarCadastro = () => {
        Swal.fire({
            title: "Parece que você ainda não finalizou o seu cadastro. Deseja fazer isso agora?",
            confirmButtonColor: "#FF9F1C",
            denyButtonColor: "#787878",
            showDenyButton: true,
            denyButtonText: `Não`,
            confirmButtonText: "Sim",
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
                navigate('/cadastro/endereco');
            }
          });
    }

    return (
       <>
       { props.permissao == 'USUARIO' && 
            <div onClick={alertaFinalizarCadastro} className=" absolute w-full h-full z-20">
            </div>
            }
       </>
    );
}

export default AlertaClienteInativo;
