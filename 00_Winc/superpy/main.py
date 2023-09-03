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

#=======================================
# inlezen CSV
#=======================================

StockLijst = []
with open("C:/Projecten/studie-projecten/00_Winc/superpy/inkoop.csv") as csv_file:
    reader = csv.reader(csv_file)
    next(reader)  # Om de kopregel over te slaan
    for row in reader:
        id = int(row[0])
        naam = row[1]
        inkoop_prijs = float(row[2])
        aantal = int(row[3])
        datum_inkoop = datetime.datetime.strptime(row[4], "%d-%m-%Y")
        tht_datum = datetime.datetime.strptime(row[5], "%d-%m-%Y")

        product = {"id": id, "naam": naam, "inkoop_prijs": inkoop_prijs, "aantal": aantal, "datum_inkoop": datum_inkoop, "tht_datum": tht_datum }
        #print(product)
        StockLijst.append(product)
# print(StockLijst)

#=======================================
# formateren date
#=======================================

# om een mooi format weer terug te krijgen:
tht_datetime = StockLijst[0]["tht_datum"]
tht_formatted = tht_datetime.strftime("%Y-%m-%d")
# print(tht_formatted)

#=======================================
# ophogen id
#=======================================

def GetNieuwId():
    # Vind het hoogste id in de huidige StockLijst
    hoogste_id = max(item['id'] for item in StockLijst)
    # Genereer een nieuw id door het hoogste id met 1 te verhogen
    nieuw_id = hoogste_id + 1
    return nieuw_id

# Maak een nieuw product met het nieuwe id en andere gegevens
# product = {'id': GetNieuwId(), 'naam': 'mispel', 'inkoop_prijs': 0.60, 'aantal': 20}

# Voeg het nieuwe product toe aan de StockLijst
#StockLijst.append(product)
#print(StockLijst)


#=======================================
# verkoop van een aantal van een product
#=======================================

product_naam = 'aardappel'
aantal_verkocht = 2


#=======================================
# Zoek het product in de StockLijst op basis van de naam
#=======================================

for product in StockLijst:
    if product['naam'] == product_naam:
        product['aantal'] -= aantal_verkocht
        break   #om de for-loop te verlaten'


#=======================================
# koop nieuw product
#=======================================

def add_product_to_stocklist(naam, inkoop_prijs, aantal, dagenHoudbaar):
    tday = datetime.date.today()
    # print(tday)
    tdelta = datetime.timedelta(days=dagenHoudbaar)
    tht_datum = tday + tdelta
    NewProduct = {'id': GetNieuwId(), 'naam': naam, 'inkoop_prijs': inkoop_prijs, 'aantal': aantal, 'datum_inkoop': tday, 'tht_datum': tht_datum}
    StockLijst.append(NewProduct)

add_product_to_stocklist("rettich", 0.50, 12, 7)
add_product_to_stocklist("rettich", 0.70, 10, 2)
# print(StockLijst)


#=======================================
# verkoop product
#=======================================

def remove_product_from_stocklist(naam_verkocht, aantal_verkocht):
    # sorteer de lijst op naam + tht_datum
    # sorted_list = sorted(StockLijst, key=lambda item: (item['naam'], item['tht_datum']))
    for product in sorted(StockLijst, key=lambda item: (item['naam'], item['tht_datum'])):
        if product['naam'] == naam_verkocht:
            if product['aantal'] == aantal_verkocht:
                print(product['naam'] + " is nu volledig verkocht")
                break
            elif product['aantal'] >= aantal_verkocht:
                product['aantal'] -= aantal_verkocht
                print(product['naam'])
                break
            else:
                print("doe iets")
                break

remove_product_from_stocklist('rettich', 10)


# print(StockLijst)
# print("____====____")
# remove_product_from_stocklist("spinazie", 2)
# print(StockLijst)


#=======================================
# sorteer lijst
#=======================================

StockLijst.sort(key=lambda x: x['naam'])
sorted_list = sorted(StockLijst, key=lambda item: (item['naam'], item['tht_datum']))

# print(sorted_list)


#=======================================
# wegschrijven naar CSV
#=======================================

# wegschrijven naar bestand Inventaris
# Definieer de naam van het CSV-bestand
csv_bestand = 'Inventaris.csv'

# Schrijf de inhoud van de StockLijst naar het CSV-bestand
## let op: bestand komt in hoofdmap studie-projecten ipv in submap 00_Winc/superpy
with open(csv_bestand, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['id', 'naam', 'inkoop_prijs', 'aantal', 'datum_inkoop', 'tht_datum'])  # Schrijf de kolomkoppen

    for product in StockLijst:
        writer.writerow([product['id'], product['naam'], product['inkoop_prijs'], product['aantal'], product['datum_inkoop'], product['tht_datum']])

## check of bestand al bestaat:
## niet nodig, bestand wordt overschreven....
# if os.path.exists('Inventaris.csv'):
#     print(f"Het bestand {'Inventaris.csv'} bestaat al.")
# else:
#     print(f"Het bestand {'Inventaris.csv'} bestaat nog niet.")

