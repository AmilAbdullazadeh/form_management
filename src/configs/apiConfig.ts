const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const endpoints = {
    forms: {
        all: `${API_URL}/api/forms`,
        byId: (id: string) => `${API_URL}/api/forms/${id}`,
    },
}