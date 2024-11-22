import CircularProgress from '@mui/material/CircularProgress';
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import StripeService from '../../services/Classes/stripeApiService';
import './StripePayments.scss';

let stripePromise = loadStripe('pk_live_51PsAXyP4UbZPdfFxBUdeL2099WwLUS2eP7gbhgsy3qzwt9l9y7EdJtWP4x5lsP7gZzbpBJs8SLzDjzdgJsJcXk4w0030VaWKAt')

const CheckoutForm = () => {
    const [loading, setLoading] = useState(false);
    const elements = useElements();

    useEffect(() => {
        processPayment();
    }, []);
    
    const attemptPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const stripe = await stripePromise
        if (!elements || !stripe) {
            return;
        }
        setLoading(true);
        try {
            // First submit the form elements
            const { error: submitError } = await elements.submit();
            if (submitError) {
                console.error("Submit error:", submitError);
                return;
            }
    
            // Then confirm the payment
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: "https://simplfinances.com/dashboard",
                }
            });
    
            if (error) {
                console.error("Payment error:", error);
            }
        } catch (error) {
            console.error("Payment error:", error);
        } finally {
            setLoading(false);
        }
    }

    const processPayment = async () => {
        // Retrieve the PaymentIntent client secret from the URL query parameters
        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
        const status = new URLSearchParams(window.location.search).get('redirect_status');
        const stripe = await stripePromise;
        console.log('clientSecret', clientSecret, 'stripe', stripe);
        if (!stripe || !clientSecret) {
            return;
        }
        // Retrieve the PaymentIntent
        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
            // Inspect the PaymentIntent `status` to indicate the status of the payment
            // to your customer.
            //
            // Some payment methods will [immediately succeed or fail][0] upon
            // confirmation, while others will first enter a `processing` state.
            //
            // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
            switch (paymentIntent?.status) {
            case 'succeeded':
                console.log('Payment succeeded!');
                setNeedsSubscription(false);
                break;
            case 'processing':
                console.log('Payment processing. Please wait a moment.');
                break;
            case 'requires_payment_method':
                console.log('Payment failed. Please provide a new payment method');
                // Redirect your user back to your payment page to attempt collecting
                // payment again
                break;
            default:
                break;
            }
        });
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
                    <h1 className='archivo-font'>$4.99 / month</h1>
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

function updatePayedStatus(arg0: boolean) {
    throw new Error('Function not implemented.');
}

function setNeedsSubscription(arg0: boolean) {
    throw new Error('Function not implemented.');
}

