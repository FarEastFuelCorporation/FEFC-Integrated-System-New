// auth.js
export const isAuthenticated = () => {
    // Check if user is authenticated (e.g., by checking a token in localStorage)
    return localStorage.getItem('authToken') !== null;
};

export const getUser = () => {
    // Retrieve the user object from localStorage (or other storage)
    return JSON.parse(localStorage.getItem('user'));
};

export const login = (user, token) => {
    // Store the user object and token in localStorage (or other storage)
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
};

export const logout = () => {
    // Clear the user object and token from localStorage (or other storage)
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
};

export const signup = ({ username, role }) => {
    // Here, you can add logic to handle signup, such as storing the user in a database.
    // For this example, we'll just set the current user.
    // currentUser = { username, role };
};