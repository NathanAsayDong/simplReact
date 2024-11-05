import CircularProgress from '@mui/material/CircularProgress';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import StripeService from '../../services/Classes/stripeApiService';
import './StripePayments.scss';

const stripePromise = loadStripe('pk_live_51PsAXyP4UbZPdfFxBUdeL2099WwLUS2eP7gbhgsy3qzwt9l9y7EdJtWP4x5lsP7gZzbpBJs8SLzDjzdgJsJcXk4w0030VaWKAt').then(
    (stripe) => {
        console.log("stripe", stripe);
        return stripe;
    }
);

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
                        <form>
                        <PaymentElement />
                        <div className='row' style={{justifyContent: 'center', height: '50px', alignItems: 'flex-end'}}>
                            <button className='pay-button archivo-font-bold'>Submit</button>
                        </div>
                        </form>
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
