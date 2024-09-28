import { Instruction } from '../types/instruction';

// TODO: Implementar a função para exportar as instruções em formato binário para um arquivo.

// * Separar cada instrução com \n
// ! O arquivo exportado deve ser salvo na pasta 'output' com o nome do arquivo passado pelo parâmetro adicionado com a extensão '.txt' e escrito '-fixed' no final
// ? Exemplo: fileName = 'instrucoes' -> arquivo salvo em 'output/instrucoes-fixed.txt'

/**
 * Exporta as instruções em formato binário para um arquivo.
 * @param instructions - Array de instruções a serem exportadas.
 * @param fileName - Nome do arquivo a ser exportado.
 */
export function exportInstructions(
  instructions: Instruction[],
  fileName: string
) {}
