import { useEffect, useState } from "react";
import styles from "./Projects.module.css";
import CreateProjectModal from "./CreateProjectModal/CreateProjectModal";

export default function Projects() {
  const [isOpen, setIsOpen] = useState(false);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <header className={styles.projects_header}>
        <h1>Meus projetos</h1>
        <div>
          <button
            className={styles.create_project_button}
            onClick={() => setIsOpen(true)}
          >
            Criar projeto
          </button>
        </div>
        {isOpen && <CreateProjectModal isOpen={isOpen} setIsOpen={setIsOpen} />}
      </header>
      <div className={styles.project_list}>
        {projects.length > 0 &&
          projects.map((project) => (
            <div key={project.id} className={styles.project_card}>
              <h4>{project.name}</h4>
              <p>
                <span>Orçamento: </span>R${project.investment}
              </p>
              <p>
                <span>Categoria: </span>
                {project.category.name}
              </p>
              <div>
                <p>Editar</p> <p>Remover</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
