// =========================================================================
// const - let - var
// =========================================================================


// VAR niet gebruiken, is vervallen
// altijd const gebruiken, tenzij je de variabele later wil re-assignen.
// dan gebruik je let

// terecht gebruik van let:
export const typeToElementType = (item, elementProps) => {
    let elementType;
    switch (item.type) {
        case "alinea":
            elementType = "p";
            elementProps = "txt-alinea";
            break;
        case ___blablabla____
    }
}
