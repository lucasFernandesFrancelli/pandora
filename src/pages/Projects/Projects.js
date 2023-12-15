import { useEffect, useState } from "react";
import styles from "./Projects.module.css";
import CreateProjectModal from "./CreateProjectModal/CreateProjectModal";
import { BsPencil, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import UpdateProjectModal from "./UpdateProjectModal/UpdateProjectModal";

export default function Projects() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSelectProjectToEdit = (projectId) => {
    const projectFound = projects.find((p) => p.id === projectId);
    if (projectFound) {
      setSelectedProject(projectFound);
      setIsUpdateModalOpen(true);
    }
  };

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

  function handleDeleteProject(id) {
    const confirm = window.confirm(
      "Tem certeza que deseja deletar este projeto?"
    );

    if (!confirm) {
      return;
    }

    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id));
        toast.success("Projeto deletado com sucesso");
      })
      .catch((err) => toast.error("Erro ao deletar o projeto"));
  }

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
        {isOpen && (
          <CreateProjectModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setProjects={setProjects}
          />
        )}
      </header>
      <div className={styles.project_list}>
        {projects.length > 0 &&
          projects.map((project) => (
            <div key={project.id} className={styles.project_card}>
              <h4>{project.name}</h4>
              <p>
                <span>Orçamento: </span>R${project.investment}
              </p>
              <p className={styles.category_text}>
                <span
                  className={styles[project.category.name.toLowerCase()]}
                ></span>
                {project.category.name}
              </p>
              <div className={styles.card_actions}>
                <button
                  className={styles.edit_button}
                  onClick={() => handleSelectProjectToEdit(project.id)}
                >
                  <BsPencil /> Editar
                </button>

                <button
                  className={styles.delete_button}
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <BsTrash /> Excluir
                </button>
              </div>
            </div>
          ))}
        {isUpdateModalOpen && (
          <UpdateProjectModal
            isUpdateModalOpen={isUpdateModalOpen}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            setProjects={setProjects}
            projectId={selectedProject.id}
          />
        )}
      </div>
    </>
  );
}
