import React, { useState } from 'react';

function ConfirmOrderButton() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleClick() {
        setIsLoading(true);

        try {
            const response = await fetch('user/orders/:orderID/confirm', {
                method: 'PATCH'
            });
            const data = await response.json();

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }

    return (
        <button onClick={handleClick} disabled={isLoading}>
            {isLoading ? 'Confirming...' : 'Confirm Order'}
        </button>
    );
}

export default ConfirmOrderButton;
