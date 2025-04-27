import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD" // Exchange API
        );
        const data = await response.json();
        setExchangeRate(data.rates.LKR); // Get LKR rate
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch exchange rate");
        setLoading(false);
        console.error("Error fetching exchange rate:", err);
      }
    };

    fetchExchangeRate();
  }, []);

  if (loading) {
    return <div>Loading PayPal button...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!exchangeRate) {
    return <div>Exchange rate not available</div>;
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              { 
                amount: { 
                  value: (parseFloat(amount) / exchangeRate).toFixed(2) 
                } 
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;