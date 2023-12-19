import React, { useEffect, useState } from "react";
import style from "./CreateProjectModal.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function CreateProjectModal({ isOpen, setIsOpen, setProjects }) {
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
  }, []);

  function sendProject(e) {
    e.preventDefault();

    fetch("http://localhost:5000/projects", {
      method: "POST",
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
        toast.success("Projeto criado com sucesso!");
        handleResetInputValues();
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
      })
      .catch((err) => console.log(err));
  }

  function handleResetInputValues() {
    setIsOpen(false);
    setProjectName("");
    setProjectInvestment(0);
    setProjectCategory("");
  }

  if (isOpen) {
    return (
      <div className={style.background}>
        <div className={style.modal}>
          <div className={style.modal_content}>
            <h1>Criar Projeto</h1>

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
                      <option>Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option
                          value={category.id}
                          key={category.id}
                          defaultValue={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={style.buttons}>
                  <button
                    onClick={() => handleResetInputValues()}
                    className={style.close_window}
                  >
                    Fechar
                  </button>

                  {!projectName ||
                  !projectInvestment ||
                  projectCategory.id === undefined ||
                  projectCategory.name === "Selecione uma categoria" ? (
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
