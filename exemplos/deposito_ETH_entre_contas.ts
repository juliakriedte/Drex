import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

async function enviarTransacao() {
  // Caminho dos arquivos
  const carteiraPath = path.join(__dirname, 'carteiras_geradas.json');
  const portPath = path.join(__dirname, '../data/besu.ports');

  // Lê carteiras e porta
  const carteiras = JSON.parse(fs.readFileSync(carteiraPath, 'utf-8'));
  const portData = fs.readFileSync(portPath, 'utf-8');

  const portLine = portData.split('\n').find(line => line.startsWith('json-rpc='));
  if (!portLine) {
    console.error('Porta JSON-RPC não encontrada.');
    return;
  }
  const port = portLine.split('=')[1].trim();

  const providerUrl = `http://localhost:${port}`;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  const remetente = carteiras[0];
  const destinatario = carteiras[1];

  if (!remetente || !destinatario) {
    console.error('Contas insuficientes no arquivo.');
    return;
  }

  const chavePrivada = remetente.chavePrivada

  if (!chavePrivada) {
    console.error('Chave privada não encontrada na conta do remetente.');
    return;
  }

  const wallet = new ethers.Wallet(chavePrivada, provider);

  console.log(`Enviando de ${wallet.address} para ${destinatario.endereco}`);

  const tx = {
    to: destinatario.endereco,
    value: ethers.utils.parseEther('0.01'),
    gasLimit: 21000,  // Padrão para transferência simples
  };

  try {
    const txResponse = await wallet.sendTransaction(tx);
    console.log('Transação enviada! Hash:', txResponse.hash);

    const receipt = await txResponse.wait();
    console.log('Transação confirmada no bloco:', receipt.blockNumber);
  } catch (error) {
    console.error('Erro ao enviar transação:', error);
  }
}

enviarTransacao();