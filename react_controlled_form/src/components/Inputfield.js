import React, { useState } from "react";

function Inputfield() {
  
    const doSearch = (e) => {
        if (e.code !== "Enter") {
            console.log("geen enter, voer verder in", e.target.value)
            return
        }
        // e.preventDefault()
        console.log("enter gedrukt, ga zoeken")
    }

    const doNotSearch = (e) => {
        if (e.key === "Enter") {
            console.log("enter gezien !!")
        }
    }
    
    return (
      <form>
      <input placeholder="Type a value" onKeyDown={(e) => {
        doSearch(e);
        doNotSearch(e);
        }} />

    </form>
    );
  }
  
  export default Inputfield;