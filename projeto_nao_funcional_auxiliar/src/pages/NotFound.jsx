import React from "react";
import Header from "../components/Institucional/Header/Header";
import NotFoundImage from "../assets/Institucional/404.svg"

function NotFound() {
    return (
        <>
        <Header />
        <div className="flex justify-center items-center">
        <img src={NotFoundImage} alt="Not Found" style={{width:'40%'}} />
        </div>
        </>
    )
}

export default NotFound;