import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ConfirmComponent = () => {
  const { orderId, confirmationCode } = useParams();

  useEffect(() => {
    // Send a request to the server to confirm the order
    fetch(`/api/confirm/${orderId}/${confirmationCode}`)
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server
        console.log(data);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  }, [orderId, confirmationCode]);

  return (
    <div>
      <h1>Confirming Order #{orderId}</h1>
      <p>Please wait while we confirm your order...</p>
    </div>
  );
};

export default ConfirmComponent;
