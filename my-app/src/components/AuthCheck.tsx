import React, { ReactNode } from 'react';

interface AuthCheckProps {
    children: ReactNode;
    allowedRole: string
}

export const CUSTOMER = '1'
export const MODERATOR = '2'

const AuthCheck: React.FC<AuthCheckProps> = ({ children, allowedRole }) => {
    const expires_at_iso = localStorage.getItem("expires_at")
    const expires_at = expires_at_iso ? new Date(expires_at_iso) : null
    const userRole = localStorage.getItem('role')
    const access = expires_at && userRole && expires_at > new Date() && parseInt(userRole) >= parseInt(allowedRole)

    return access ? (
        <>{children}</>
    ) : (
        <h2 className="text-center">Страница недоступна</h2>
    );
};

export default AuthCheck