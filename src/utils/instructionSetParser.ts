import { InstructionWithStatisticType, InstructionStatisticType } from './types';
import { Config } from './config';

export function parseInstructionSetString(instructions: string[]): InstructionWithStatisticType[] {
  return instructions.map((line) => {
    const [opcode, rd, rs1, rs2, imm] = line.split(' '); // Exemplo simplificado

    const statisticType: InstructionStatisticType = getInstructionType(opcode);

    return {
      opcode,
      rd: parseInt(rd, 10),
      rs1: parseInt(rs1, 10),
      rs2: parseInt(rs2, 10),
      imm: parseInt(imm, 10),
      type: 'R', // Ajuste para o tipo correto conforme o opcode
      statisticType,
      binary: line,
    };
  });
}

// Função auxiliar para identificar o tipo de estatística com base no opcode
function getInstructionType(opcode: string): InstructionStatisticType {
  const { instructionsTypes } = Config;

  for (const [type, codes] of Object.entries(instructionsTypes)) {
    if (codes.includes(opcode)) {
      return type as InstructionStatisticType;
    }
  }

  return 'OTHER';
}
