const API_URL = 'http://localhost:8080';

const PREFIX = {
    BANNER: `${API_URL}/banners`,
    NOTICE: `${API_URL}/notices`,
}
const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_URL}/login`,
        LOGOUT: `${API_URL}/logout`,
    },
    INFORMATION: {
        UPLOAD_URL: `${PREFIX.BANNER}/upload-url`,
        LOGIN_BANNER: `${PREFIX.BANNER}/login`,
        HOME_BANNER: `${PREFIX.BANNER}/home`,
        NOTICE: `${PREFIX.NOTICE}`,
        DELETE_LOGIN_BANNER: (id: number) => `${PREFIX.BANNER}/login/${id}`,
        DELETE_HOME_BANNER: (id: number) => `${PREFIX.BANNER}/home/${id}`,
        DELETE_NOTICE: (id: number) => `${PREFIX.NOTICE}/${id}`,
    },
}

export default API_ENDPOINTS;