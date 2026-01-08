from colorama import init, Fore, Back
import random
import nltk
from nltk.corpus import words

nltk.download('words')
allWords = words.words()
fiveLetterWords = [w.upper() for w in allWords if len(w)==5]
class Node:
    def __init__(self):
        self.arr = [None for i in range(26)]
        self.flag = False
    
class Trie:
    def __init__(self):
        self.head = Node()
    
    def pushWord(self, word : str):
        temp = self.head
        for char in word:
            i = ord(char) - ord('A')
            if temp.arr[i] == None:
                temp.arr[i] = Node()
            temp = temp.arr[i]
        temp.flag = True

    def findWord(self, word : str) -> bool:
        temp = self.head
        for char in word:
            i = ord(char) - ord('A')
            if temp.arr[i] == None:
                return False
            temp = temp.arr[i]
        return temp.flag

database = Trie()
for wd in fiveLetterWords:
    database.pushWord(wd)

word = random.choice(fiveLetterWords)
letters = {}
for char in word:
    if letters.get(char) == None:
        letters[char] = 1
    else:
        letters[char] += 1
print(word)

done = False
while (done==False) :
    init(autoreset=True)
    guess = input().upper()

    if len(guess) != 5:
        print("\033[1A\033[2K\r", end="")
        print(Fore.RED + "Word is not 5 letters long", end = "\r")
        continue

    try:
        if not database.findWord(guess):
            print("\033[1A\033[2K\r", end="") #this is so that it writes in place
            print(Fore.RED + "Not in word list", end = "\r")
            continue
    except:
        print("\033[1A\033[2K\r", end="") #this is so that it writes in place
        print(Fore.RED + "Only alphabets allowed", end = "\r")
        continue

    print("\033[1A\033[2K\r", end="")
    currLetters = letters.copy()
    cols = [None for _ in range(5)]
    for i  in range(5):
        if word[i]==guess[i]:
            currLetters[word[i]] -= 1
            cols[i] = 'g'
            if currLetters[guess[i]] == 0:
                del currLetters[guess[i]]
        
    for i in range(5):
        if cols[i] == 'g':
            continue
        if currLetters.get(guess[i]) != None:
            currLetters[guess[i]] -= 1
            if currLetters[guess[i]] == 0:
                del currLetters[guess[i]]
            cols[i] = 'y'
        else:
            cols[i] = 'w'

    for i in range(5):
        if cols[i] == 'g':
            print(Fore.GREEN + guess[i], end="")
        elif cols[i] == 'y':
            print(Fore.YELLOW + guess[i], end="")
        else:
            print(Fore.WHITE + guess[i], end="")
    print("")

    if guess==word:
        done = True
        print(Fore.LIGHTGREEN_EX+"You won")