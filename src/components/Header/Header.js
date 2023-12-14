import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/costs_logo.png";

export default function Header() {
  return (
    <div>
      <nav className={styles.menu}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="Costs" />
        </Link>
        <ul className={styles.menu_items}>
          <li className={styles.menu_items}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.menu_items}>
            <Link to="/contact">Contato</Link>
          </li>
          <li className={styles.menu_items}>
            <Link to="/about">Sobre</Link>
          </li>
          <li className={styles.menu_items}>
            <Link to="/projects"> Projetos</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
