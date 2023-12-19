import { useEffect, useState } from "react";
import styles from "./Project.module.css";
import { useParams } from "react-router-dom";

export default function Project() {
  const [project, setProject] = useState({});

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setProject(data));
  });

  return (
    <div>
      <p>{project.name} </p>
    </div>
  );
}
