import { useEffect, useState } from "react";
import style from "./Service.module.css";
import { toast } from "react-toastify";

export default function Service({
  isServiceModalOpen,
  setIsServiceModalOpen,
  projectId,
  setProject,
  project,
  isUpdateServiceModalOpen,
  selectedServiceId,
  setIsUpdateServiceModalOpen,
}) {
  const [serviceName, setServiceName] = useState("");
  const [serviceCost, setServiceCost] = useState(0);
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceId, setServiceId] = useState(0);

  function sendService(e) {
    e.preventDefault();

    const costSum = project.services.reduce(
      (acc, curr) => acc + Number(curr.cost),
      0
    );

    if (costSum + Number(serviceCost) > project.investment) {
      toast.error("O custo do serviço ultrapassa o orçamento do projeto");
      return;
    }

    fetch(`http://localhost:5000/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: serviceName,
        cost: serviceCost,
        description: serviceDescription,
        project: {
          id: projectId,
        },
      }),
    })
      .then(() => {
        toast.success("Serviço criado com sucesso!");
        fetch(`http://localhost:5000/services`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            fetch(`http://localhost:5000/projects/${projectId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...project,
                services: [
                  ...project.services,
                  {
                    id: data[data.length - 1].id,
                    name: serviceName,
                    cost: serviceCost,
                    description: serviceDescription,
                  },
                ],
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                setProject(data);
              })
              .catch((err) => console.log(err));
          })
          .then(() => {
            handleResetInputValues();
          });
      })
      .catch((err) => console.log(err));
  }

  function updateService(e) {
    e.preventDefault();

    fetch(`http://localhost:5000/services/${selectedServiceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: serviceName,
        cost: serviceCost,
        description: serviceDescription,
        project: {
          id: projectId,
        },
      }),
    })
      .then(() => {
        toast.success("Serviço atualizado com sucesso!");
        const newServices = project.services.map((service) => {
          if (service.id === selectedServiceId) {
            return {
              ...service,
              name: serviceName,
              cost: serviceCost,
              description: serviceDescription,
            };
          } else {
            return service;
          }
        });
        fetch(`http://localhost:5000/projects/${project.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...project,
            services: [...newServices],
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setProject(data);
          })
          .then(() => {
            handleResetInputValues();
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  function handleResetInputValues() {
    setIsServiceModalOpen(false);
    setIsUpdateServiceModalOpen(false);
    setServiceName("");
    setServiceCost(0);
    setServiceDescription("");
  }

  useEffect(() => {
    if (isServiceModalOpen && isUpdateServiceModalOpen) {
      fetch(`http://localhost:5000/services/${selectedServiceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setServiceName(data.name);
          setServiceCost(data.cost);
          setServiceDescription(data.description);
        });
    }
  }, [isServiceModalOpen, isUpdateServiceModalOpen]);

  if (isServiceModalOpen && !isUpdateServiceModalOpen) {
    return (
      <div className={style.background}>
        <div className={style.modal}>
          <div className={style.modal_content}>
            <h1>Criar Serviço</h1>

            <div className={style.project_form}>
              <form onSubmit={sendService}>
                <div className={style.project_form_field}>
                  <label>
                    Nome do serviço:
                    <input
                      type="text"
                      placeholder="Insira o nome do serviço"
                      onChange={(e) => setServiceName(e.target.value)}
                      value={serviceName}
                      name="name"
                    />
                  </label>
                </div>
                <div className={style.project_form_field}>
                  <label>
                    Custo total:
                    <input
                      type="number"
                      placeholder="Insira o custo do serviço"
                      onChange={(e) => setServiceCost(e.target.value)}
                      value={serviceCost}
                      name="cost"
                    />
                  </label>
                </div>
                <div className={style.project_form_field}>
                  <label>
                    Descrição do serviço:
                    <div className={style.project_form_field_textarea}>
                      <textarea
                        type="textarea"
                        placeholder="Insira a descrição do serviço"
                        onChange={(e) => setServiceDescription(e.target.value)}
                        value={serviceDescription}
                        name="description"
                      />
                    </div>
                  </label>
                </div>

                <div className={style.buttons}>
                  <button
                    onClick={() => handleResetInputValues()}
                    className={style.close_window}
                  >
                    Fechar
                  </button>

                  {!serviceName || !serviceCost || !serviceDescription ? (
                    <button
                      disabled={true}
                      type="submit"
                      className={style.submit_button}
                    >
                      Enviar
                    </button>
                  ) : (
                    <button type="submit" className={style.submit_button}>
                      Enviar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isServiceModalOpen && isUpdateServiceModalOpen) {
    return (
      <div className={style.background}>
        <div className={style.modal}>
          <div className={style.modal_content}>
            <h1>Atualizar Serviço</h1>

            <div className={style.project_form}>
              <form onSubmit={updateService}>
                <div className={style.project_form_field}>
                  <label>
                    Nome do serviço:
                    <input
                      type="text"
                      placeholder="Insira o nome do serviço"
                      onChange={(e) => setServiceName(e.target.value)}
                      value={serviceName}
                      name="name"
                    />
                  </label>
                </div>
                <div className={style.project_form_field}>
                  <label>
                    Custo total:
                    <input
                      type="number"
                      placeholder="Insira o custo do serviço"
                      onChange={(e) => setServiceCost(e.target.value)}
                      value={serviceCost}
                      name="cost"
                    />
                  </label>
                </div>
                <div className={style.project_form_field}>
                  <label>
                    Descrição do serviço:
                    <div className={style.project_form_field_textarea}>
                      <textarea
                        type="textarea"
                        placeholder="Insira a descrição do serviço"
                        onChange={(e) => setServiceDescription(e.target.value)}
                        value={serviceDescription}
                        name="description"
                      />
                    </div>
                  </label>
                </div>

                <div className={style.buttons}>
                  <button
                    onClick={() => handleResetInputValues()}
                    className={style.close_window}
                  >
                    Fechar
                  </button>

                  {!serviceName || !serviceCost || !serviceDescription ? (
                    <button
                      disabled={true}
                      type="submit"
                      className={style.submit_button}
                    >
                      Enviar
                    </button>
                  ) : (
                    <button type="submit" className={style.submit_button}>
                      Enviar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
