import fs from 'fs';
import path from 'path';
import { JsonRpcProvider } from '@ethersproject/providers';
import { formatEther } from 'ethers/lib/utils';

let port = "";
let aux = 4;

async function consultarSaldo(provider: JsonRpcProvider, endereco: string) {
  try {
    const saldo = await provider.getBalance(endereco);
    const saldoEmETH = formatEther(saldo);
    // console.log(`Saldo da conta ${endereco}: ${saldoEmETH} ETH (${saldo.toString()} Wei)`);
  } catch (error) {
    console.error(`Erro ao consultar saldo de ${endereco}:`, error);
  }
}

// Caminho dos arquivos
const filePath = path.join(__dirname, 'carteiras_geradas.ndjson');
const portPath = path.join(__dirname, '../data/besu.ports');

// Lê porta
const portData = fs.readFileSync(portPath, 'utf-8');
const portLine = portData.split('\n').find((line) => line.startsWith('json-rpc='));
if (portLine) {
  port = portLine.split('=')[1].trim();
} else {
  console.error('Porta não encontrada no arquivo besu.ports');
  process.exit(1);
}

// Cria provider
const providerUrl = `http://localhost:${port}`;
const provider = new JsonRpcProvider(providerUrl);

// Lê e processa NDJSON
const linhas = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
const carteiras = linhas.map(linha => JSON.parse(linha));

// consultarSaldo(provider, carteiras[0].endereco);

for(let i = 1; i <= 10; i++) {
  console.time(`Tempo do loop externo i=${aux}`);
  for (let j = 0; j < aux && j < carteiras.length; j++) {
    consultarSaldo(provider, carteiras[j].endereco);
  }
  console.timeEnd(`Tempo do loop externo i=${aux}`);
  aux *= 4;
}