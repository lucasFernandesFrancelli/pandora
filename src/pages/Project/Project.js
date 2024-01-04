import { useEffect, useState } from "react";
import styles from "./Project.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import Service from "./Services/Service";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";

export default function Project() {
  const [project, setProject] = useState({});
  const [removeLoading, setRemoveLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isUpdateServiceModalOpen, setIsUpdateServiceModalOpen] =
    useState(false);
  const [projectServices, setProjectServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(0);

  const { id } = useParams();

  const navigate = useNavigate();

  const handleSelectServiceToEdit = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsServiceModalOpen(true);
    setIsUpdateServiceModalOpen(true);
  };

  const handleDeleteService = (serviceId) => {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este serviço?"
    );

    if (!confirm) {
      return;
    }

    fetch(`http://localhost:5000/services/${serviceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      fetch(`http://localhost:5000/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...project,
          services: [
            ...project.services.filter((service) => service.id !== serviceId),
          ],
        }),
      }).then(() => {
        toast.success("Serviço excluído com sucesso");
        window.location.reload();
      });
    });
  };

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
                <span>Total de orçamento:</span>
                {Number(project.investment).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p>
                <span>Total utilizado:</span>
                {Number(
                  project.services.reduce(
                    (total, { cost }) => total + Number(cost),
                    0
                  )
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p>
                <span>Total disponível:</span>
                {Number(
                  project.investment -
                    project.services.reduce(
                      (total, { cost }) => total + Number(cost),
                      0
                    )
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
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
            <div className={styles.services_list}>
              {project.services.map((service) => (
                <div key={service.id} className={styles.service_card}>
                  <h4>{service.name}</h4>
                  <p>
                    <span>Custo:</span>
                    {Number(service.cost).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p
                    data-tooltip-id="service_description_tooltip"
                    data-tooltip-content={service.description}
                  >
                    <span>Descrição:</span>
                    {service.description.length > 10
                      ? `${service.description.slice(0, 10)}...`
                      : service.description}

                    <Tooltip
                      id="service_description_tooltip"
                      delayShow={500}
                      style={{ fontSize: "0.8rem" }}
                    />
                  </p>
                  <div className={styles.card_actions}>
                    <button
                      className={styles.edit_button}
                      onClick={() => handleSelectServiceToEdit(service.id)}
                    >
                      <BsPencil /> Editar
                    </button>

                    <button
                      className={styles.delete_button}
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <BsTrash /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isServiceModalOpen && (
            <Service
              isServiceModalOpen={isServiceModalOpen}
              setIsServiceModalOpen={setIsServiceModalOpen}
              projectId={id}
              project={project}
              setProject={setProject}
              isUpdateServiceModalOpen={isUpdateServiceModalOpen}
              setIsUpdateServiceModalOpen={setIsUpdateServiceModalOpen}
              selectedServiceId={selectedServiceId}
            />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
