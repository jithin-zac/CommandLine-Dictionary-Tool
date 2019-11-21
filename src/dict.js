const program = require('commander');
const {
    prompt
} = require('inquirer');
const { wordSynonyms, wordAntonyms, wordExample, wordDefinition, givenWordAll, randomWordAll, getRandomWord, singleWordAnt, singleWordDefn, singleWordSyn } = require('./dictionary.js')

if (process.argv.length == 2) {

    

    const getRandomWordData = async ()=>{
        let wordData=await randomWordAll()
        console.log(wordData)
    }
    try{
        getRandomWordData()

    }
    catch(error){
        console.log(error)

    }

   
  
}
else if(process.argv.length == 3 && process.argv[2]!='play'){
    const getGiverWordData = async ()=>{

        try{
            let wordData=await givenWordAll(process.argv[2])
            console.log(wordData)


        }
        catch(error)
        {
            console.log(error)
        }
      
    }
    
       getGiverWordData()

}
else{


const questions =
{
    type: 'input',
    name: 'answer',
    message: 'Please guess the word'
}



const subMenu = {
    type: 'list', name: 'options', message: 'Choose ', choices: ['1.Try again', '2.Hints', '3.Exit'] 

}
    



const hintMenu = {
    type: 'list', name: 'options', message: 'Choose ', choices: ['1.Jumbled', '2.Definition', '3.Antonym', '4.Synonym']

}


program
    .version('1.0.0')
    .description('Dictionary')


// word synonym
program
    .command('syn <word>')

    .action(async (word) => {
        try{
            let data = await wordSynonyms(word)
            console.log(data)

        }
        catch(error){
            console.log(error)
        }
     

    });

// word antonym
program
    .command('ant <word>')

    .action(async (word) => {
        try{
            let data = await wordAntonyms(word)
            console.log(data)

        }
        catch(error){
            console.log(error)
        }
       

    });

// word definition
program
    .command('defn <word>')

    .action(async (word) => {
        try{
            let data = await wordDefinition(word)
            console.log(data)
    
        }
        catch(error){
            console.log(error)
        }
     
    });

// word examples
program
    .command('ex <word>')

    .action(async (word) => {
        try{
            let data = await wordExample(word)
            console.log(data)
    
        }
        catch(error){
            console.log(error)
        }
      
    });

// play
program
    .command('play')

    .action(async () => {
        try {

            let word = await getRandomWord()

            let clues = {
                "Definitions": await singleWordDefn(word),
                "Synonyms": await singleWordSyn(word),
                "Antonyms": await singleWordAnt(word)

            }

            console.log(clues)

            let synArray = await wordSynonyms(word)
            synArray.push(word)
            let answerArray = arrayFilter(clues.Synonyms, synArray)

            quesPrompt(word, answerArray)
        }
        catch (error) {

            console.log(error)

        }

    });

// helper functions

program.parse(process.argv)

const quesPrompt = (word, answerArray) => {

    if (answerArray.length != 0) {
        prompt(questions).then((answer) => {

            

            let result = checkAnswer(answer.answer, answerArray)

            if (result) {
                return console.log("You guessed correctly")

            }



            else {
                console.log("Wrong answer or your input already diplayed as synonym")

                prompt(subMenu).then((answer) => {


                    if (answer.options == '1.Try again') {
                        quesPrompt(word, answerArray)

                    }
                    else if (answer.options == '2.Hints') {
                        hintPrompt(word, answerArray)
                    }
                    else {
                        console.log("You quit the game.The word was " + word)
                    }

                });

            }


        });

    }
    else {

        console.log("You saw all the synonyms")
    }

}

function arrayFilter(word, answerArray) {

    var arr = answerArray.filter(function (answ) {


        if (answ != word) {
            return answ

        }


    });
    
    return arr

}

function checkAnswer(word, answerArray) {

    let success = false

    answerArray.forEach((wrd) => {
        if (word == wrd) {
            success = true
        }
    })

    return success

}

const hintPrompt = (word, answerArray) => {

    prompt(hintMenu).then(async (answer) => {


        if (answer.options == '1.Jumbled') {

            var shuffled = word.split('').sort(function () { return 0.5 - Math.random() }).join('');
            console.log("Jumbled word : " + shuffled)

        }
        else if (answer.options == '2.Definition') {

            var data = await singleWordDefn(word)

            console.log("Another definiton : " + JSON.stringify(data))


        }
        else if (answer.options == '3.Antonym') {
            var data = await singleWordAnt(word)

            console.log("Another antonym : " + data)

        }
        else {
            var data = await singleWordSyn(word)

            console.log("Another synonym : " + data)

            answerArray = arrayFilter(data, answerArray)

        }

        quesPrompt(word, answerArray)


    });

}

}






