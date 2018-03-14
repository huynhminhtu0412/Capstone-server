module.exports = {
    DEFAULT_PAGE_SIZE: 10,
    SECRET: 'elearning',
    AUTHENTICATE_EXPIRE: '60d', // using rauchg/ms.js
    AUTHENTICATE_RESIGN_TOKEN: 86400, // second -- 86400s = 1d    
    WEB_HOST_NAME: 'http://localhost:8765',
    ROLE: { 'STUDENT': 0, 'TEACHER': 1, 'ACADEMY_SECTION': 2, 'ADMIN': 3 },
}