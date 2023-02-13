import React, { useEffect, useState, useRef } from "react";

const DepWindow = () => {
    const [isOpen, setIsOpen] = useState(false);

    const externalWindow = useRef(
        window.open("", "", "width=600,height=400,left=200,top=200")
      );


    const content2 = <div>hier tweede tekst DepWindow</div>
    
    return (
        <>
         <button onClick={() => setIsOpen(!isOpen)}>
            {!isOpen ? "Open" : "Close"}
         </button>
         {isOpen && <externalWindow onClose={() => setIsOpen(false)}>
                <p>This text is displayed in a new window. 👀</p>
                <p>And all the states are shared ! 👌</p>
            </externalWindow>}
        </>
    )

}

export default DepWindow