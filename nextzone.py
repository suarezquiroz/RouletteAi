import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1' 

import numpy as np

# Load data from file, ignoring white spaces and accepting unlimited length numbers
data = np.genfromtxt('data/platinum.txt', delimiter='\n', dtype=int)

data = data[(data >= -1) & (data <= 36)]

posData = []
for n in data:
    pos = roulettePosition(n)
    posData.append(pos)

# Define the length of the input sequences
data = np.array(posData)


roulette = np.array([0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2])
zones = 


roulettePosition = lambda n: np.where(roulette == n)[0][0]
it = np.nditer(data, flags=['c_index'])
for x in it:
    nextIndex = it.index +1
    if nextIndex < data.size
        next = data[nextIndex]
        print("%d <%d>" % (x, it.index))
