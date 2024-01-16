import React from "react";

function CadastroPassos(props) {
    var plano = props.corPlano;
    var checkout = props.corCheckout;
    return (
        <div className="flex justify-center items-center h-20 w-full bg-[#F9F9F9]">
            <div className="w-3/6">
                <div className="flex justify-between items-center">
                    <div className="flex-col items-center justify-center">
                        <svg className="flex w-full justify-center" width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="22" cy="22" r="22" fill="#F29311" />
                            <path d="M31.7183 17.8439C30.5352 12.4351 25.9944 10 22.0057 10C22.0057 10 22.0057 10 21.9944 10C18.0169 10 13.4648 12.4234 12.2817 17.8322C10.9634 23.8732 14.5239 28.9893 17.7465 32.2088C18.9408 33.4029 20.4733 34 22.0057 34C23.538 34 25.0704 33.4029 26.2535 32.2088C29.4761 28.9893 33.0366 23.8849 31.7183 17.8439ZM22.0057 23.7093C20.0451 23.7093 18.4563 22.0585 18.4563 20.0215C18.4563 17.9844 20.0451 16.3337 22.0057 16.3337C23.9662 16.3337 25.5549 17.9844 25.5549 20.0215C25.5549 22.0585 23.9662 23.7093 22.0057 23.7093Z" fill="white" />
                        </svg>
                        <span className={`flex w-full justify-center text-[#ca7936]`}>
                            Endereço
                        </span>
                    </div>
                    <div className={`border-t-4 border-[${plano}] w-full`}></div>
                    <div className="flex-col items-center justify-center">
                        <svg  className="flex w-full justify-center" width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="22" cy="22" r="22" fill={plano} />
                            <path d="M10.9727 15.4093L21.9929 22.369L32.9383 15.4501" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21.9941 34.7084V22.3551" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.4103 8.65376L12.7457 12.6989C11.2356 13.6114 10 15.8996 10 17.7791V25.4744C10 27.3539 11.2356 29.6421 12.7457 30.5546L19.4103 34.5997C20.8331 35.4578 23.1669 35.4578 24.5897 34.5997L31.2543 30.5546C32.7644 29.6421 34 27.3539 34 25.4744V17.7791C34 15.8996 32.7644 13.6114 31.2543 12.6989L24.5897 8.65376C23.1544 7.78208 20.8331 7.78208 19.4103 8.65376Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M28.2327 23.3087V18.3239L16.3887 10.8601" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>


                        <span className={`flex w-full justify-center ${plano === "#CCD7D6" ? "text-[#CCD7D6]" : "text-[#ca7936]"}`}>Plano</span>
                    </div>
                    <div className={`border-t-4 border-[${checkout}] w-full`}></div>
                    <div className="flex-col items-center justify-center">
                        <svg  className="flex w-full justify-center" width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="22" cy="22" r="22" fill={checkout} />
                            <path d="M21.7143 17.9711V21.2514L20.7175 20.8499C20.2141 20.6435 19.9082 20.4485 19.9082 19.4506C19.9082 18.6363 20.4313 17.9711 21.0728 17.9711H21.7143Z" fill="white" />
                            <path d="M24.9975 25.4842C24.9975 26.2985 24.4744 26.9638 23.8329 26.9638H23.1914V23.6835L24.1882 24.0849C24.6915 24.2914 24.9975 24.4863 24.9975 25.4842Z" fill="white" />
                            <path d="M26.5866 11H18.3161C14.7237 11 12.582 13.4889 12.582 17.6638V27.2754C12.582 31.4503 14.7237 33.9392 18.3161 33.9392H26.5866C30.1791 33.9392 32.3207 31.4503 32.3207 27.2754V17.6638C32.3207 13.4889 30.1791 11 26.5866 11ZM24.6818 22.4696C25.4516 22.7793 26.4781 23.433 26.4781 25.4861C26.4781 27.2524 25.2937 28.6861 23.8331 28.6861H23.1916V29.3514C23.1916 29.8216 22.856 30.2116 22.4514 30.2116C22.0467 30.2116 21.7112 29.8216 21.7112 29.3514V28.6861H21.3559C19.7373 28.6861 18.4247 27.0918 18.4247 25.142C18.4247 24.6718 18.7504 24.2818 19.1649 24.2818C19.5695 24.2818 19.9051 24.6718 19.9051 25.142C19.9051 26.1513 20.5565 26.9657 21.3559 26.9657H21.7112V23.0775L20.2209 22.4696C19.4511 22.1599 18.4247 21.5062 18.4247 19.4531C18.4247 17.6868 19.609 16.2531 21.0697 16.2531H21.7112V15.5878C21.7112 15.1176 22.0467 14.7276 22.4514 14.7276C22.856 14.7276 23.1916 15.1176 23.1916 15.5878V16.2531H23.5469C25.1654 16.2531 26.4781 17.8473 26.4781 19.7972C26.4781 20.2674 26.1524 20.6574 25.7379 20.6574C25.3332 20.6574 24.9977 20.2674 24.9977 19.7972C24.9977 18.7879 24.3463 17.9735 23.5469 17.9735H23.1916V21.8617L24.6818 22.4696Z" fill="white" />
                        </svg>


                        <span className={`flex w-full justify-center ${checkout === "#CCD7D6" ? "text-[#CCD7D6]" : "text-[#ca7936]"}`}>Checkout</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastroPassos;
