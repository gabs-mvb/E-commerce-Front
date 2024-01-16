import React, { useState, useEffect } from "react";
import HeaderFornecedor from "../../../components/Fornecedor/HeaderFornecedor/HeaderFornecedor";
import { FiEdit } from "react-icons/fi";
import api from "../../../api/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import SidebarPerfilFornecedor from "../../../components/Fornecedor/HeaderFornecedor/Perfil/SidebarPerfilFornecedor";

const validationSchema = Yup.object().shape({
    nome: Yup.string()
        .required("Insira o seu nome completo")
        .test("two-words", "Insira o seu nome completo", (value) => {
            const words = value.split(" ");
            return words.filter((word) => word.replace(/\W/g, "").length >= 1).length >= 2;
        }),
    email: Yup.string().email("Email inválido").required("Insira o seu email"),
    telefone: Yup.string()
        .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Insira o seu telefone com o DDD")
        .required("Insira o seu telefone com o DDD"),
});

function PerfilInfoPessoalFornecedor() {
    const [isEditing, setIsEditing] = useState(false);
    const [inputNome, setInputNome] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputTelefone, setInputTelefone] = useState(sessionStorage.getItem('telefone'));
    const [nome, setNome] = useState(sessionStorage.getItem('nome'));
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [telefone, setTelefone] = useState(sessionStorage.getItem('telefone'));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const alertaErro = () => {
        Swal.fire({
            icon: "error",
            iconColor: "#FF9F1C",
            title: "<b>Erro ao atualizar as informações!</b>",
            text: "Confira suas credênciais e tente novamente",
            position: "center",
            confirmButtonColor: "#FF9F1C"
        })
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

    function atualizarUsuario(values) {
        if (!isEditing) {
            return Promise.resolve(true);
        }

        const telefoneNumerico = values.telefone.replace(/\D/g, "");

        Swal.fire({
            title: "Tem certeza de que você quer atualizar o usuário?",
            confirmButtonColor: "#FF9F1C",
            denyButtonColor: "#787878",
            showDenyButton: true,
            confirmButtonText: "Sim",
            denyButtonText: "Não",
        }).then((result) => {
            if (result.isConfirmed) {
                const corpoRequisicao = {
                    nome: values.nome,
                    email: values.email,
                    tel: telefoneNumerico,
                };
                console.log(corpoRequisicao);

                return api
                    .put(`/funcionarios/${sessionStorage.getItem("idUsuario")}`, corpoRequisicao, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                        },
                    })
                    .then((response) => {
                        console.log("Resposta", response);
                        setInputNome(response.data.nome);
                        setInputEmail(response.data.email);
                        setInputTelefone(response.data.tel);
                        setNome(response.data.nome);
                        sessionStorage.setItem('nome', response.data.nome);
                        setEmail(response.data.email);
                        setTelefone(response.data.tel);
                        Swal.fire({
                            title: "Usuário atualizado com sucesso!",
                            icon: "success",
                            iconColor: "#FF9F1C",
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    })
                    .catch((erro) => {
                        console.log("Erro", erro);
                        Swal.fire({
                            title: "Erro ao atualizar o usuário. Por favor, tente novamente.",
                            icon: "error",
                            iconColor: "#FF9F1C",
                        });
                    });
            }
        });
    }


    return (
        <>
            <HeaderFornecedor />
            <div className="flex h-screen">
                <SidebarPerfilFornecedor nome={sessionStorage.getItem('nome')} />
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
                                email: email,
                                telefone: telefone,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setIsSubmitting(true);
                                setInputNome(values.nome);
                                setInputEmail(values.email);
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
                                    <div className="flex flex-col mt-4 mb-4">
                                        <label className="text-lg mb-2">Nome:</label>
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
                                    <div className="flex flex-col mt-4 mb-4">
                                        <label className="text-lg mb-2">Email:</label>
                                        {isEditing ? (
                                            <>
                                                <Field
                                                    type="text"
                                                    name="email"
                                                    onChange={(e) => {
                                                        setInputEmail(e.target.value);
                                                        setFieldValue("email", e.target.value);
                                                    }}
                                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                />
                                                {errors.email && <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />}
                                            </>
                                        ) : (
                                            <p>{email}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col mt-4 mb-4">
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
                                                    setInputEmail(email);
                                                    setInputTelefone(telefone);
                                                    setFieldValue("nome", nome);
                                                    setFieldValue("email", email);
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

export default PerfilInfoPessoalFornecedor;
