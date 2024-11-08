import CircularProgress from '@mui/material/CircularProgress';
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import StripeService from '../../services/Classes/stripeApiService';
import './StripePayments.scss';

const stripePromise = loadStripe('pk_live_51PsAXyP4UbZPdfFxBUdeL2099WwLUS2eP7gbhgsy3qzwt9l9y7EdJtWP4x5lsP7gZzbpBJs8SLzDjzdgJsJcXk4w0030VaWKAt').then(
    (stripe) => {
        return stripe;
    }
);

const CheckoutForm = () => {
    const [loading, setLoading] = useState(false);
    const elements = useElements();
    
    const attemptPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await elements?.submit();
            console.log("res", res);
        } catch (error) {
            console.error("Payment error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={attemptPayment}>
            <PaymentElement />
            <div className='row' style={{justifyContent: 'center', height: '50px', alignItems: 'flex-end'}}>
            <button
                    type="submit" 
                    className='pay-button archivo-font-bold' 
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Submit'}
                </button>
            </div>
        </form>
    );
}

const StripePayments: React.FC = () => {

    const stripeService = StripeService();
    const options = {
        clientSecret: stripeService.clientSecret,
        appearance: {
            variables: {
                colorText: '#ffffff',
                colorPrimary: 'white',
                colorBackground: '#2c5364',
                fontFamily: 'Archivo, sans-serif',
            },
        },
    }



    return (
        stripeService.clientSecret != "" ? (
            <div className="stripe-payments-popup-container">
                <div className="info-container">
                    <h2 className='archivo-font-bold'>Simpl Plan.</h2>
                    <h1 className='archivo-font'>$5.99 / month</h1>
                    <p>Unlimited access to all features.</p>
                    <p>Cancel anytime.</p>
                </div>
                <div className='payment-container'>
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm />
                    </Elements>
                </div>
            </div>
        ) : (
            <div className='stripe-payments-popup-container' style={{justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress color='inherit' />
            </div>
        )
    );

};

export default StripePayments;
