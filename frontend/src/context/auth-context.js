import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    // just used for auto-completion
    login: (token, userId, tokenExpiration) => {},
    logout: () => {}
})