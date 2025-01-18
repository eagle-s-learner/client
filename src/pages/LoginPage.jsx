import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../UserContext";
import SignupPage from "./SignUpPage";

export default function LoginPage({ setShowLoginPage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showSignup, setShowSignup] = useState(false);

    const userCtx = useContext(AuthContext);

    async function handleLogIn(ev) {
        ev.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        let response = null;
        try {
            response = await axios.post(
                "http://localhost:3200/api/login/",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                // console.log(response.data)
                userCtx.setLogin(true);
                userCtx.setUserInfo(response.data);
                setShowLoginPage(false);
            }
        } catch (error) {
            // console.log(error)
            console.log(error);
        } finally {
            setShowLoginPage(false);
        }
        // console.log("login")
    }

    function handleShowSignUp(ev){
        ev.preventDefault();
        // setShowLoginPage(false);
        setShowSignup(true);
    }

    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold">Login Required</h3>
                    <p className="text-gray-600 mt-2">
                        Please log in to Your account
                    </p>
                    <label>Email</label>
                    <input
                        className="py-2 px-3 block border-2 w-full mb-2"
                        type="eamil"
                        onChange={(ev) => setEmail(ev.target.value)}
                        value={email}
                        required
                        placeholder="Enter your email here"
                    />
                    <label>Password</label>
                    <input
                        className="py-2 px-3 block border-2 w-full mb-2"
                        type="password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        value={password}
                        required
                        placeholder="Enter your password here"
                    />
                    <button
                        onClick={handleLogIn}
                        className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Login
                    </button>
                    <p className="text-gray-500">
                        Do not have account?{" "}
                        <button onClick={handleShowSignUp} className="text-blue-400 underline">
                            signup
                        </button>
                    </p>
                    <button
                        onClick={() => setShowLoginPage(false)}
                        className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
            {showSignup && <SignupPage setShowSignup={setShowSignup}/>}
        </div>
    );
}
