import fs from 'fs';
import path from 'path';
import { JsonRpcProvider } from '@ethersproject/providers';
import { formatEther } from 'ethers/lib/utils';

async function consultarSaldo() {
  // Caminho do arquivo JSON com as carteiras (endereços)
  const filePath = path.join(__dirname, 'carteiras_geradas.json');
  const portPath = path.join(__dirname, '../data/besu.ports');

  // Lê o arquivo e parseia JSON
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const portData = fs.readFileSync(portPath, 'utf-8');

  const portLine = portData.split('\n').find((line) => line.startsWith('json-rpc='));
  if (!portLine) {
    console.error('Porta json-rpc não encontrada no arquivo besu.ports');
    return;
  }
  const port = portLine.split('=')[1].trim();

  // Pega o primeiro endereço (ajuste se quiser outro)
  const endereco = jsonData[0].endereco;

  // URL do seu nó local Besu
  const providerUrl = `http://localhost:${port}`;
  const provider = new JsonRpcProvider(providerUrl);

  try {
    // Consulta saldo da conta
    const saldo = await provider.getBalance(endereco);

    // Formata o saldo em ETH
    const saldoEmETH = formatEther(saldo);

    console.log(`Saldo da conta ${endereco}: ${saldoEmETH} ETH`);
  } catch (error) {
    console.error('Erro ao consultar saldo:', error);
  }
}

consultarSaldo();