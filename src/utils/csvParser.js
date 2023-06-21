import fs from "node:fs"
import { parse } from "csv-parse"
import http from 'node:http'

const filePath = '/home/gregolly/projetos/nodejs/desafio-01-nodejs/csvFile.csv'
const apiUrl = 'http://localhost:3333/tasks'

async function parseCSV() {
    const readStream = fs.createReadStream(filePath)
    const parser = readStream.pipe(parse({ delimiter: ',' }))

    for await (const record of parser) {
        const [title, description] = record
    
        const data = {
            title,
            description,
        }

        console.log(data)

        try {
            const response = await http.request(`${apiUrl}/tasks`, data);
            console.log('Requisição enviada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar requisição:', error.message);
        }
    }
}

parseCSV()