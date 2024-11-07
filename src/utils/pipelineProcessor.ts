import { Config } from './config';
import { InstructionWithStatisticType, InstructionStatisticType } from './types';

/**
 * Funções para otimizar o pipeline e aplicar técnicas como delayed branch e reordenação.
 */

// Função para identificar o tipo de instrução
function getInstructionType(instruction: InstructionWithStatisticType): InstructionStatisticType {
  const { instructionsTypes } = Config;
  const opcode = instruction.opcode;

  for (const [type, codes] of Object.entries(instructionsTypes)) {
    if (codes.includes(opcode)) {
      return type as InstructionStatisticType;
    }
  }
  return 'OTHER';
}

// Função para aplicar delayed branch
function applyDelayedBranch(instructions: InstructionWithStatisticType[]): void {
  for (let i = 0; i < instructions.length - 1; i++) {
    const currentInstr = instructions[i];
    const currentType = getInstructionType(currentInstr);

    if (currentType === 'BRANCH') {
      const delayInstr = findDelaySlotInstruction(i, instructions);

      if (delayInstr) {
        instructions.splice(i + 1, 0, delayInstr);
        instructions.splice(instructions.indexOf(delayInstr), 1);
      } else {
        instructions.splice(i + 1, 0, { ...currentInstr, isNop: true, opcode: 'NOP' });
      }
    }
  }
}

// Função auxiliar para encontrar instrução para o slot de atraso
function findDelaySlotInstruction(index: number, instructions: InstructionWithStatisticType[]): InstructionWithStatisticType | null {
  for (let j = index + 1; j < instructions.length; j++) {
    const instr = instructions[j];
    if (getInstructionType(instr) !== 'BRANCH' && !hasDependency(instr, instructions[index])) {
      return instr;
    }
  }
  return null;
}

// Verificação de dependências entre instruções
function hasDependency(instr1: InstructionWithStatisticType, instr2: InstructionWithStatisticType): boolean {
  return instr1.rs1 === instr2.rd || instr1.rs2 === instr2.rd;
}

// Função para combinar reordenação e delayed branch
function optimizeInstructions(instructions: InstructionWithStatisticType[]): void {
  for (let i = 0; i < instructions.length - 1; i++) {
    const instr = instructions[i];
    const nextInstr = instructions[i + 1];

    if (getInstructionType(instr) === 'ALU' && hasDependency(instr, nextInstr)) {
      reorderInstructions(i, instructions);
    }

    applyDelayedBranch(instructions);
  }
}

// Reorganiza instruções para minimizar NOPs
function reorderInstructions(index: number, instructions: InstructionWithStatisticType[]): void {
  for (let j = index + 2; j < instructions.length; j++) {
    if (!hasDependency(instructions[index], instructions[j])) {
      [instructions[index + 1], instructions[j]] = [instructions[j], instructions[index + 1]];
      break;
    }
  }
}

// Contador de sobrecusto (NOPs) para análise
function countInstructionOverhead(instructions: InstructionWithStatisticType[]): number {
  return instructions.filter(instr => instr.isNop).length;
}

// Exporta as funções principais
export {
  applyDelayedBranch,
  optimizeInstructions,
  countInstructionOverhead
};
