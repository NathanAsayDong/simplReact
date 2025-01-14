import { OnboardingStatus } from "./classes";

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
        const errorData = await response.json();
        alert(errorData.message);
        return false;
    }
    const data = await response.json();
    return data;
}

export const getUserOnboardStatus = async (id: string): Promise<OnboardingStatus> => {
    const response = await fetch(`${baseUrl}onboarding-status?userId=${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch onboarding status');
    }
    const data = await response.json();
    const status: OnboardingStatus = data.status as OnboardingStatus;
    return status;
}

export const updateUserOnboardStatus = async (id: string, status: OnboardingStatus) => {
    const response = await fetch(baseUrl + 'onboarding-status', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: id,
            status: status
        })
    });
    if (!response.ok) {
        return false;
    }
    const data = await response.json();
    return data;
}