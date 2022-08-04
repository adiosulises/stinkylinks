import { GoogleAuthProvider ,  onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import {auth, existsUsername} from "../firebase/firebase";

import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/authProvider";

import style from "./LoginView.module.css";

export default function LoginView(){
    const navigate = useNavigate();
    // const [currentUser, setCurrentUser] = useState(null);

    /*
    Esta madre es para los estados, para esconder el boton de login si es que ya 
    estas logeado.

    State:
    0 = Inicializado
    1 = Loading
    2 = Login completo
    3 = Login pero sin reigstro
    4 = Nadie logeado
    5 = Ya existe username
    6 = Nuevo username, clic para continuar
    7 = Username no existe
    */
    const [state, setCurrentState] = useState(0);

    /*
    useEffect(() => {
        setCurrentState(1);
        onAuthStateChanged(auth, async (user) =>{
            if(user) {
                const isRegistered = await userExists(user.uid);
                if(isRegistered) {
                    // TODO: reenviar al dashboard
                    navigate('/dashboard')
                    setCurrentState(2);
                } else {
                    // TODO: reedirigir a choose username
                    navigate('/choose-username')
                    setCurrentState(3);
                }
            } else {
                setCurrentState(4);
                console.log("No hay nadie autenticado");
            }
        });
    },[navigate]);
    */

    async function handleOnClick(){
        const googleProvider = new GoogleAuthProvider();
        await signInWithGoogle(googleProvider);

        function refreshPage() {
            window.location.reload(false);
        }

        async function signInWithGoogle(googleProvider) {
            try {
                const res = await signInWithPopup(auth,googleProvider);
                console.log(res);
                setCurrentState(2);
                refreshPage();
                // navigate('/dashboard');
            } catch (error) {
                console.error(error);
            }
        }
    }

    // funciones del auth provider que navegan dependiendo del estado
    function handleUserLoggedIn(user) {
        setCurrentState(2);
        navigate('/dashboard');
    }
    function handleUserNotRegistered(user) {
        navigate('/choose-username')
    }
    function handleUserNotLoggedIn() {
        setCurrentState(4);
    }

    if (state===1) {
        return <div>Loading...</div>;
    }

    if (state===2) {
        return console.log("Estas autenticado y registrado")
    }

    if (state===3) {
        return console.log("Estas autenticado pero no registrado")
    }

    if (state===4) {
        return (
            <div className={style.loginView}>
                <div>
                    <h1>StinkyLinks</h1>
                </div>
                <button className={style.provider} onClick={handleOnClick}>Login with Google</button>
            </div>
        );
    }

    return (
        <AuthProvider 
            onUserLoggedIn={handleUserLoggedIn}
            onUserNotRegistered={handleUserNotRegistered}
            onUserNotLoggedIn={handleUserNotLoggedIn}
        >
            <div>Loading...</div>
        </AuthProvider>
    );
    
}