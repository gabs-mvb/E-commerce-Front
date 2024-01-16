import React, { useState, useEffect } from "react";
import Header from "../../../components/Institucional/Header/Header";
import api from "../../../api/api";
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    senhaNova: Yup.string()
        .required("Insira a sua senha nova")
        .min(8, "A senha deve ter pelo menos 8 caracteres"),
    senhaNovaConfirmacao: Yup.string()
        .oneOf([Yup.ref("senhaNova"), null], "Senhas não coincidem")
        .required("Confirme a sua senha"),
});

function RedefinirSenha() {
    const [inputSenhaNova, setInputSenhaNova] = useState("");
    const [inputSenhaNovaConfirmacao, setInputSenhaNovaConfirmacao] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    function atualizarSenha(values) {
        const corpoRequisicao = {
            senha: values.senhaNova,
        };
        api
            .put(`/usuarios/senha`, corpoRequisicao, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
                },
            })
            .then((response) => {
                console.log("Resposta", response);
                setSenha(values.senhaNova);
                return true;
            })
            .catch((erro) => {
                console.log("Erro", erro);
                return false;
            });
    }

    return (
        <>
            <Header />
            <div className="flex h-screen">
                <div className="flex-grow p-6 flex items-start justify-center mt-12">
                    <div className="flex-col justify-center items-center w-full max-w-md bg-white p-6 rounded-lg filter drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))">
                        <div className="flex">
                            <h1 className="text-[#DC7726] font-bold text-2xl mb-2 flex justify-center items-center w-full">
                                Redefinir Senha
                            </h1>
                        </div>
                        <Formik
                            initialValues={{
                                senhaNova: "",
                                senhaNovaConfirmacao: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setIsSubmitting(true);
                                setInputSenhaNova(values.senhaNova);
                                setInputSenhaNovaConfirmacao(values.senhaNovaConfirmacao);

                                atualizarSenha(values);
                                setIsSubmitting(false);
                            }}
                        >
                            {({ values, setFieldValue, submitForm, errors }) => (
                                <Form className="flex flex-col space-y-6 w-full items-start ml-16 mt-2">
                                        <div className="flex flex-col mt-4 mb-4">
                                            <label className="text-lg mb-2">Senha Nova:</label>
                                            <Field
                                                type="password"
                                                name="senhaNova"
                                                onChange={(e) => {
                                                    setInputSenhaNova(e.target.value);
                                                    setFieldValue("senhaNova", e.target.value);
                                                }}
                                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                            />
                                            {errors.senhaNova && <ErrorMessage name="senhaNova" component="div" className="text-red-500 text-sm" />}
                                        </div>
                                        <div className="flex flex-col mt-4 mb-4">
                                            <label className="text-lg mb-2">Confirmação Senha Nova:</label>
                                            <Field
                                                type="password"
                                                name="senhaNovaConfirmacao"
                                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                                                onChange={(e) => {
                                                    setInputSenhaNovaConfirmacao(e.target.value);
                                                    setFieldValue("senhaNovaConfirmacao", e.target.value);
                                                }}
                                            />
                                            {errors.senhaNovaConfirmacao && (
                                                <ErrorMessage name="senhaNovaConfirmacao" component="div" className="text-red-500 text-sm" />
                                            )}
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setInputSenhaNova("");
                                                    setInputSenhaNovaConfirmacao("");
                                                    setFieldValue("senhaNova", "");
                                                    setFieldValue("senhaNovaConfirmacao", "");
                                                    navigate("/login");
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
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RedefinirSenha;
