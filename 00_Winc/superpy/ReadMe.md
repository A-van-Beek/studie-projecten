opdracht:
maak een supermarkt applicatie die via de commant line gebruikt word (CLI)

hiermee moet het assortiment bijgehouden kunnen worden (welke producten zijn er), inventaris (hoeveel van elk, gegevens over inkoopprijs en houdbaarheid, gegevens over verkoop (prijs, gepasseerde houdbaarheidsdatum).

voorbeeld velden CSV bestand:
    bought.csv
    * id
    * product-name
    * buy-date
    * buy-price
    * expiration-date

    sold.csv
    * id
    * bought-id
    * sell-price
    * sell-date

Wat moet het kunnen / hebben ?
- een gebruikershandleiding met veel voorbeelden
- mogelijkheid om de datum te bepalen en vooruit te zetten, zodat je ook een toekomstige situatie kan faken
- opslaan van aan- en verkoop van producten op bepaalde data
- overzicht geven van omzet/winst over specifieke periodes
- export selectie van data naar CSV
- twee extra functionaliteiten:
    * gebruik external module Rich (https://github.com/willmcgugan/rich, voor duidelijke video: https://calmcode.io/rich/introduction.html)
    *  mogelijkheid tot visualisatie van statistieken via Matplotlib (https://matplotlib.org/)
    - export/import reports andere formats dan CSV (extra dus)
    - iets anders, eigen keuze

Documentatie
- 300 woorden over 3 technische aspecten/elementen in report.md (beschrijf wat het probleem was en waarom je het op deze manier hebt opgelost/geïmplementeerd)

gebruik
- csv.reader / csv.writer
- argparse
- datetime

