const BASEURL = "http://localhost:8000";

export const login = async (username: string, password: string) => {
    const response = await fetch(`${BASEURL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
        alert("Login failed");
        throw new Error("Login failed");
    }

    return response.json();
}

export const signup = async (username: string, password: string) => {
    const response = await fetch(`${BASEURL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
        throw new Error("Signup failed");
    }

    return response.json();
}

export const sendMessage = async (token:string, message: string) => {
    const response = await fetch(`${BASEURL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return response.json();
}

export const getSessionMessages = async (token: string, sessionId: number) => {
    const response = await fetch(`${BASEURL}/sessions/${sessionId}/messages`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch messages");
    }

    return response.json();
}

export const getCurrentSession = async (token: string) => {
    const response = await fetch(`${BASEURL}/session`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch current session");
    }

    return response.json();
}

export const getUserInfo = async (token: string) => {
    const response = await fetch(`${BASEURL}/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user info");
    }

    return response.json();
}