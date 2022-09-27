// =========================================================================
// If - else statement
// =========================================================================


if (data.kop) {
    title = data.kop;
  } else {
    if (data.type === "regelsArtikelgewijs") {
      title = "Regels";
    } else if (data.type === "bijlagenRegels") {
      title = "Bijlagen bij regels";
    } else if (data.type === "divisietekst") {
      title = "(divisie)";
    } else if ("regelsVrijetekst") {
      title = "Regels";
    } else {
      title = "(TODO, uknown type: " + data.type + ")";
    }
  }
