# Do not modify these lines
__winc_id__ = "9920545368b24a06babf1b57cee44171"
__human_name__ = "refactoring"

# Add your code after this line

alice_name = "Alice Aliceville"
alice_profession = "electrician"
bob_name = "Bob Bobsville"
bob_profession = "painter"
craig_name = "Craig Craigsville"
craig_profession = "plumber"

alfred_name = "Alfred Alfredson"
alfred_address = "Alfredslane 123"
alfred_needs = ["painter", "plumber"]
bert_name = "Bert Bertson"
bert_address = "Bertslane 231"
bert_needs = ["plumber"]
candice_name = "Candice Candicedottir"
candice_address = "Candicelane 312"
candice_needs = ["electrician", "painter"]

alfred_contracts = []
for need in alfred_needs:
    if need == alice_profession:
        alfred_contracts.append(alice_name)
    elif need == bob_profession:
        alfred_contracts.append(bob_name)
    elif need == craig_profession:
        alfred_contracts.append(craig_name)

bert_contracts = []
for need in bert_needs:
    if need == alice_profession:
        bert_contracts.append(alice_name)
    elif need == bob_profession:
        bert_contracts.append(bob_name)
    elif need == craig_profession:
        bert_contracts.append(craig_name)

candice_contracts = []
for need in candice_needs:
    if need == alice_profession:
        candice_contracts.append(alice_name)
    elif need == bob_profession:
        candice_contracts.append(bob_name)
    elif need == craig_profession:
        candice_contracts.append(craig_name)

print("Alfred's contracts:", alfred_contracts)
print("Bert's contracts:", bert_contracts)
print("Candice's contracts:", candice_contracts)

class Homeowner :
    def __init__(self, name, adress, needs):
        self.name = name
        self.adress = adress
        self.needs = needs

    @classmethod
    def contracts(self, name):
        # determine who to contract
        # calculate first_name
        first_name = name.split()[0]
        # list_specialists = ['Bob Bobsville', 'Craig Craigsville']
        # return print statement with list of specialists
        return print(first_name, " test methode in  classe")

 
alfred = Homeowner("Alfred Alfredson", "Alfredslane 123", ["painter", "plumber"])
bert = Homeowner("Bert Bertson", "Bertslane 231", ["plumber"])
candice = Homeowner("Candice Candicedottir", "Candicelane 312", ["electrician", "painter"])

# base class = parent
class Specialist :
    def __init__(self, name) :
        self.name = name
    def Specialist_info(self) :
        print("instide specialist = parent class")

# child class
class Trade(Specialist):
    def __init__(self, trade) :
        super().__init__(trade)
        self.trade = trade
    def Trade_info(self) :
        print(trade, "inside trade")

# Create object of Car
alice = Trade("paint")

alice.Trade_info()
alice.Specialist_info()

# Parent class 1
class Person:
    def person_info(self, name, age):
        print('Inside Person class')
        print('Name:', name, 'Age:', age)

# Parent class 2
class Company:
    def company_info(self, company_name, location):
        print('Inside Company class')
        print('Name:', company_name, 'location:', location)

# Child class
class Employee(Person, Company):
    def Employee_info(self, salary, skill):
        print('Inside Employee class')
        print('Salary:', salary, 'Skill:', skill)

# Create object of Employee
emp = Employee()

# access data
emp.person_info('Jessa', 28)
emp.company_info('Google', 'Atlanta')
emp.Employee_info(12000, 'Machine Learning')


