export function copyStyles(sourceDoc, targetDoc) {
    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        // console.log("styleSheet", styleSheet)
      if (styleSheet.cssRules) {
        // true for inline styles
        const newStyleEl = sourceDoc.createElement("style");
  
        Array.from(styleSheet.cssRules).forEach(cssRule => {
          newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
        });
  
        targetDoc.head.appendChild(newStyleEl);
      } else if (styleSheet.href) {
        // true for stylesheets loaded from a URL
        const newLinkEl = sourceDoc.createElement("link");
  
        newLinkEl.rel = "stylesheet";
        newLinkEl.href = styleSheet.href;
        targetDoc.head.appendChild(newLinkEl);
      }
    });
  }