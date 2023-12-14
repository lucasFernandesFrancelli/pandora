import LinkButton from "../../components/LinkButton/LinkButton";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div>
      <section className={styles.home_container}>
        <div className={styles.home_content}>
          <h1>
            Bem-vindo ao <span>Pandora</span>
          </h1>
          <p>Comece a gerenciar os seus projetos agora mesmo!</p>
        </div>

        <LinkButton to="/projects" text="Meus Projetos" />
      </section>
    </div>
  );
}
