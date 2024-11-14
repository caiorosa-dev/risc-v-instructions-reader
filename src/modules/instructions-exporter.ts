import { Instruction } from '../types/instruction';
import * as fs from 'fs';
import * as path from 'path';

function writeFileTxt(nameFile: string, content: string) {
  const packageOutput = path.join('output');

  if (!fs.existsSync(packageOutput)) {
    fs.mkdirSync(packageOutput);
  }

  const fileWay = path.join(packageOutput, `${nameFile}-fixed.txt`);

  fs.writeFileSync(fileWay, content);

  console.log(
    `File ${nameFile}-fixed.txt generated successfully in ${packageOutput}`
  );
}

/**
 * Exporta as instruções em formato binário para um arquivo.
 * @author Jordan Lippert
 * @param {Instruction[]} instructions - Array de instruções a serem exportadas.
 * @param {string} fileName - Nome do arquivo a ser exportado.
 */
export function exportInstructions(
  instructions: Instruction[],
  fileName: string
) {
  const contentFile = instructions
    .map((instructions) => instructions.binary)
    .join('\n');

  writeFileTxt(fileName, contentFile);
}
