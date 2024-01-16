import React, { useState } from "react";
import HeaderFornecedor from "../../../components/Fornecedor/HeaderFornecedor/HeaderFornecedor";
import SidebarPerfilFornecedor from "../../../components/Fornecedor/HeaderFornecedor/Perfil/SidebarPerfilFornecedor";
import api from "../../../api/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
    senhaNova: Yup.string()
        .required("Insira a sua senha nova")
        .min(8, "A senha deve ter pelo menos 8 caracteres"),
    senhaNovaConfirmacao: Yup.string()
        .oneOf([Yup.ref("senhaNova"), null], "Senhas não coincidem")
        .required("Confirme a sua senha"),
});

function PerfilSenhaAutenticacaoFornecedor() {
    const [inputSenhaNova, setInputSenhaNova] = useState("");
    const [inputSenhaNovaConfirmacao, setInputSenhaNovaConfirmacao] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function atualizarSenha(values) {

        Swal.fire({
            title: "Tem certeza de que você quer atualizar a senha?",
            confirmButtonColor: "#FF9F1C",
            denyButtonColor: "#787878",
            showDenyButton: true,
            confirmButtonText: "Sim",
            denyButtonText: `Não`
        }).then((result) => {
            if (result.isConfirmed) {
                const corpoRequisicao = {
                    senha: values.senhaNova,
                };
                api
                    .put(`/usuarios/senha/${sessionStorage.getItem("idUsuario")}`, corpoRequisicao, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
                        },
                    })
                    .then((response) => {
                        console.log("Resposta", response);
                        Swal.fire({
                            title: "Senha atualizada com sucesso!",
                            icon: "success",
                            iconColor: "#00AE9E",
                        })
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    })
                    .catch((erro) => {
                        console.log("Erro", erro);
                        Swal.fire({
                            title: "Erro ao atualizar a senha. Por favor, tente novamente.",
                            icon: "error",
                            confirmButtonColor: "#00AE9E",
                        });
                    });
            }
        });
    }

    return (
        <>
            <HeaderFornecedor />
            <div className="flex h-screen">
                <SidebarPerfilFornecedor nome={sessionStorage.getItem("nome")} />
                <div className="flex-grow p-6 flex items-start justify-center mt-12">
                    <div className="flex-col justify-center items-center w-full max-w-md bg-white p-6 rounded-lg filter drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))">
                        <div className="flex">
                            <h1 className="text-[#DC7726] font-bold text-2xl mb-2 flex justify-center items-center w-full">
                                Alterar Senha
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

                                atualizarSenha(values)
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
                                            disabled={isSubmitting}
                                            className="border ml-16 border-gray-300 rounded-md px-4 py-2 bg-[#DC7726] hover-bg-[#ba5a0d] text-white"
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

export default PerfilSenhaAutenticacaoFornecedor;
