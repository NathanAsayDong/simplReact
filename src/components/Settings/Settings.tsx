
import { FC } from 'react';
import './Settings.scss';


interface SettingsProps {}

const Settings: FC<SettingsProps> = () =>  {
    
    // // The usePlaidLink hook manages Plaid Link creation
    // // It does not return a destroy function;
    // // instead, on unmount it automatically destroys the Link instance
    // const config: PlaidLinkOptions = {
    //     onSuccess: (public_token, metadata) => {},
    //     onExit: (err, metadata) => {},
    //     onEvent: (eventName, metadata) => {},
    //     token: 'GENERATED_LINK_TOKEN',
    // };

    // const { open, ready, error } = usePlaidLink(config);

    // const onSuccess = useCallback<PlaidLinkOnSuccess>(
    //     (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
    //         // log and save metadata
    //         // exchange public token
    //         fetch('//yourserver.com/exchange-public-token', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: {
    //             public_token,
    //         },
    //         });
    //     },
    //     [],
    // );

    // const onExit = useCallback<PlaidLinkOnExit>(
    //     (error: PlaidLinkError, metadata: PlaidLinkOnExitMetadata) => {
    //       // log and save error and metadata
    //       // handle invalid link token
    //     if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
    //         // generate new link token
    //       }
    //       // to handle other error codes, see https://plaid.com/docs/errors/
    //     },
    //     [],
    // );

    // const onEvent = useCallback<PlaidLinkOnEvent>(
    //     (
    //       eventName: PlaidLinkStableEvent | string,
    //       metadata: PlaidLinkOnEventMetadata,
    //     ) => {
    //       // log eventName and metadata
    //     },
    //     [],
    // );

    // if (ready) {
    //     open();
    //   }

    // exit({ force: true });

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <>
        {/* <div className='body'>
            <p>TESTING PLAID</p>
            <button onClick={testPlad}>Test Plaid</button>
        </div> */}
        <button onClick={logout}>Logout</button>
        </>
    );
}

export default Settings;
