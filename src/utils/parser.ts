import { Config } from '../config';
import { Instruction, InstructionType } from '../types/instruction';

export function classifyInstruction(binary: string): InstructionType | null {
  const opcode = binary.slice(25, 32);

  if (Config.instructionsTypes.ALU.includes(opcode)) {
    return opcode === '0110011' || opcode === '0111011' ? 'R' : 'I';
  } else if (Config.instructionsTypes.JUMP.includes(opcode)) {
    return opcode === '1101111' ? 'J' : 'I';
  } else if (Config.instructionsTypes.BRANCH.includes(opcode)) {
    return 'B';
  } else if (Config.instructionsTypes.MEMORY.includes(opcode)) {
    return opcode === '0000011' ? 'I' : 'S';
  } else if (opcode === '0110111' || opcode === '0010111') {
    return 'U';
  }

  return null;
}

export function parseInstruction(binaryInstruction: string): Instruction {
  const type = classifyInstruction(binaryInstruction);

  if (!type) throw new Error('Unknown instruction type');

  const opcode = binaryInstruction.slice(25, 32);

  switch (type) {
    case 'R': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const rs2 = parseInt(binaryInstruction.slice(7, 12), 2);
      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);
      const funct7 = parseInt(binaryInstruction.slice(0, 7), 2);

      return {
        type: 'R',
        rd,
        rs1,
        rs2,
        funct3,
        funct7,
        opcode,
        binary: binaryInstruction,
      };
    }

    case 'I': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const imm = parseInt(binaryInstruction.slice(0, 12), 2);
      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);

      return {
        type: 'I',
        rd,
        rs1,
        imm,
        funct3,
        opcode,
        binary: binaryInstruction,
      };
    }

    case 'S': {
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const rs2 = parseInt(binaryInstruction.slice(7, 12), 2);

      const imm11_5Str = binaryInstruction.slice(0, 7);
      const imm4_0Str = binaryInstruction.slice(20, 25);

      const immStr = imm11_5Str + imm4_0Str;
      const imm = parseInt(immStr, 2);

      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);

      return {
        type: 'S',
        rs1,
        rs2,
        imm,
        funct3,
        opcode,
        binary: binaryInstruction,
      };
    }

    case 'B': {
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const rs2 = parseInt(binaryInstruction.slice(7, 12), 2);

      const imm12Str = binaryInstruction.slice(0, 1);
      const imm11Str = binaryInstruction.slice(24, 25);
      const imm10_5Str = binaryInstruction.slice(1, 7);
      const imm4_1Str = binaryInstruction.slice(20, 24);

      const immStr = imm12Str + imm11Str + imm10_5Str + imm4_1Str + '0';
      const imm = parseInt(immStr, 2);

      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);

      return {
        type: 'B',
        rs1,
        rs2,
        imm,
        funct3,
        opcode,
        binary: binaryInstruction,
      };
    }

    case 'U': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);

      const immStr = binaryInstruction.slice(0, 20);
      const imm = parseInt(immStr, 2) << 12;

      return { type: 'U', rd, imm, opcode, binary: binaryInstruction };
    }

    case 'J': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);

      const imm20Str = binaryInstruction.slice(0, 1);
      const imm10_1Str = binaryInstruction.slice(1, 11);
      const imm11Str = binaryInstruction.slice(11, 12);
      const imm19_12Str = binaryInstruction.slice(12, 20);

      const immStr = imm20Str + imm19_12Str + imm11Str + imm10_1Str + '0';
      const imm = parseInt(immStr, 2);

      return { type: 'J', rd, imm, opcode, binary: binaryInstruction };
    }

    default:
      throw new Error(`Unsupported instruction type (${type})`);
  }
}
