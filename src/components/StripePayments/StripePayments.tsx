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
    }
    return (
        stripeService.clientSecret != "" ? (
            <Elements stripe={stripePromise} options={options}>
                <form>
                    <PaymentElement />
                    <button>Submit</button>
                </form>
            </Elements>
        ) : (
            <div>
                <button onClick={stripeService.startPayment}>Create Payment</button>
            </div>
        )
    );

};

export default StripePayments;
