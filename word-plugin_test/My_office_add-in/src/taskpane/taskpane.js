/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    // Assign event handlers and other initialization logic.
    document.getElementById("insert-paragraph-start").onclick = () => tryCatch(insertParagraphStart);
    document.getElementById("insert-paragraph-end").onclick = () => tryCatch(insertParagraphEnd);
    document.getElementById("clear-body").onclick = () => tryCatch(clearBody);
  }
});

async function insertParagraphStart() {
  await Word.run(async (context) => {
    // TODO1: Queue commands to insert a paragraph into the document.
    const docBody = context.document.body;
    //first parameter is de nieuwe tekst, tweede is de locatie (andere opties: "end" en "replace")
    docBody.insertParagraph("En mijn eigen tekst aan de voorkant.", Word.InsertLocation.start);
    await context.sync();
  });
}

async function insertParagraphEnd() {
  await Word.run(async (context) => {
    const docBody = context.document.body;
    docBody.insertParagraph("En mijn eigen tekst aan het einde.", Word.InsertLocation.end);
    await context.sync();
  });
}

async function clearBody() {
  await Word.run(async (context) => {
    const docBody = context.document.body;
    docBody.clear(); 
    await context.sync();
  });
}


/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
  try {
      await callback();
  } catch (error) {
      // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
      console.error(error);
  }
}