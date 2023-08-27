# Imports
import argparse
import csv
import os
import datetime


# Do not change these lines.
__winc_id__ = "a2bc36ea784242e4989deb157d527ba0"
__human_name__ = "superpy"


# Your code below this line.
def main():
    pass


if __name__ == "__main__":
    main()

StockLijst = []
with open("C:/Projecten/studie-projecten/00_Winc/superpy/inkoop.csv") as csv_file:
    reader = csv.reader(csv_file)
    next(reader)  # Om de kopregel over te slaan
    for row in reader:
        id = int(row[0])
        naam = row[1]
        inkoop_prijs = float(row[2])
        aantal = int(row[3])

        product = {'id': id, 'naam': naam, 'inkoop_prijs': inkoop_prijs, 'aantal': aantal}
        #print(product)
        StockLijst.append(product)

# automatich ophogen id
# Vind het hoogste id in de huidige StockLijst
hoogste_id = max(item['id'] for item in StockLijst)

# Genereer een nieuw id door het hoogste id met 1 te verhogen
nieuw_id = hoogste_id + 1

# Maak een nieuw product met het nieuwe id en andere gegevens
product = {'id': nieuw_id, 'naam': 'aardappel', 'inkoop_prijs': 0.60, 'aantal': 20}

# Voeg het nieuwe product toe aan de StockLijst
StockLijst.append(product)
#print(StockLijst)

# wegschrijven naar bestand Inventaris
# Definieer de naam van het CSV-bestand
csv_bestand = 'Inventaris.csv'

# Schrijf de inhoud van de StockLijst naar het CSV-bestand
with open(csv_bestand, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['id', 'naam', 'inkoop_prijs', 'aantal'])  # Schrijf de kolomkoppen

    for product in StockLijst:
        writer.writerow([product['id'], product['naam'], product['inkoop_prijs'], product['aantal']])

## check of bestand al bestaat:
## niet nodig, bestand wordt overschreven....
# if os.path.exists('Inventaris.csv'):
#     print(f"Het bestand {'Inventaris.csv'} bestaat al.")
# else:
#     print(f"Het bestand {'Inventaris.csv'} bestaat nog niet.")


# verkoop van een aantal van een product
product_naam = 'aardappel'
aantal_verkocht = 2

# Zoek het product in de StockLijst op basis van de naam
for product in StockLijst:
    if product['naam'] == product_naam:
        product['aantal'] -= aantal_verkocht
        break   #om de for-loop te verlaten'



