import random
import nltk
from nltk.corpus import words
from flask import Flask, request, jsonify, session
from flask_cors import CORS
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
    
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'Just_having_some_fun_here'

nltk.download('words')
allWords = words.words()
fiveLetterWords = [w.upper() for w in allWords if len(w)==5]

database = Trie()
for wd in fiveLetterWords:
    database.pushWord(wd)

@app.route('/start', methods = ['Post'])
def startGame():
    word = random.choice(fiveLetterWords)

    currLetters = {}
    for char in word:
        if currLetters.get(char) == None:
            currLetters[char] = 1
        else:
            currLetters[char] += 1
    
    session['word'] = word
    session['freq_map'] = currLetters 

    return jsonify({"message" : "Game starts, word is " + word})


@app.route('/guess', methods = ['Post'])
def checkGuess():
    data = request.get_json()
    guessWord = data['guess'].strip().upper()
    realWord = session.get('word').upper()
    currLetters = (session.get('freq_map')).copy()

    if not database.findWord(guessWord):
        return jsonify({"message" : "Not in library"})
    
    colors = [None] * 5
    for i  in range(5):
        if realWord[i]==guessWord[i]:
            currLetters[realWord[i]] -= 1
            colors[i] = 'green'
            if currLetters[guessWord[i]] == 0:
                del currLetters[guessWord[i]]
    
    correct = True    
    for i in range(5):
        if colors[i] == 'green':
            continue
        if currLetters.get(guessWord[i]) != None:
            currLetters[guessWord[i]] -= 1
            if currLetters[guessWord[i]] == 0:
                del currLetters[guessWord[i]]
            colors[i] = '#e8cb2a'
        else:
            colors[i] = 'black'
        correct = False
    if not correct:    
        return jsonify({
            "colors" : colors,
            "message" : 'valid'
        })
    else:
        return jsonify({
            "colors" : colors,
            "message" : 'complete'
        })

if __name__ == '__main__':
    app.run(debug=True)