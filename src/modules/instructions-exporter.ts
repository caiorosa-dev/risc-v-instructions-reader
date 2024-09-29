import { Instruction } from '../types/instruction';
import * as fs from 'fs';
import * as path from 'path';

function writeFileTxt(nameFile: string, content: string) {
  const packageOutput = path.join(__dirname, 'output');
  
  if(!fs.existsSync(packageOutput)) {
    fs.mkdirSync(packageOutput);
  }

  const fileWay = path.join(packageOutput, '${nameFile}-fixed.txt');

  fs.writeFileSync(fileWay, content);
  
  console.log('File ${nameFile}fixed.txt generated successfully in ${packageOutput}');
}

/**
 * Exporta as instruções em formato binário para um arquivo.
 * @param instructions - Array de instruções a serem exportadas.
 * @param fileName - Nome do arquivo a ser exportado.
 */

export function exportInstructions(
  instructions: Instruction[],
  fileName: string
) {
  const contentFile = instructions.map(instruction => instruction.toString()).join('\n');
  writeFileTxt(fileName, contentFile);
}
