import { useCallback } from 'react';
import {
    PlaidLinkError,
    PlaidLinkOnEvent,
    PlaidLinkOnEventMetadata,
    PlaidLinkOnExit,
    PlaidLinkOnExitMetadata,
    PlaidLinkOnSuccess,
    PlaidLinkOnSuccessMetadata,
    PlaidLinkOptions,
    PlaidLinkStableEvent,
    usePlaidLink
} from 'react-plaid-link';

export const PlaidService = () => {
    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
        // log and save metadata
        // exchange public token
            console.log('public_token', public_token);
            console.log('metadata', metadata);
            fetch('//yourserver.com/exchange-public-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_token,
                }),
            });
        }, [],
    );

    const onExit = useCallback<PlaidLinkOnExit>(
        (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
        // log and save error and metadata
        // handle invalid link token
            if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
                // generate new link token
            }
            // to handle other error codes, see https://plaid.com/docs/errors/
        }, [],
    );

    const onEvent = useCallback<PlaidLinkOnEvent>(
        (eventName: PlaidLinkStableEvent | string, metadata: PlaidLinkOnEventMetadata) => {
            // log eventName and metadata
        }, [],
    );

    const config: PlaidLinkOptions = {
        onSuccess,
        onExit,
        onEvent,
        token: 'GENERATED_LINK_TOKEN',
    };

    const { open, exit, ready } = usePlaidLink(config);
    return { open, exit, ready };
}



