import { useEffect, useState } from "react";
import styles from "./Project.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import Service from "./Services/Service";

export default function Project() {
  const [project, setProject] = useState({});
  const [removeLoading, setRemoveLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [projectServices, setProjectServices] = useState([]);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProject(data);
          setRemoveLoading(true);
        })
        .catch((err) => console.log(err));
    }, 300);
  }, [id]);

  return (
    <>
      {removeLoading ? (
        <div className={styles.project_details}>
          <div className={styles.details_container}>
            <div className={styles.h1_style}>
              <h1>Projeto: {project.name}</h1>
            </div>

            <button
              className={styles.return_button}
              onClick={() => navigate("/projects")}
            >
              Voltar
            </button>
            <div className={styles.project_info}>
              <p>
                <span>Categoria:</span> {project.category.name}
              </p>
              <p>
                <span>Total de orçamento:</span>R$ {project.investment}
              </p>
              <p>
                <span>Total utilizado:</span>R$ {project.cost}
              </p>
            </div>
          </div>

          <div className={styles.service_form_container}>
            <h2>Serviços</h2>

            <button
              className={styles.service_button}
              onClick={() => setIsServiceModalOpen(true)}
            >
              Adicionar serviço
            </button>
          </div>
          {project.services.length > 0 && (
            <div>
              <ul>
                {project.services.map((service) => (
                  <li key={service.id}>{service.name}</li>
                ))}
              </ul>
            </div>
          )}
          {isServiceModalOpen && (
            <Service
              isServiceModalOpen={isServiceModalOpen}
              setIsServiceModalOpen={setIsServiceModalOpen}
              projectId={id}
              project={project}
              setProject={setProject}
            />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
