const S = val => document.querySelector(val);


const buttonVocal = S('#btn-vocal');
const buttonLetters = S('#btn-consonant');
const buttonSend = S('#btn-resolv');
const btnRestart = S('#btn-play-again')
const wordsDiv = S('#words');

let letters = 'bcdfghjklmnñpqrstvwxyz';
let vocals = 'aeiou';
let maxletters = 8; 


const getRandomLetter = () => {
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    return randomLetter;
}
const getRandomVocal = () => {
    let randomVocal = vocals[Math.floor(Math.random() * vocals.length)];
    return randomVocal;
}

const handlerbuttons = () => {
    buttonVocal.disabled = true;
    buttonLetters.disabled = true;
    buttonSend.disabled = false; 
}

const pedirVocal = () => {
    let vocal = getRandomVocal();
    S('#mainLetters').value += vocal;
    if (S('#mainLetters').value.length == maxletters){ handlerbuttons() }
}

const pedirConsonante = () => {
    let consonante = getRandomLetter();
    S('#mainLetters').value += consonante;
    if (S('#mainLetters').value.length == maxletters){ handlerbuttons() }
}

const cleanAll = () => {
    S('#mainLetters').value = '';
    buttonVocal.disabled = false;
    buttonLetters.disabled = false;
    buttonSend.disabled = true;
    wordsDiv.innerHTML = '';
    btnRestart.style.display = 'none'
}

const showWords = (words) => {
    buttonSend.disabled = true;
    let promises = [];
    let wordsGroup = []
    if(words.length == 0){
        wordsDiv.innerHTML = '<h3>No hay palabras que coincidan</h3>'
    }
    words.forEach(word => {
        promises.push(
            fetch(`https://es.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&utf8=&srsearch=${word}`)
            .then(res => res.json())
            .then(data => {
                if(data.query.search.length == 0) return;
                let data2 = data.query.search[0].snippet; 
                let alldata = []
                if(data2.includes(';')){
                    alldata = data2.split(';').slice(1) 
                }else{
                    alldata.push(data2)
                }
                wordsGroup.push({word, wordData: alldata})
                
            })
        )
       
    })

    Promise.all(promises).then(() => {
        wordsGroup.sort((a,b) =>{
            a['word'].length - b['word'].length
        })
    
        wordsGroup.forEach(wordG => {
         const {word, wordData} = wordG;
         wordsDiv.innerHTML += `
             <li class="list-group-item active bg-correct">${word}</li>
             <li class="list-group-item">${wordData.map(element => `${element} </br>`)}</li>
             `
        })
    })

    
}

const checkWord = (letras, palabra) => {
    const palabras = letras.toLowerCase().split('').sort();
    const array = palabra.toLowerCase().split('').sort();

    for (let i = 0; i < array.length; i++) {
        let e = array[i];

        if(palabras.length > 1 && i < array.length -1){
            if(palabras[0] == e){
                palabras.shift();
            } 
            else{
                
                if(palabras[0] > e){ return false } 
                else{
                    palabras.shift();
                    i--; 
                }
            }
        }else{
            if(palabras[0] == e && i == array.length-1) return true; 
            else return false;
        }
    }
    
}
const useCheck = (text1, text2) => {
    return checkWord(text1,text2)
    
}
    
const juega = () => {
    let words = []
    diccionario.forEach(palabra => {
        useCheck(S('#mainLetters').value, palabra) ? !words.includes(palabra) ? words.push(palabra) : null : null
    })
    showWords(words)
    btnRestart.style.display = 'block'
}

