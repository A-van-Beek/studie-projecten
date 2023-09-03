import datetime
tday = datetime.date.today()
# print(tday)
# print(tday.day)

#time delta
tdelta = datetime.timedelta(days=7)
# print(tday + tdelta)

bday = datetime.date(2023, 8, 2)    #mijn verjaardag dit jaar
# print(bday)
till_bday = tday - bday
# print(till_bday.days)    # aantal dagen

#voor complete gegevensset
dt = datetime.datetime(2016, 7, 26, 12, 30, 45, 100000)
print(dt)
print(dt.year)
print(dt.date())
tdelta2 = datetime.timedelta(days=7)

## code van Phind voor de opdracht: "Your program should have an internal conception of what day it is - perhaps saved to a simple text file."
import datetime

# Get the current date and time
now = datetime.datetime.now()

# Open the file in append mode ('a')
# This will create the file if it doesn't exist and append the content if it does
with open('date.txt', 'a') as file:
    # Write the current date and time to the file
    file.write(str(now) + '\n')

# met twee dagen ophogen:

# Get the current date
current_date = datetime.date.today()

# Increment the date by two days
new_date = current_date + datetime.timedelta(days=2)

# Print the new date
print(new_date)

