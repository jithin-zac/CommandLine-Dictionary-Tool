const request = require('request')

const apiKey = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164'
const baseURL = 'https://fourtytwowords.herokuapp.com'

let data = {

    "word": "",
    "definitons": "",
    "synonyms": "",
    "antonyms": "",
    "examples": "",

}

//function to get details about given word

const givenWordAll = (word) => {

    return new Promise(async (resolve, reject) => {

        try {
            let wordData = await wordAll(word)

            if (wordData) {
                resolve(wordData)
            }

        } catch (error) {
            reject(error)
        }

    })

}

//function to get details about a random word

const randomWordAll = async () => {

    let randomWord = await getRandomWord()
    let wordData = await wordAll(randomWord)

    return new Promise((resolve, reject) => {

        if (wordData) {
            resolve(wordData)
        }

    })

}

//function to fetch all definitions of a given word

const wordDefinition = (word) => {

    return new Promise((resolve, reject) => {

        const url = baseURL + '/word/' + word + '/definitions?api_key=' + apiKey

        request({
            url,
            json: true
        }, (error, body, response) => {

            if (response.error) {
                reject("word not found")

            } else {
                resolve(response)

            }
        })

    })

}

//function to fetch all synonyms of a given word

const wordSynonyms = (word) => {

    return new Promise((resolve, reject) => {
        const url = baseURL + '/word/' + word + '/relatedWords?api_key=' + apiKey

        request({
            url,
            json: true
        }, (error, body, response) => {

            if (response.error) {
                reject("word not found")

            } else {
                if (response.length == 2) {
                    resolve(response[1].words)


                } else {

                    resolve(response[0].words)

                }

            }

        })

    })

}

//function to fetch all antonyms of a given word

const wordAntonyms = (word) => {
    return new Promise((resolve, reject) => {

        const url = baseURL + '/word/' + word + '/relatedWords?api_key=' + apiKey

        request({
            url,
            json: true
        }, (error, body, response) => {

            if (response.error) {
                resolve("Word not found")
            } else {

                if (response.length == 2) {

                    resolve(response[0].words)


                } else {

                    resolve('No Antonyms found')

                }

            }

        })

    })

}

//function to fetch all examples of a given word

const wordExample = (word) => {

    return new Promise((resolve, reject) => {

        const url = baseURL + '/word/' + word + '/examples?api_key=' + apiKey


        request({
            url,
            json: true
        }, (error, body, response) => {

            if (response.error) {
                resolve("word not found")

            } else {
                resolve(response.examples)

            }


        })

    })

}

//function to fetch all datas available of a given word

async function wordAll(word) {

    return new Promise(async (resolve, reject) => {


        data.word = word
        try {

            data.definitons = await wordDefinition(word)
            data.examples = await wordExample(word)
            data.synonyms = await wordSynonyms(word)
            data.antonyms = await wordAntonyms(word)

        } catch (error) {
            reject("Word not found")
        }

        resolve(data)

    })

}

//function to generate a random word

function getRandomWord() {

    return new Promise((resolve, reject) => {

        const url = baseURL + '/words/randomWord?api_key=' + apiKey

        request({
            url,
            json: true
        }, (error, body, response) => {

            if (!error) {


                resolve(response.word)

            }

        })

    })

}

//function to fetch single definition of a given word

const singleWordDefn = async (word) => {

    let wordData = await wordDefinition(word)

    let id = randomGenerator(wordData.length)

    return new Promise((resolve, reject) => {

        resolve(wordData[id].text)
    })

}

//function to fetch single synonym of a given word

const singleWordSyn = async (word) => {

    let wordData = await wordSynonyms(word)

    let id = randomGenerator(wordData.length)

    return new Promise((resolve, reject) => {

        resolve(wordData[id])
    })

}

//function to fetch single antonym of a given word

const singleWordAnt = async (word) => {

    let wordData = await wordAntonyms(word)

    return new Promise((resolve, reject) => {


        if (wordData == 'No Antonyms found') {
            resolve("No Antonym")
        }
        else {
            let id = randomGenerator(wordData.length)
            resolve(wordData[id])

        }

    })

}

//function to generate a random number a range

function randomGenerator(len) {

    return Math.floor(Math.random() * (len - 0) + 0);

}

module.exports = {

    singleWordAnt,
    singleWordDefn,
    singleWordSyn,
    getRandomWord,
    randomWordAll,
    givenWordAll,
    wordDefinition,
    wordAntonyms,
    wordExample,
    wordSynonyms

}