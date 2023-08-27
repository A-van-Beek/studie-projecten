import csv

color_new = []
with open("C:/Projecten/studie-projecten/00_Winc/csv/colors.csv") as csv_file:
    reader = csv.reader(csv_file)
    for color in reader:
        # print(color)
        info = [
            ["Naam", "'" + color["Name"] + "'"],
            ["rgb_code", "'" + color["RGB"] + "'"],
            ["hex_code", "'" + color["HEX"] + "'"]
        ]
        color_new.append(info)

for i, e in enumerate(color_new):
    print(i, e)

# with open("C:/Projecten/studie-projecten/00_Winc/csv/colors_added.csv", mode="w", newline="") as csv_file:
#     fieldnames = ["Naam", "hex", "rgb"]
#     writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
#     writer.writeheader()
#     for i, e in enumerate(clean_data):
#         print(i, e)
#         writer.writerow(e)
