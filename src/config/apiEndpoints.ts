const API_URL = 'http://localhost:8080';

const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_URL}/login`,
        LOGOUT: `${API_URL}/logout`,
    },
    OFFICE: {
        TEST1: `${API_URL}/office/admin/test1`,
    },
}

export default API_ENDPOINTS;