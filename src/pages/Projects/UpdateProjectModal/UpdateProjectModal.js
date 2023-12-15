import React, { useEffect, useState } from "react";
import style from "./UpdateProjectModal.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function UpdateProjectModal({
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  setProjects,
  projectId,
}) {
  const [projectName, setProjectName] = useState("");
  const [projectInvestment, setProjectInvestment] = useState(0);
  const [projectCategory, setProjectCategory] = useState({});
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.log(err));

    fetch(`http://localhost:5000/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjectName(data.name);
        setProjectInvestment(data.investment);
        setProjectCategory(data.category);
      })
      .catch((err) => console.log(err));
  }, []);

  function sendProject(e) {
    e.preventDefault();
    fetch(`http://localhost:5000/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        investment: projectInvestment,
        category: { id: projectCategory.id, name: projectCategory.name },
        cost: 0,
        services: [],
      }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Projeto editado com sucesso!");
        fetch("http://localhost:5000/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setProjects(data);
            setIsUpdateModalOpen(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => toast.error("Erro ao editar o projeto!"));
  }

  if (isUpdateModalOpen) {
    return (
      <div className={style.background}>
        <div className={style.modal}>
          <div className={style.modal_content}>
            <h1>Editar Projeto</h1>

            <div className={style.project_form}>
              <form onSubmit={sendProject}>
                <div className={style.project_form_field}>
                  <label>
                    Nome do projeto:
                    <input
                      type="text"
                      placeholder="Insira o nome do projeto"
                      onChange={(e) => setProjectName(e.target.value)}
                      value={projectName}
                      name="name"
                    />
                  </label>
                </div>
                <div className={style.project_form_field}>
                  <label>
                    Orçamento total:
                    <input
                      type="number"
                      placeholder="Insira o orçamento do projeto"
                      onChange={(e) => setProjectInvestment(e.target.value)}
                      value={projectInvestment}
                      name="investment"
                    />
                  </label>
                </div>
                <div className={style.project_form_field}>
                  <label>
                    Categoria do projeto:
                    <select
                      name="category_id"
                      onChange={(e) =>
                        setProjectCategory({
                          id: e.target.value,
                          name: e.target.options[e.target.selectedIndex].text,
                        })
                      }
                      value={projectCategory.id}
                      placeholder="Selecione uma categoria"
                    >
                      <option disabled>Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option value={category.id} key={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={style.buttons}>
                  <button className={style.close_window}>Fechar</button>
                  <button type="submit" className={style.submit_button}>
                    Enviar
                  </button>
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
