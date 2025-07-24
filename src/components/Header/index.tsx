import cls from "./style.module.css"
import { logout } from "@/store/authThunks"
import {useNavigate} from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store/authHook";


export default function Header() {
    const user = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    async function handleLogOut() {
        try{
            await dispatch(logout()).unwrap();
        }
        catch{
            console.error("failed to logout");
        }finally{
            navigate("/login");

        }
    }

    return (
        <header className={cls.header}>
            <div className={cls.container}>
                <h1 className={cls.title}>Привет, {user?.email || 'Друг'} </h1>
                <button style={{borderColor: "white"}} onClick={handleLogOut}>Выход</button>
            </div>
        </header>
    )
}