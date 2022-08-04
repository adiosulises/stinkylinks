import AuthProvider from "../components/authProvider"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DashobardWrapper from "../components/dashboardWrapper";
import { v4 as uuidv4 } from 'uuid';
import { deleteLink, getLinks, insertNewLink, updateLink } from '../firebase/firebase';
import Link from "../components/link"; 

import style from './DashboardView.module.css';
import styleLinks from '../components/link.module.css';

export default function DashboardView(){
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});
    const [state, setState] = useState(0);
    const [title, setTitle] =useState('')
    const [url, setUrl] =useState('')
    const [links, setLinks] =useState([])

    async function handleUserLoggedIn(user) {
        setCurrentUser(user);
        setState(2);
        const resLinks = await getLinks(user.uid);
        setLinks([...resLinks]);
    }
    function handleUserNotRegistered(user) {
        navigate('/login');
        console.log("No registrado");
    }
    function handleUserNotLoggedIn() {
        navigate('/login');
        console.log("no loggeado");
    }

    if(state === 0) {
        return(
            <AuthProvider 
                onUserLoggedIn={handleUserLoggedIn} 
                onUserNotLoggedIn={handleUserNotLoggedIn} 
                onUserNotRegistered={handleUserNotRegistered}
            >
                Loading...
            </AuthProvider>
        )
    }

    function addLink(){
        if (title !== '' && url !== '') {
            const newLink = {
                id: uuidv4(),
                title: title,
                url: url,
                uid: currentUser.uid
            };
            const res = insertNewLink(newLink);
            newLink.docId = res.id;
            setTitle('');
            setUrl('');
            setLinks([...links, newLink]);
        }
    }

    function handleOnSubmit(e) {
        e.preventDefault();
        addLink();
    }

    function handleOnChange(e) {
        const value = e.target.value;
        if(e.target.name === 'title'){
            setTitle(value);
        }

        if (e.target.name === 'url') {
            setUrl(value);
        }

    }
    
    async function handleUpdateLink(docId, title, url) {
        const link = links.find(item => item.docId === docId);
        link.title = title;
        link.url = url;
        await updateLink(docId, link);
    }

    async function handleDeleteLink(docId) {
        await deleteLink(docId);
        const tmp = links.filter(link => link.docId !== docId);
        setLinks([...tmp]);
    }

    return (
        <DashobardWrapper>
            <div>
                <h1 className={style.centerText}>Dashboard</h1>
                
                <form className={style.entryContainer} action="" onSubmit={handleOnSubmit}>
                    <label htmlFor="title">Title</label>
                    <input className={style.input} type="text" name="title" onChange={handleOnChange}/>

                    <label htmlFor="title">Url</label>
                    <input className={style.input} type="text" name="url" onChange={handleOnChange}/>
                    <div className={style.centerText}>
                        <input className={style.provider} type="submit" value="Create new link"/>
                    </div>

                </form>
                <div className={styleLinks.linksContainer}>
                    {links.map((link) => (
                        <Link 
                            key={link.docId} 
                            docId={link.docId}
                            url={link.url} 
                            title={link.title} 
                            onUpdate={handleUpdateLink} 
                            onDelete={handleDeleteLink}
                        /> 
                    ))}
                </div>
            </div>
        </DashobardWrapper>
    )   
}