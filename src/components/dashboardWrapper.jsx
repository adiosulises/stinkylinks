import { Link } from "react-router-dom";

import style from "./DashboardWrapper.module.css";

export default function DashobardWrapper({ children }) {
    return (
        <div>
            <nav className={style.nav}>
                <div>
                    <img src="/images/logo.png" className={style.logo} alt="img" />
                </div>
                <Link to="/dashboard">Links</Link>
                <Link to="/dashboard/profile">Profile</Link>
                <Link to="/signout">Signout</Link>
            </nav>
            <div className="main-container">{children}</div>
        </div>
    )
}