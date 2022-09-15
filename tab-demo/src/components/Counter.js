import React from "react";

const Counter = (props) => {
    const activeFilters = props.activeFilters;
    let counter = activeFilters.length
    // console.log("vanuit Count", activeFilters)
    return <span>{counter}</span>
}


export default Counter