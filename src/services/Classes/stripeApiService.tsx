
import { useEffect, useState } from "react";

export const getProducts = async (): Promise<any> => {
    const extension = "stripe/get-products";
    const url = __API_URL__ + extension;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch subscription plans');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getSubscriptions = async (customerId: string): Promise<any[]> => {
    const extension = "stripe/get-subscriptions";
    const url = __API_URL__ + extension + "?customerId=" + customerId;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch subscriptions');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const getStripeCustomer = async (): Promise<any> => {
    const userId = localStorage.getItem('id')
    const extension = "stripe/setup";
    const url = __API_URL__ + extension + "?userId=" + userId;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch stripe customer');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

const createSubscription = async (customerId: string, priceId: string): Promise<any> => {
    const extension = "stripe/create-subscription";
    const url = __API_URL__ + extension
    const body = {
        customerId: customerId,
        priceId: priceId,
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const createPaymentIntent = async (): Promise<any> => {
    const extension = "stripe/create-payment-intent";
    const url = __API_URL__ + extension;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to create payment intent');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const attemptPayment = async (paymentIntentId: string): Promise<any> => {
    const extension = "stripe/confirm-payment-intent";
    const url = __API_URL__ + extension + "?paymentIntentId=" + paymentIntentId;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

const StripeService = () => {
    const [product, setProduct] = useState<any>();
    const [customerId, setCustomerId] = useState<string>("");
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [needsSubscription, setNeedsSubscription] = useState<boolean>(false);
    const [clientSecret, setClientSecret] = useState<string>("");

    useEffect(() => {
        init();
    }, [ ]);

    const init = async () => {
        try {
            if (customerId) return;
            const customer = await getStripeCustomer();
            setCustomerId(customer.customerId);
            const products = await getProducts();
            setProduct(products.data[0]);
            const subscriptions = await getSubscriptions(customer.customerId);
            setSubscriptions(subscriptions);
            console.log("subscriptions", subscriptions);
            setNeedsSubscription(subscriptions.length > 0);
            startPayment();
        } catch (error) {
            console.error("Error initializing Stripe service", error);
        }
    }

    const handleCreateSubscription = async () => {
        try {
            console.log('product', product);
            const priceId = product.default_price;
            console.log('priceId', priceId);
            const subscription = await createSubscription(customerId, priceId);
            const updateSubscriptions = await getSubscriptions(customerId);
            setSubscriptions(updateSubscriptions);
            console.log("subscription", subscription);
            return subscription;
        } catch (error) {
            console.error("Error creating subscription", error);
        }
    }

    const startPayment = async () => {
        try {
            const paymentIntent = await createPaymentIntent();
            setClientSecret(paymentIntent.client_secret);
            console.log("paymentIntent", paymentIntent.client_secret);
            return paymentIntent;
        } catch (error) {
            console.error("Error starting payment", error);
        }
    }

    const handleSubmit = async (element: any) => {
        const res = await element.submit();
        console.log("res", res);
    }

    return {
        init,
        handleCreateSubscription,
        startPayment,
        product,
        subscriptions,
        needsSubscription,
        clientSecret,
        handleSubmit,
    };
};

export default StripeService;