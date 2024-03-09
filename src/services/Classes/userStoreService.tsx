const url = 'https://simpl-api-ca96d9ccde88.herokuapp.com/'
const localUrl = 'http://localhost:8080/'

export const attemptLogin = async (email: string, password: string) => {
    const response = await fetch(localUrl + 'login', {
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

export const attemptCreateAccount = async (email: string, password: string) => {
    const response = await fetch(localUrl + 'createAccount', {
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