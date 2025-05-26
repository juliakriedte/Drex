import fs from 'fs';
import path from 'path';
import { JsonRpcProvider } from '@ethersproject/providers';
import { formatEther } from 'ethers/lib/utils';

let port = "";
let aux = 4;

async function consultarSaldo(provider: JsonRpcProvider, index: number) {
  try {
    // Pega o primeiro endereço (ajuste se quiser outro)
    const endereco = jsonData[index+1].endereco;

    // Consulta saldo da conta
    const saldo = await provider.getBalance(endereco);

    // Formata o saldo em ETH
    const saldoEmETH = formatEther(saldo);

    //console.log(`Saldo da conta ${endereco}: ${saldoEmETH} ETH`);
  } catch (error) {
    console.error('Erro ao consultar saldo:', error);
  }
}

// Caminho do arquivo JSON com as carteiras (endereços)
const filePath = path.join(__dirname, 'carteiras_geradas.json');
const portPath = path.join(__dirname, '../data/besu.ports');

// Lê o arquivo e parseia JSON
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const portData = fs.readFileSync(portPath, 'utf-8');

const portLine = portData.split('\n').find((line) => line.startsWith('json-rpc='));
if (portLine) {
  port = portLine.split('=')[1].trim();
}

// URL do seu nó local Besu
const providerUrl = `http://localhost:${port}`;
const provider = new JsonRpcProvider(providerUrl);

// Vai quebrar assim
for(let i=1; i<=10; i++){
  console.time(`Tempo do loop externo i=${aux}`);
  for (let j = 0; j < aux; j++) {
    consultarSaldo(provider,j);
  }
  console.timeEnd(`Tempo do loop externo i=${aux}`);
  aux *= 4;
}

/* Assim ele loopa sem erro
for(let i=1; i<=2; i++){
  console.time(`Tempo do loop externo i=${aux}`);
  for (let j = 0; j < aux; j++) {
    consultarSaldo(provider,j);
  }
  console.timeEnd(`Tempo do loop externo i=${aux}`);
  aux *= 4;
} */

/* Para testar 64 repetições só se testar elas direto
  console.time(`Tempo do loop externo i=${aux}`);
  for (let j = 0; j < 64; j++) {
    consultarSaldo(provider,j);
  }
  console.timeEnd(`Tempo do loop externo i=${aux}`);
} */

/* Limite de repetições
  console.time(`Tempo do loop externo i=${aux}`);
  for (let j = 0; j < 80; j++) {
    consultarSaldo(provider,j);
  }
  console.timeEnd(`Tempo do loop externo i=${aux}`);
} */