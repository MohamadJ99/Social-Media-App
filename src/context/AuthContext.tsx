"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const storedToken = localStorage.getItem("token");


            if (!storedToken) {
                setLoading(false);
                return;
            }

            setToken(storedToken);


            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                            Accept: "application/json",
                        },
                    }
                );


                if (!response.ok) {
                    throw new Error("Invalid token");
                }

                const data = await response.json();

                setUser(data.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            } catch (error) {
                console.error("Authentication error:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const logout = async () => {
        if (token) {
            try {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/logout`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );
            } catch (error) {
                console.error("Logout error:", error);
            }
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};