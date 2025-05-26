import fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';
import { JsonRpcProvider } from '@ethersproject/providers';
import abiSTR from '../abi/STR.json';
import abiRealDigitalEnableAccount from '../abi/RealDigitalEnableAccount.json';

// Função de delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função principal
async function emiteRealDigital() {
  // Caminhos dos arquivos
  const filePath = path.join(__dirname, 'carteiras_geradas.json');
  const portPath = path.join(__dirname, '../data/besu.ports');

  // Leitura e parse dos arquivos
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const portData = fs.readFileSync(portPath, 'utf-8');

  const portLine = portData.split('\n').find(line => line.startsWith('json-rpc='));
  if (!portLine) {
    console.error('Porta json-rpc não encontrada no arquivo besu.ports');
    return;
  }
  const port = portLine.split('=')[1].trim();

  // Endereço da carteira
  const endereco = jsonData[0].endereco;

  // Provider do Besu
  const providerUrl = `http://localhost:${port}`;
  const provider = new JsonRpcProvider(providerUrl);

  // Instâncias dos contratos
  const STR = await ethers.getContractAt(abiSTR, '<Endereço do contrato STR>');
  const enableAccount = await ethers.getContractAt(abiRealDigitalEnableAccount, '<Endereço do contrato RealDigitalEnableAccount>');

  // Signers
  const [, participantX, anotherAddressParticipantX] = await ethers.getSigners();

  try {
    // Habilitar nova conta
    await enableAccount.connect(participantX).enableAccount(anotherAddressParticipantX.address);
    console.log(`Conta ${anotherAddressParticipantX.address} habilitada.`);

    // Esperar o tempo de um bloco (~5s)
    await delay(5000);

    // Emitir Real Digital
    const mintTx = await STR.connect(anotherAddressParticipantX).requestToMint(ethers.utils.parseUnits("100.50", 2));
    console.log(`Transação de emissão enviada: ${mintTx.hash}`);

    // Destruir Real Digital
    const burnTx = await STR.connect(anotherAddressParticipantX).requestToBurn(ethers.utils.parseUnits("100", 2));
    console.log(`Transação de destruição enviada: ${burnTx.hash}`);
    
  } catch (error) {
    console.error('Erro ao executar operações de emissão e destruição:', error);
  }
}

// Execução
emiteRealDigital();