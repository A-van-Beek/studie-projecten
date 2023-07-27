# Imports
from argparse import ArgumentParser, Namespace

# parser.add_argument('echo', help='Echos the given string')
# parser = ArgumentParser()
# args: Namespace = parser.parse_args()
## vervolgens in terminal: python main.py hello
## voor help: python main.py -h

# parser.add_argument('square', help='squares a given number', type=int)
# parser.add_argument('-v', '--verbose', help='Provides a verbose description',
#                     action='store_true')
# args: Namespace = parser.parse_args()

# if args.verbose:
#     print (f'{args.square} squared is: {args.square ** 2}')
# else:
#     print(args.square ** 2)

# parser.add_argument('square', help='squares a given number', type=int)
# parser.add_argument('-v', '--verbose', help='Provides a verbose description',
#                     type=int, choices=[0, 1, 2])
# args: Namespace = parser.parse_args()

# if args.verbose == 0:
#         print('Option 1')
# elif args.verbose == 1:
#         print('Option 2')
# elif args.verbose ==2:
#         print('Option 3')
# print(args.square ** 2)

'=========================='
# # nu uitgebreider:
# parser = ArgumentParser()
# parser.add_argument('square', help='squares a given number', type=int,
#                     default=0, nargs='?')
# parser.add_argument('-v', '--verbose',
#                     help='Verbose description. Use -vv for extra verbose',
#                     action='count')
# args: Namespace = parser.parse_args()
# result: int = args.square ** 2

# if args.verbose == 1:
#     print(f'The result is: {result}')
# elif args.verbose ==2:
#     print(f'{args.square} ** {args.square} = {result}')
# else:
#     print(result)

# '=========================='
# # uitgebreider voorbeeld
# parser = ArgumentParser()

# # aangepaste uitleg over het gebruik:
# parser.usage = 'Use this program like this'

# parser.add_argument('a', type=int, help='The base value')
# parser.add_argument('b', type=int, help='The exponent')
# parser.add_argument('-v', '--verbose', action='count',
#                     help='Provides a verbose description. Use -vv for extra verbose')

# args: Namespace = parser.parse_args()
# result: int = args.a ** args.b

# match args.verbose:
#     case 1:
#         print(f'The result is {result}')
#     case 2:
#         print(f'{args.a} ** {args.b} = {result}')
#     case _:
#         print(result)

'=========================='
# als twee argumenten niet tegelijk gebruikt mogen worden
# maak een group_argument
parser = ArgumentParser()

group = parser.add_mutually_exclusive_group()

parser.add_argument('a', type=int, help='The base value')
parser.add_argument('b', type=int, help='The exponent')
group.add_argument('-v', '--verbose', action='count',
                    help='Provides a verbose description. Use -vv for extra verbose')
group.add_argument('-s', '--silence', action='store_true',
                   help='Generate a silent version of the output')


args: Namespace = parser.parse_args()
result: int = args.a ** args.b

if args.silence:
    print('Silenced !')
else:
    match args.verbose:
        case 1:
            print(f'The result is {result}')
        case 2:
            print(f'{args.a} ** {args.b} = {result}')
        case _:
            print(result)