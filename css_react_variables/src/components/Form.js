import React from "react";
import employees from "../data";
import "./form.css"


function Form() {

  return (
    <form>

    <div className="list">
        {employees.map((name, idx) => (
          <div className="eerste" key={idx}>{name}</div>
        ))}
      </div>
  </form>
  );
}

export default Form;
