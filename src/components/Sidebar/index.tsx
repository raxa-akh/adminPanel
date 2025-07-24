import cls from "./style.module.css";
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
    return (
        <div className={cls.sidebar}>
            <h2 className={cls.title}>Пункт управления</h2>
            <NavLink className={cls.ref} to="/users" end>
             <button style={{borderColor: "white"}}>Список</button> 
            </NavLink>
            <NavLink className={cls.ref} to="/users/newReact">
              <button style={{borderColor: "white"}}>Создать(RHF)</button> 
            </NavLink><NavLink className={cls.ref} to="/users/newFormik">
              <button style={{borderColor: "white"}}>Создать(Formik)</button> 
            </NavLink>
        </div>
    );
}