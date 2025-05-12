const { Wallet } = require('ethers');
const fs = require('fs');

const outputFile = 'carteiras_geradas.json';
const carteiras = [];
let aux = 4;

for(let i=1; i<=10; i++){
    console.time(`Tempo do loop externo i=${aux}`);
    for (let j = 0; j < aux; j++) {
        const wallet = Wallet.createRandom();
        carteiras.push({
            index: j + 1,
            endereco: wallet.address,
            chavePrivada: wallet.privateKey,
            mnemônico: wallet.mnemonic.phrase
        });
    }
    console.timeEnd(`Tempo do loop externo i=${aux}`);
    aux *= 4;
}

fs.writeFileSync(outputFile, JSON.stringify(carteiras, null, 2));
console.log(`\nCarteiras salvas em: ${outputFile}`);
