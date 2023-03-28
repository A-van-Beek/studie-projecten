# Word sjablonen

## Instructies mbt committen
Om wijzigingen in de code te kunnen committen en de code ook daadwerkelijk onder versiebeheer 
te houden is het van belang dit op een bepaalde manier te doen in Word. Hieronder wordt uitgelegd
welke wijziging op welke manier gecommit dient te worden.

<strong>Let op!!!</strong> Zowel het Word-template als de export bestanden van de formulieren bevatten binary files,
waardoor je niet tegelijk in verschillende branches/commits aan de bestanden kunt werken.

### Wijzigingen in het lint
Om wijzigingen in het lint (knoppenbalk) aan te brengen doe je het volgende:
1. Installeer de [Custom UI Editor For Microsoft Office](https://bettersolutions.com/vba/ribbon/custom-ui-editor.htm).
2. Open de geïnstalleerde editor en laad het bestand ``WordSjabloon.dotm`` in. (zorg ervoor dat het template niet al geopend is)
3. Voer de wijzigingen door in de XML, sla deze op en sluit de editor.
4. Unzip het bestand ``WordSjabloon.dotm`` naar de map ``WordSjabloon``.
5. Voeg de wijzigingen in beide toe aan de commit.


<strong>Let op!!!</strong> Het bestand ``customUI.xml`` in de root is gekoppeld aan het schema ``customUI.xsd`` om voor het ontwikkelen
te kijken of je geen schema fouten hebt in de xml. Mochten er fouten in de xml zitten en je plakt deze xml
in het Word-template, dan wordt deze xml volledig genegeerd. Het opgeven van de ``schemaLocation`` is niet toegestaan in het template.
de koppeling wordt gemaakt met de volgende link: 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.microsoft.com/office/2009/07/customui customUI.xsd"

### Wijzigingen in VBA
Om wijzigingen in VBA in het template te committen doe je het volgende:
1. Open het bestand ``WordSjabloon.dotm`` en open vervolgens de VBA Editor met ``ALT+F11``.
2. Voer de wijzigingen door in het gewenste bestand vanuit het project menu aan de linker zijde (onder het kopje TemplateProject).
3. Sla de wijzigingen op en exporteer het aangepaste bestand door met de rechter muisknop hierop te klikken en te kiezen voor exporteren.
Exporteer het bestand naar de map ``VBA Bestanden`` en daar in de juiste submap.
4. Sluit het bestand ``WordSjabloon.dotm`` en unzip deze naar de map ``Word-sjabloon-map``.
5. Voeg de wijzigingen in de bestanden toe aan de commit.
