const { Wallet } = require('ethers');
const fs = require('fs');
const path = require('path');

const genesisFile = '../genesis.json';
const outputFile = 'carteiras_geradas.ndjson';

const genesis = JSON.parse(fs.readFileSync(genesisFile));

// Configurações
const LIMITE_MAX = 1048576;
let aux = 4;

console.time("Tempo total");

while (aux <= LIMITE_MAX) {
    genesis.alloc = {};
    console.time(`Batch de ${aux} carteiras`);
    
    const batchCarteiras = [];

    for (let i = 0; i < aux; i++) {
        const wallet = Wallet.createRandom();

        const carteira = {
            index: i + 1,
            endereco: wallet.address,
            chavePrivada: wallet.privateKey
        };

        batchCarteiras.push(carteira);

        if (!genesis.alloc[wallet.address]) {
            genesis.alloc[wallet.address] = {
                balance: '0x3635C9ADC5DEA00000'
            };
        }
    }

    // Append no NDJSON
    const linhas = batchCarteiras.map(c => JSON.stringify(c)).join('\n') + '\n';
    fs.appendFileSync(outputFile, linhas);

    // Atualiza o genesis
    fs.writeFileSync(genesisFile, JSON.stringify(genesis, null, 2));

    console.timeEnd(`Batch de ${aux} carteiras`);
    
    aux *= 4; // Exponencial
}

console.timeEnd("Tempo total");