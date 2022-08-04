import AuthProvider from "../components/authProvider";
import { useNavigate } from "react-router-dom";
import { logOut } from "../firebase/firebase";

export default function SignOutView(){
    async function handleUserLoggedIn(user) {
        await logOut();
    }
    const navigate = useNavigate();
    function handleUserNotRegistered(user) {
        navigate('/login');
    }
    function handleUserNotLoggedIn() {
        navigate('/login');
    }
    return <AuthProvider
        onUserLoggedIn={handleUserLoggedIn}
        onUserNotLoggedIn={handleUserNotRegistered}
        onUserNotRegistered={handleUserLoggedIn}
        ></AuthProvider>;
}