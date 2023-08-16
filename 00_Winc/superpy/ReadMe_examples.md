$ python super.py buy --product-name orange --price 0.8 --expiration-date 2020-01-01
OK

$ python super.py report inventory --now
+--------------+-------+-----------+-----------------+
| Product Name | Count | Buy Price | Expiration Date |
+==============+=======+===========+=================+
| Orange       | 1     | 0.8       | 2020-01-01      |
+--------------+-------+-----------+-----------------+

$ python super.py --advance-time 2
OK

$ python super.py report inventory --yesterday
+--------------+-------+-----------+-----------------+
| Product Name | Count | Buy Price | Expiration Date |
+==============+=======+===========+=================+
| Orange       | 1     | 0.8       | 2020-01-01      |
+--------------+-------+-----------+-----------------+

$ python super.py sell --product-name orange --price 2
OK

$ python super.py report inventory --now
+--------------+-------+-----------+-----------------+
| Product Name | Count | Buy Price | Expiration Date |
+==============+=======+===========+=================+


$ python super.py report revenue --yesterday
Yesterday's revenue: 0

$ python super.py report revenue --today
Today's revenue so far: 2

$ python super.py report revenue --date 2019-12
Revenue from December 2019: 0

$ python super.py report profit --today
1.2

$ python super.py sell --product-name orange --price 2
ERROR: Product not in stock.