import React from "react";
import namasthe from "./../assets/namaste.jpg";

const OrderConfirmationPage = () => {
    return (
        <div>
            <h1>Thank you for ordering!</h1>
            <p>
                Please wait while we review your order and update the status through your
                contact details.
            </p>
            <img className="namasthe" src={namasthe} alt="Logo" />
        </div>
    );
};

export default OrderConfirmationPage;
