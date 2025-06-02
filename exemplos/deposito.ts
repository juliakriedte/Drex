import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

async function enviarTransacoesEmCiclo() {
  // Caminho dos arquivos
  const carteiraPath = path.join(__dirname, 'carteiras_geradas.ndjson');
  const portPath = path.join(__dirname, '../data/besu.ports');

  // Lê carteiras e porta
  const linhas = fs.readFileSync(carteiraPath, 'utf-8').trim().split('\n');
  const carteiras = linhas.map(line => JSON.parse(line));

  const portData = fs.readFileSync(portPath, 'utf-8');

  const portLine = portData.split('\n').find(line => line.startsWith('json-rpc='));
  if (!portLine) {
    console.error('Porta JSON-RPC não encontrada.');
    return;
  }
  const port = portLine.split('=')[1].trim();

  const providerUrl = `http://localhost:${port}`;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  const quantidade = carteiras.length;

  if (quantidade < 2) {
    console.error('É necessário pelo menos duas carteiras.');
    return;
  }

  // for (let i = 0; i < quantidade; i++) {
    // const remetente = carteiras[i];
    // const destinatario = (i === 0) ? carteiras[quantidade - 1] : carteiras[i - 1];  // conta anterior, ou última se for a primeira
    const remetente = carteiras[0];
    const destinatario = carteiras[1];
    const chavePrivada = remetente.chavePrivada;

    if (!chavePrivada) {
      console.error(`Chave privada não encontrada para a conta ${remetente.endereco}`);
      // continue;
    }

    const wallet = new ethers.Wallet(chavePrivada, provider);

    console.log(`Enviando de ${remetente.endereco} para ${destinatario.endereco}`);

    const tx = {
      to: destinatario.endereco,
      value: ethers.utils.parseEther('0.1'),
      gasLimit: 21000,
    };

    try {
      const txResponse = await wallet.sendTransaction(tx);
      console.log(`Transação enviada! Hash: ${txResponse.hash}`);

      const receipt = await txResponse.wait();
      console.log(`Transação confirmada no bloco: ${receipt.blockNumber}`);
    } catch (error) {
      console.error(`Erro ao enviar transação de ${remetente.endereco} para ${destinatario.endereco}:`, error);
    }
  // }
}

enviarTransacoesEmCiclo();