import { time } from 'console';
import fs from 'fs';
import path from 'path';

const genesisFile = path.join(__dirname, '../genesis.json');
const outputFile = path.join(__dirname, 'carteiras_geradas.ndjson');

const genesis = JSON.parse(fs.readFileSync(genesisFile, 'utf-8'));

const linhas = fs.readFileSync(outputFile, 'utf-8').split('\n').filter(Boolean);
const carteiras = linhas.map((linha) => JSON.parse(linha));

function removerConta(endereco: string) {
    if (genesis.alloc[endereco]) {
        delete genesis.alloc[endereco];
    }
}

for (let i = 1; i <= 10; i++) { // Adaptar conforme a quantidade de carteiras geradas
    const quantidade = Math.pow(4, i);
    console.time(`Tempo para ${quantidade} remoções`);

    for (let i = 0; i < quantidade; i++) {
        removerConta(carteiras[i].endereco);
    }

    console.timeEnd(`Tempo para ${quantidade} remoções`);
}

fs.writeFileSync(outputFile, '')
fs.writeFileSync(genesisFile, JSON.stringify(genesis, null, 2));