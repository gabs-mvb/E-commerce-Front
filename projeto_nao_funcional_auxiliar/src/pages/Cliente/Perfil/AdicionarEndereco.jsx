import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../../api/api";
import HeaderCliente from "../../../components/Cliente/HeaderCliente/HeaderCliente";
import imgEndereco from "../../../assets/Institucional/Cadastro/imgEndereco.svg"
import styles from "../../Institucional/Cadastro/CadastroStyles.module.css";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
    cep: Yup.string()
        .matches(/^\d{5}-\d{3}$/, "CEP inválido")
        .required("Insira o seu CEP"),
    estado: Yup.string().required("Escolha o seu estado"),
    cidade: Yup.string().required("Insira a sua cidade"),
    bairro: Yup.string().required("Insira o seu bairro"),
    logradouro: Yup.string().required("Insira o seu logradouro"),
    numero: Yup.number()
        .typeError("Número deve ser um valor numérico")
        .positive("Número deve ser positivo")
        .integer("Número deve ser um número inteiro")
        .min(1, "Número não pode ser menor do que 1")
        .required("Insira número do endereço"),
    complemento: Yup.string(),
});

function AdicionarEndereco() {

    const navigate = useNavigate();

    const [inputCep, setInputCep] = useState("");
    const [inputEstado, setInputEstado] = useState("");
    const [inputCidade, setInputCidade] = useState("");
    const [inputBairro, setInputBairro] = useState("");
    const [inputLogradouro, setInputLogradouro] = useState("");
    const [inputNumero, setInputNumero] = useState("");
    const [inputComplemento, setInputComplemento] = useState("");
    const [cepApi, setCepApi] = useState("");

    useEffect(() => {
        if (sessionStorage.getItem('permissao') == null || sessionStorage.getItem('permissao') == '') {
            navigate('/')
        } else if (sessionStorage.getItem('permissao') == 'USUARIO') {
            navigate('/cadastro/endereco')
        }
    }, []);

    const estados = [
        "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
        "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
    ];

    const cancelar = () => {
        navigate('/cliente/perfil/endereco');
    }

    const handleCepChange = (event) => {
        const inputCep = event.target.value.replace(/\D/g, '');
        let cepFormatado = "";

        if (inputCep.length > 0) {
            cepFormatado += inputCep.slice(0, 5);

            if (inputCep.length > 5) {
                cepFormatado += `-${inputCep.slice(5, 8)}`;
            }

            setInputCep(cepFormatado);
        }
    };

    function cadastrarEndereco() {
        api
            .post(`/enderecos/${sessionStorage.getItem('idUsuario')}?cep=${inputCep}&numero=${inputNumero}&complemento=${inputComplemento}`, null, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((response) => {
                console.log("Resposta", response);
                navigate('/cliente/perfil/endereco');
            })
            .catch((erro) => {
                console.log("Erro", erro);
            });
    }

    function buscarEnderecoPorCep(cep, setFieldValue) {
        api
            .get(`/enderecos/buscarCEP?cep=${cep}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then((resposta) => {
                setCepApi(resposta.data.cep);
                console.log(resposta.data);
                setFieldValue("cep", cep);
                setFieldValue("bairro", resposta.data.bairro);
                setFieldValue("cidade", resposta.data.localidade);
                setFieldValue("estado", resposta.data.uf);
                setFieldValue("logradouro", resposta.data.logradouro);
                setInputCep(cep);
                setInputBairro(resposta.data.bairro);
                setInputCidade(resposta.data.localidade);
                setInputEstado(resposta.data.uf);
                setInputLogradouro(resposta.data.logradouro);
            })
            .catch((erro) => {
                console.log("ERRO", erro);
            });
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                <HeaderCliente />
                <div className={`bg ${styles.bg}`}>
                    <div className={`card ${styles.card} flex`}>
                        <div className="flex">
                            <div className="flex flex-col items-center">
                                <h2 className="text-[#DC7726] font-bold text-2xl mb-2">Adicionar Endereço</h2>
                                <Formik
                                    initialValues={{
                                        cep: "",
                                        estado: "",
                                        cidade: "",
                                        bairro: "",
                                        logradouro: "",
                                        numero: "",
                                        complemento: ""
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, { setSubmitting }) => {
                                        setInputCep(values.cep);
                                        setInputEstado(values.estado);
                                        setInputCidade(values.cidade);
                                        setInputBairro(values.bairro);
                                        setInputLogradouro(values.logradouro);
                                        setInputNumero(values.numero);
                                        setInputComplemento(values.complemento);
                                        if (cepApi != null && values.cep && values.estado && values.cidade && values.bairro && values.logradouro && values.numero) {
                                            cadastrarEndereco();
                                            setSubmitting(false);
                                        } else {
                                            Swal.fire({
                                                title: "CEP inválido. Por favor digite um CEP válido e tente novamente.",
                                                confirmButtonColor: "#F29311",
                                            });
                                        }

                                    }}
                                >
                                    {({ setFieldValue }) => (
                                        <Form className="flex flex-col space-y-4 w-full items-center">
                                            <div className="flex w-full">
                                                <div className="flex flex-col">
                                                    <label htmlFor="cep" className={`text-[#045D53] font-medium ${styles.inputLabel}`}>CEP</label>
                                                    <Field
                                                        type="text"
                                                        id="cep"
                                                        name="cep"
                                                        placeholder="00000-000"
                                                        maxLength="9"
                                                        className={styles.input_pequena}
                                                        value={inputCep}
                                                        onChange={(e) => {
                                                            handleCepChange(e);
                                                        }}
                                                        onBlur={(e) => {
                                                            buscarEnderecoPorCep(e.target.value, setFieldValue);
                                                        }}
                                                    />

                                                    <ErrorMessage name="cep" component="div" className="text-red-500 font-medium text-xs" />
                                                </div>
                                                <span className="w-8"></span>
                                                <div className="flex flex-col">
                                                    <label htmlFor="estado" className={`text-[#045D53] font-medium ${styles.inputLabel}`}>
                                                        Estado
                                                    </label>
                                                    <select
                                                        id="estado"
                                                        name="estado"
                                                        className={`h-auto ${styles.combobox}`}
                                                        value={inputEstado}
                                                        onChange={(e) => {
                                                            setInputEstado(e.target.value);
                                                            setFieldValue("estado", e.target.value);
                                                        }}
                                                    >
                                                        <option value="">-</option>
                                                        {estados.map((estado) => (
                                                            <option key={estado} value={estado}>
                                                                {estado}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ErrorMessage name="estado" component="div" className="text-red-500 font-medium text-xs" />
                                                </div>
                                            </div>
                                            <div className="flex w-full">
                                                <div className="flex flex-col">
                                                    <label htmlFor="cidade" className={`text-[#045D53] font-medium ${styles.inputLabel}`}>Cidade</label>
                                                    <Field
                                                        type="text"
                                                        id="cidade"
                                                        name="cidade"
                                                        placeholder="Cidade"
                                                        className={styles.input_pequena}
                                                        value={inputCidade}
                                                        onChange={(e) => {
                                                            setInputCidade(e.target.value);
                                                            setFieldValue("cidade", e.target.value);
                                                        }}
                                                    />
                                                    <ErrorMessage name="cidade" component="div" className="text-red-500 font-medium text-xs" />
                                                </div>
                                                <span className="w-8"></span>
                                                <div className="flex flex-col">
                                                    <label htmlFor="bairro" className={`text-[#045D53] font-medium ${styles.inputLabel}`}>Bairro</label>
                                                    <Field
                                                        type="text"
                                                        id="bairro"
                                                        name="bairro"
                                                        placeholder="Bairro"
                                                        className={styles.input_pequena}
                                                        value={inputBairro}
                                                        onChange={(e) => {
                                                            setInputBairro(e.target.value);
                                                            setFieldValue("bairro", e.target.value);
                                                        }}
                                                    />
                                                    <ErrorMessage name="bairro" component="div" className="text-red-500 font-medium text-xs" />
                                                </div>

                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="logradouro" className={`text-[#045D53] font-medium ${styles.inputLabel}`}>Logradouro</label>
                                                <Field
                                                    type="text"
                                                    id="logradouro"
                                                    name="logradouro"
                                                    placeholder="Endereço"
                                                    className={styles.input_grande}
                                                    value={inputLogradouro}
                                                    onChange={(e) => {
                                                        setInputLogradouro(e.target.value);
                                                        setFieldValue("logradouro", e.target.value);
                                                    }}
                                                />
                                                <ErrorMessage name="logradouro" component="div" className="text-red-500 font-medium text-xs" />
                                            </div>
                                            <div className="flex w-full">
                                                <div className="flex flex-col">
                                                    <label htmlFor="numero" className={`text-[#045D53] font-medium ${styles.inputLabel}`}>Número</label>
                                                    <Field
                                                        type="text"
                                                        id="numero"
                                                        name="numero"
                                                        placeholder="00"
                                                        className={styles.input_pequena}
                                                        value={inputNumero}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '');
                                                            setInputNumero(value);
                                                            setFieldValue("numero", value);
                                                        }}
                                                    />
                                                    <ErrorMessage name="numero" component="div" className="text-red-500 font-medium text-xs" />
                                                </div>
                                                <span className="w-8"></span>
                                                <div className="flex flex-col">
                                                    <label htmlFor="complemento" className={`text-[#045D53] font-medium ${styles.inputLabel}`}>Complemento</label>
                                                    <Field
                                                        type="text"
                                                        id="complemento"
                                                        name="complemento"
                                                        placeholder="Complemento"
                                                        className={styles.input_pequena}
                                                        value={inputComplemento}
                                                        onChange={(e) => {
                                                            setInputComplemento(e.target.value);
                                                            setFieldValue("complemento", e.target.value);
                                                        }}
                                                    />
                                                    <ErrorMessage name="complemento" component="div" className="text-red-500 font-medium text-xs" />
                                                </div>

                                            </div>
                                            <div className="flex w-full justify-around">
                                                <button onClick={cancelar} className={`bg-gray-500 ${styles.btnCadastroCancelar}`}>
                                                    Cancelar
                                                </button>
                                                <button type="submit" className={`bg-[#F29311] ${styles.btnCadastro}`}>
                                                    Confirmar
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                            <img src={imgEndereco} className="ml-2" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdicionarEndereco;