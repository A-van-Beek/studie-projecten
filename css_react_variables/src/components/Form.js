import React, { useState } from "react";
import employees from "../data";
import "./form.css"


function Form() {
  const [query, setQuery] = useState("");


  const filteredEmployees = employees.filter((name) => {
    return name.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  });

  return (
    <form>

    <div className="list">
        {filteredEmployees.map((name, idx) => (
          <div className="eerste" key={idx}>{name}</div>
        ))}
      </div>
  </form>
  );
}

export default Form;
