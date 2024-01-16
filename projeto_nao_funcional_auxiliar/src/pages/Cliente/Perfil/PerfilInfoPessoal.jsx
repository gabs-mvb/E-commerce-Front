import React, { useState, useEffect } from "react";
import HeaderCliente from "../../../components/Cliente/HeaderCliente/HeaderCliente";
import SidebarPerfil from "../../../components/Cliente/Perfil/SidebarPerfil";
import { FiEdit } from "react-icons/fi";
import api from "../../../api/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    nome: Yup.string()
        .required("Insira o seu nome completo")
        .test("two-words", "Insira o seu nome completo", (value) => {
            const words = value.split(" ");
            return words.filter((word) => word.replace(/\W/g, "").length >= 1).length >= 2;
        }),
    telefone: Yup.string()
        .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Insira o seu telefone com o DDD")
        .required("Insira o seu telefone com o DDD"),
});

function PerfilInfoPessoal() {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [inputNome, setInputNome] = useState("");
    const [inputTelefone, setInputTelefone] = useState("");
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        buscarInfoPessoal();
        if (sessionStorage.getItem('permissao') == null || sessionStorage.getItem('permissao') == '') {
            navigate('/')
        } else if (sessionStorage.getItem('permissao') == 'USUARIO') {
            navigate('/cadastro/endereco')
        }
    }, []);

    const alertaErro = () => {
        Swal.fire({
            icon: "error",
            iconColor: "#FF9F1C",
            title: "<b>Erro ao atualizar as informações!</b>",
            text: "Confira suas informações e tente novamente",
            position: "center",
            confirmButtonColor: "#FF9F1C"
        })
    }

    function buscarInfoPessoal() {
        api
            .get(`/usuarios/${sessionStorage.getItem('idUsuario')}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            })
            .then((response) => {
                console.log("Resposta", response);
                setInputNome(response.data.nome);
                setNome(response.data.nome);
                telefoneChange(response.data.telefone);
            })
            .catch((erro) => {
                console.log("Erro", erro);
            });
    }

    const handleTelefoneChange = (event) => {
        const inputTelefone = event.target.value.replace(/\D/g, "");
        let telefoneFormatado = "";

        if (inputTelefone.length > 0) {
            telefoneFormatado = `(${inputTelefone.slice(0, 2)}`;

            if (inputTelefone.length > 2) {
                telefoneFormatado += `) ${inputTelefone.slice(2, 7)}`;

                if (inputTelefone.length > 7) {
                    telefoneFormatado += `-${inputTelefone.slice(7, 11)}`;
                }
            }

            setInputTelefone(telefoneFormatado);
            setTelefone(telefoneFormatado);
        }
    };

    const telefoneChange = (valor) => {
        const inputTelefone = valor.replace(/\D/g, "");
        let telefoneFormatado = "";

        if (inputTelefone.length > 0) {
            telefoneFormatado = `(${inputTelefone.slice(0, 2)}`;

            if (inputTelefone.length > 2) {
                telefoneFormatado += `) ${inputTelefone.slice(2, 7)}`;

                if (inputTelefone.length > 7) {
                    telefoneFormatado += `-${inputTelefone.slice(7, 11)}`;
                }
            }

            setInputTelefone(telefoneFormatado);
            setTelefone(telefoneFormatado);
        }
    };


    const atualizarUsuario = (values) => {
        if (!isEditing) {
            return Promise.resolve(true);
        }

        const telefoneNumerico = values.telefone.replace(/\D/g, "");


        const corpoRequisicao = {
            nome: values.nome,
            telefone: telefoneNumerico,
        };
        console.log(corpoRequisicao);

        return api
            .put(`/usuarios/${sessionStorage.getItem("idUsuario")}`, corpoRequisicao, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            })
            .then((response) => {
                console.log("Resposta", response);
                setInputNome(response.data.nome);
                setNome(response.data.nome);
                sessionStorage.setItem('nome', response.data.nome)
                telefoneChange(response.data.telefone);
                return true;
            })
            .catch((erro) => {
                console.log("Erro", erro);
                return false;
            });
    };

    return (
        <>
            <HeaderCliente />
            <div className="flex h-screen">
                <SidebarPerfil nome={sessionStorage.getItem('nome')} />
                <div className="flex-grow p-6 flex items-start justify-center mt-12">
                    <div className="flex-col justify-center items-center w-full max-w-md bg-white p-6 rounded-lg filter drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))">
                        <div className="flex">
                            <h1 className="text-[#DC7726] font-bold text-2xl mb-2 flex justify-center items-center w-full">
                                Informações Pessoais
                            </h1>
                            {!isEditing && <FiEdit onClick={() => setIsEditing(true)} className="cursor-pointer text-[#DC7726] text-2xl" />}
                        </div>
                        <Formik
                            initialValues={{
                                nome: nome,
                                telefone: telefone,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setIsSubmitting(true);
                                setInputNome(values.nome);
                                setInputTelefone(inputTelefone);

                                atualizarUsuario(values)
                                    .then((success) => {
                                        if (success) {
                                            setIsEditing(false);
                                        } else {
                                            alertaErro();
                                        }
                                        setIsSubmitting(false);
                                    })
                                    .catch(() => {
                                        alertaErro();
                                        setIsSubmitting(false);
                                    });
                            }}
                        >
                            {({ values, setFieldValue, submitForm, errors }) => (
                                <Form className="flex flex-col space-y-6 w-full items-start ml-16 mt-2">
                                    <div className="flex flex-col mt-2 mb-2">
                                        <label className="text-lg">Nome:</label>
                                        {isEditing ? (
                                            <>
                                                <Field
                                                    type="text"
                                                    name="nome"
                                                    onChange={(e) => {
                                                        setInputNome(e.target.value);
                                                        setFieldValue("nome", e.target.value);
                                                    }}
                                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                />
                                                {errors.nome && <ErrorMessage name="nome" component="div" className="text-red-500 text-sm" />}
                                            </>
                                        ) : (
                                            <p>{nome}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col mt-2 mb-2">
                                        <label className="text-lg mb-2">Telefone:</label>
                                        {isEditing ? (
                                            <>
                                                <Field
                                                    type="text"
                                                    name="telefone"
                                                    maxLength="15"
                                                    value={inputTelefone}
                                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                    onChange={(e) => {
                                                        handleTelefoneChange(e);
                                                        setFieldValue("telefone", e.target.value);
                                                    }}
                                                />
                                                {errors.telefone && <ErrorMessage name="telefone" component="div" className="text-red-500 text-sm" />}
                                            </>
                                        ) : (
                                            <p>{telefone}</p>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="flex space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setInputNome(nome);
                                                    setInputTelefone(telefone);
                                                    setFieldValue("nome", nome);
                                                    setFieldValue("telefone", telefone);

                                                }}
                                                className="border border-gray-300 rounded-md px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isSubmitting}
                                                className="border border-gray-300 rounded-md px-4 py-2 bg-[#DC7726] hover-bg-[#ba5a0d] text-white"
                                                onClick={() => {
                                                    submitForm();
                                                }}
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PerfilInfoPessoal;
