
import { useEffect, useState } from "react";
import { StripeSubscriptionObject } from "./classes";

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

export const getSubscriptions = async (customerId: string): Promise<StripeSubscriptionObject[]> => {
    const extension = "stripe/get-subscriptions";
    const url = __API_URL__ + extension + "?customerId=" + customerId;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch subscriptions');

        const res = await response.json();
        const subscriptions = res.map((sub: any) => {
            return new StripeSubscriptionObject(sub['id'], sub['paymentIntentClientSecret'], customerId, sub['status'], "");
        });
        return subscriptions;
    } catch (error) {
        throw error;
    }
}

export const getStripeCustomer = async (): Promise<any> => {
    const firebaseAuthId = localStorage.getItem('firebaseAuthId')
    const extension = "stripe/setup";
    const url = __API_URL__ + extension + "?firebaseAuthId=" + firebaseAuthId;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch stripe customer');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

const createSubscription = async (customerId: string, priceId: string): Promise<StripeSubscriptionObject> => {
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
        const res = await response.json();
        if (!response.ok) throw new Error('Failed to create subscription');
        const subscription = new StripeSubscriptionObject(res.subscription.id, res.subscription.paymentIntentClientSecret, customerId, res.subscription.status, priceId);
        return subscription;
    } catch (error) {
        throw error;
    }
}

const StripeService = () => {
    const [product, setProduct] = useState<any>();
    const [customerId, setCustomerId] = useState<string>("");
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
            const payedSubscription = checkForPayedSubscription(subscriptions);
            if (!payedSubscription) {
                setNeedsSubscription(true);
                const subscription = await createSubscription(customer.customerId, products.data[0].default_price);
                setClientSecret(subscription.clientSecret);
            }
        } catch (error) {
            console.error("Error initializing Stripe service", error);
        }
    }

    const checkForPayedSubscription = (subscription: StripeSubscriptionObject[]) => {
        return subscription.some(sub => sub.status == 'active');
    }

    return {
        init,
        product,
        needsSubscription,
        clientSecret,
        setNeedsSubscription,
    };
};

export default StripeService;