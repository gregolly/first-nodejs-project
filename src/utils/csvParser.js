import fs from "node:fs"
import { parse } from "csv-parse"
import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { Database } from "../database.js"

const database = new Database()

const filePath = '/home/gregolly/projetos/nodejs/desafio-01-nodejs/csvFile.csv'
const apiUrl = 'http://localhost:3333/tasks'

async function parseCSV() {
    const readStream = fs.createReadStream(filePath)
    const parser = readStream.pipe(parse({ fromLine: 2, delimiter: ',' }))

    for await (const record of parser) {
        const [
            title, 
            description, 
            completed_at = null, 
            created_at = new Date(), 
            updated_at = new Date()
        ] = record

        const task = {
            id: randomUUID(),
            title,
            description,
            completed_at,
            created_at,
            updated_at
        }

        console.log(task)

        try {
            const response = await http.request(`${apiUrl}/tasks`, task);
            database.insert('tasks', task)
            console.log('Requisição enviada com sucesso:');
        } catch (error) {
            console.error('Erro ao enviar requisição:');
        }
    }
}

parseCSV()