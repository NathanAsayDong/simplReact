const url = 'https://simpl-api-ca96d9ccde88.herokuapp.com/'
const localUrl = 'http://0.0.0.0:8080/'

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
        throw new Error('Failed to login');
    }
    const data = await response.json();
    console.log(data);
    return data;
}