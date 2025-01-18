import HomePage from "./components/HomePage";
import { AuthProvider } from "./UserContext";

function App() {
    return (
        <AuthProvider>
            <HomePage />
        </AuthProvider>
    );
}

export default App;
