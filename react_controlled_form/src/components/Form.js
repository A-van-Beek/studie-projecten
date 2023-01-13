import React, { useState } from "react";
import employees from "../data";

/** 
 * probleem blijft de submit-knop
 * ik probeer even een andere website...
*/

function Form() {
  const [query, setQuery] = useState("");

  const onChange = (event) => setQuery(event.target.value);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("hier", query);
//   }

  const handleSubmit = () => {
    console.log("hier", query);
  }

  const filteredEmployees = employees.filter((name) => {
    return name.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  });


  return (
    <>
    <div>Input value: {query}</div>
    <input placeholder="Type a value" value={query} onChange={onChange} />
    <input type="submit" value="Submit !" onSubmit={handleSubmit()}/>
    <div className="list">
        {filteredEmployees.map((name, idx) => (
          <div key={idx}>{name}</div>
        ))}
      </div>
  </>
  );
}

export default Form;
