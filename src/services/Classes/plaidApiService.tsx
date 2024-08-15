import { useCallback, useEffect, useState } from 'react';
import {
    PlaidLinkError,
    PlaidLinkOnEvent,
    PlaidLinkOnEventMetadata,
    PlaidLinkOnExit,
    PlaidLinkOnExitMetadata,
    PlaidLinkOnSuccess,
    PlaidLinkOnSuccessMetadata,
    PlaidLinkStableEvent,
    usePlaidLink
} from 'react-plaid-link';
import { Account } from './classes';

export const generateLinkToken = async () => {
    const extension = "plaid/create-link-token";
    const url = __API_URL__ + extension;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                public_token: 'GENERATED_LINK_TOKEN',
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating link token:', error);
        throw error;
    }
};

const PlaidService = () => {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [newAccounts, setNewAccounts] = useState<Account[]>([]);

    const handleNewAccounts = (data: any) => {
        const accounts = data.accounts.map((account: any) => {
            return new Account(account.id, account.accountName, account.accountType, account.accountSource, String(new Date()), undefined, data.access_token);
        });
        console.log('New accounts:', accounts);
        setNewAccounts([...newAccounts, ...accounts]);
    }

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
            console.log('public_token', public_token);
            console.log('metadata', metadata);
            const extension = "plaid/exchange-public-token";
            const url = __API_URL__ + extension;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "public_token": public_token,
                        "accounts": metadata.accounts,
                        "source": metadata.institution?.name
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Data:', data);
                handleNewAccounts(data);
            }
            catch (error) {
                console.error('Error exchanging public token:', error);
            }
        },
        []
    );

    const onExit = useCallback<PlaidLinkOnExit>(
        (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
            if (error && error.error_code === 'INVALID_LINK_TOKEN') {
                // Handle invalid link token
            }
        },
        []
    );

    const onEvent = useCallback<PlaidLinkOnEvent>(
        (eventName: PlaidLinkStableEvent | string, metadata: PlaidLinkOnEventMetadata) => {
            console.log('event', eventName, metadata);
        },
        []
    );

    useEffect(() => {
        const fetchLinkToken = async () => {
            try {
                const token = await generateLinkToken();
                setLinkToken(token);
                console.log('Link token set:', token);
            } catch (error) {
                console.error('Error generating link token:', error);
            }
        };

        if (!linkToken) {
            console.log('Fetching link token');
            fetchLinkToken();
        }
    }, [linkToken]);

    const { open, exit, ready } = usePlaidLink({
        token: linkToken || '',
        onSuccess,
        onExit,
        onEvent,
    });

    return { open, exit, ready, newAccounts };
};

export default PlaidService;






