import OpenAI from 'openai'
import rl from 'readline-sync'
import color from 'chalk'
import box from 'boxen'
import figlet from 'figlet'
import fs from 'fs'

let configArgs = []
let key;

fs.readFile('config.gpt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err)
        return
    }

    configArgs = data.split('.')
    key = configArgs[1]

    const openai = new OpenAI({ apiKey: key })

    setTimeout(async () => {
        console.clear()
        const header = await succesIpHeader();
        console.log(color.cyan(header));
        makeConsult(openai)
    })
})

function succesIpHeader() {
    return new Promise((resolve, reject) => {
        figlet('ShellGPT', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const boxOptions1 = {
    padding: 1,
    margin: 1,
    borderStyle: 'classic',
    borderColor: 'green',
};

const makeConsult = async (openai) => {
    const question = rl.question(color.bold('Pregunta > '))

    if (question) {
        const textConsult = await getConsult(openai, question)
        const boxData = color.blue.bold('GPT >> ') + textConsult
        const boxedMessage = box(boxData, boxOptions1);
        console.log(boxedMessage)
        makeConsult(openai)
    } else if (!question || question === '') {
        console.log('\n\n', color.red.bold('Escribe una consulta válida (no void)'), '\n\n')
        makeConsult(openai)
    }
} 

async function getConsult(openai, question) {
    const completion = await openai.chat.completions.create({
      messages: [{"role": "user", "content": question}],
      model: "gpt-3.5-turbo",
    });
  
    return completion.choices[0].message.content
}