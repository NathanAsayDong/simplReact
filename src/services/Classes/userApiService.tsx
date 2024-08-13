
const baseUrl = __API_URL__;

export const attemptLogin = async (email: string, password: string) => {
    const response = await fetch(baseUrl + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    if (!response.ok) {
        return false;
    }
    const data = await response.json();
    return data;
}

export const attemptCreateAccount = async (email: string | undefined, password: string | undefined) => {
    const response = await fetch(baseUrl + 'createAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    if (!response.ok) {
        return false;
    }
    const data = await response.json();
    return data;
}