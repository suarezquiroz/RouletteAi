import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1' 

import numpy as np
import tflite as tf
import keras
from keras import layers
#from art import text2art

# Generate ASCII art with the text "RouletteAi"
#ascii_art = text2art("RouletteAi")

print("============================================================")
print("RouletteAi")
# print("Created by: Corvus Codex")
# print("Github: https://github.com/CorvusCodex/")
# print("Licence : MIT License")
# print("Support my work:")
# print("BTC: bc1q7wth254atug2p4v9j3krk9kauc0ehys2u8tgg3")
# print("ETH & BNB: 0x68B6D33Ad1A3e0aFaDA60d6ADf8594601BE492F0")
# print("Buy me a coffee: https://www.buymeacoffee.com/CorvusCodex")
print("============================================================")

# Print the generated ASCII art
#print(ascii_art)
print("Roulette prediction artificial intelligence")

# Load data from file, ignoring white spaces and accepting unlimited length numbers
data = np.genfromtxt('data/platinum.txt', delimiter='\n', dtype=int)
roulette = np.array([0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2])

roulettePosition = lambda n: np.where(roulette == n)[0][0]

# Filter out numbers that are not between 0 and 36 (inclusive)

data = data[(data >= -1) & (data <= 36)]

posData = []
for n in data:
    pos = roulettePosition(n)
    posData.append(pos)

# Define the length of the input sequences
data = np.array(posData)
sequence_length = 10

# Set the number of features to 1
num_features = 1

# Create target values which are the next number after each sequence
targets = data[sequence_length:]

# Get the maximum value in the data
max_value = np.max(data)

model = keras.Sequential()
model.add(layers.Embedding(input_dim=max_value+1, output_dim=64))
model.add(layers.LSTM(256))
model.add(layers.Dense(num_features, activation='softmax'))  # Set the number of units to match the number of features

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

winner = -2
# start loop
while winner:
    if winner > -2 and winner < 37:
        pos = roulettePosition(winner)
        print('🚀 ~ file: RouletteAi.py:53 ~ pos:', pos)
        np.append(data, pos)


    # Create sequences of fixed length from the data
    sequences = np.array([data[i:i+sequence_length] for i in range(len(data)-sequence_length)])

    # Split the data into training and validation sets
    train_data = sequences[:int(0.8*len(sequences))]
    train_targets = targets[:int(0.8*len(targets))]
    val_data = sequences[int(0.8*len(sequences)):]
    val_targets = targets[int(0.8*len(targets)):]
    history = model.fit(train_data, train_targets, validation_data=(val_data, val_targets), epochs=100,verbose=0)

    predictions = model.predict(val_data)

    indices = np.argsort(predictions, axis=1)[:, -num_features:]
    predicted_numbers = np.take_along_axis(val_data, indices, axis=1)

    print("============================================================")
    print("Predicted Numbers:")
    for numbers in predicted_numbers[:1]:
        print(', '.join(map(str, roulette[numbers])))

        number = numbers[0]
        #index = np.where(roulette == number)[0][0]
        zone = np.take(roulette,np.arange(number-5,number+6),mode='wrap')
        print('Predicted Zone: ')
        print(', '.join(map(str, zone)), '\n')

    print("============================================================")
    # print("If you won buy me a coffee: https://www.buymeacoffee.com/CorvusCodex")
    # print("Support my work:")
    # print("BTC: bc1q7wth254atug2p4v9j3krk9kauc0ehys2u8tgg3")
    # print("ETH & BNB: 0x68B6D33Ad1A3e0aFaDA60d6ADf8594601BE492F0")
    # print("Buy me a coffee: https://www.buymeacoffee.com/CorvusCodex")
    # print("============================================================")

    # Prevent the window from closing immediately

    n = input('Enter winning number or ENTER to exit: ')
    if n == '':
        break
    winner = int(n) 
