import React, { useEffect, useState } from "react";
import HeaderCliente from "../../components/Cliente/HeaderCliente/HeaderCliente";
import Preferencia from "../../components/Cliente/Receitas/Preferencia";
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import Swal from "sweetalert2";
import api from "../../api/api";

const Preferencias = () => {
    const [preferencias, setPreferencias] = useState([]);
    const [userPreferences, setUserPreferences] = useState([]);

    useEffect(() => {
        buscarPreferencias();
    }, []);

    useEffect(() => {
        if (sessionStorage.getItem("idUsuario")) {
            buscarPreferenciasUsuario();
        }
    }, [sessionStorage.getItem("idUsuario")]);

    const formatTipoPreferenciaEnum = (tipoPreferenciaEnum) => {
        const formattedType = tipoPreferenciaEnum
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        if (tipoPreferenciaEnum === 'Caracteristica') {
            return 'Característica';
        } else if (tipoPreferenciaEnum === 'Refeicao') {
            return 'Refeição';
        }

        return formattedType;
    };

    const buscarPreferencias = () => {
        api.get('/preferencias', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                setPreferencias(response.data);
                console.log("PREFERENCIAS: ", response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const buscarPreferenciasUsuario = () => {
        api.get(`/usuarios/preferencias/${sessionStorage.getItem("idUsuario")}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        })
            .then((response) => {
                setUserPreferences(response.data);
                console.log("PREFERENCIAS USUARIO: ", response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const addPreference = (preferenceId) => {
        if (userPreferences && userPreferences.length >= 12) {
            Swal.fire({
                title: "Limite de 12 Preferências Atingidos. Por favor remova uma das preferências atuais antes de adicionar outra.",
                confirmButtonColor: "#F29311",
            });
        } else {
            api
                .post(`/usuarios/preferencias/${preferenceId}/${sessionStorage.getItem("idUsuario")}`, null, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                    }
                })
                .then((response) => {
                    setUserPreferences((prevPreferences) => [...prevPreferences, response.data]);
                    location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const removePreference = (preferenceId) => {
        api
            .delete(`/usuarios/preferencias/${preferenceId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })
            .then(() => {
                setUserPreferences((prevPreferences) => prevPreferences.filter(p => p.id !== preferenceId));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const isPreferenceInUserPreferences = (preferenceId) => {
        return userPreferences && userPreferences.some(p => p.preferencia.id === preferenceId);
    }

    const preferenciasAgrupadas = Array.isArray(preferencias)
        ? preferencias.reduce((result, item) => {
            const formattedTipoPreferenciaEnum = formatTipoPreferenciaEnum(item.tipoPreferenciaEnum);
            if (!result[formattedTipoPreferenciaEnum]) {
                result[formattedTipoPreferenciaEnum] = [];
            }
            result[formattedTipoPreferenciaEnum].push(item);
            return result;
        }, {})
        : {};

    return (
        <>
            <HeaderCliente />
            <div className="items-center justify-center w-full flex mt-10">
                <div className="items-center justify-between w-4/5 flex border-b border-gray-300">
                    <h1 className="text-2xl text-[#045D53] mb-4">Preferências</h1>
                </div>
            </div>
            <div className="items-center justify-center w-full flex mt-4">
                <div className="flex p-4 w-4/5 space-x-4">
                    <div className="w-1/5 h-[32rem] flex flex-col items-center bg-white p-4 rounded shadow-md">
                        <h3 className="text-base font-medium text-[#045D53] mb-4">Preferências Escolhidas</h3>
                        <div className="space-y-4">
                            {Array.isArray(userPreferences) && userPreferences.map((item) => (
                                <div className="flex justify-center" key={item.id}>
                                    <Preferencia preferencia={item.preferencia} />
                                    <BiTrash
                                        className="text-lg text-gray-600 cursor-pointer"
                                        onClick={() => removePreference(item.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap w-4/5">
                        {Object.keys(preferenciasAgrupadas).map((tipoPreferenciaEnum) => (
                            <div key={tipoPreferenciaEnum} className="w-1/5 p-4">
                                <h2 className="text-md text-[#045D53] mb-2 text-center">{formatTipoPreferenciaEnum(tipoPreferenciaEnum)}</h2>
                                <ul className="space-y-4">
                                    {preferenciasAgrupadas[tipoPreferenciaEnum].map((item) => (
                                        <div className="text-center" key={item.id}>
                                            <div className="flex justify-center">
                                                <Preferencia preferencia={item} />
                                                {isPreferenceInUserPreferences(item.id) ? (
                                                    <BiTrash
                                                        className="text-lg text-gray-600 cursor-pointer"
                                                        onClick={() => removePreference(item.id)}
                                                    />
                                                ) : (
                                                    <AiOutlinePlusCircle
                                                        className="text-lg text-gray-600 cursor-pointer"
                                                        onClick={() => addPreference(item.id)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Preferencias;
