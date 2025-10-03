import AppRoutes from "./routes/appRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useEffect } from 'react';
function App() {
    useEffect(() => {
        console.log("App component mounted");
    }, []);

    return (
        <AuthProvider>
            <ToastProvider>
                <AppRoutes />
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
