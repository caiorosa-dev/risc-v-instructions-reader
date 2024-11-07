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

export function classifyInstructionName(
  opcode: string,
  func3?: number
): string | undefined {
  switch (opcode) {
    case '0110111':
      return 'lui';
    case '0010111':
      return 'auipc';
    case '1101111':
      return 'jal';
    case '1100111':
      return 'jalr';
    case '1100011':
      switch (func3) {
        case 0:
          return 'beq';
        case 1:
          return 'bne';
        case 4:
          return 'blt';
        case 5:
          return 'bge';
        case 6:
          return 'bltu';
        case 7:
          return 'bgeu';
      }
      break;
    case '0000011':
      switch (func3) {
        case 0:
          return 'lb';
        case 1:
          return 'lh';
        case 2:
          return 'lw';
        case 4:
          return 'lbu';
        case 5:
          return 'lhu';
      }
      break;
    case '0100011':
      switch (func3) {
        case 0:
          return 'sb';
        case 1:
          return 'sh';
        case 2:
          return 'sw';
      }
      break;
    case '0010011':
      switch (func3) {
        case 0:
          return 'addi';
        case 2:
          return 'slti';
        case 3:
          return 'sltiu';
        case 4:
          return 'xori';
        case 6:
          return 'ori';
        case 7:
          return 'andi';
        case 1:
          return 'slli';
        case 5:
          return 'srli';
      }
      break;
    case '0110011':
      switch (func3) {
        case 0:
          return 'add';
        case 4:
          return 'xor';
        case 6:
          return 'or';
        case 7:
          return 'and';
        case 1:
          return 'sll';
        case 5:
          return 'srl';
      }
      break;
    case '1110011':
      return 'ecall';
  }

  return undefined;
}

/**
 * Parses a binary number string and returns its decimal representation,
 * handling both positive and negative numbers in two's complement format.
 *
 * @param binaryNumber - The binary number as a string.
 * @returns The decimal representation of the binary number.
 */
function parseImmediateWithSign(binaryNumber: string): number {
  const isNegative = binaryNumber[0] === '1';
  const unsignedInt = parseInt(binaryNumber, 2);

  if (isNegative) {
    // shift lógico para esquerda para substrair, 4096 do número, para obter o valor negativo
    return unsignedInt - (1 << binaryNumber.length);
  }

  return unsignedInt;
}

export function parseInstruction(binaryInstruction: string): Instruction {
  const type = classifyInstruction(binaryInstruction);

  if (!type) throw new Error(`Unknown instruction type (${binaryInstruction})`);

  const opcode = binaryInstruction.slice(25, 32);

  switch (type) {
    case 'R': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const rs2 = parseInt(binaryInstruction.slice(7, 12), 2);
      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);
      const funct7 = parseInt(binaryInstruction.slice(0, 7), 2);

      const name = classifyInstructionName(opcode, funct3);

      return {
        type: 'R',
        rd,
        rs1,
        rs2,
        funct3,
        funct7,
        opcode,
        name,
        binary: binaryInstruction,
      };
    }

    case 'I': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const imm = parseImmediateWithSign(binaryInstruction.slice(0, 12));
      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);

      const name = classifyInstructionName(opcode, funct3);

      return {
        type: 'I',
        rd,
        rs1,
        imm,
        funct3,
        opcode,
        name,
        binary: binaryInstruction,
      };
    }

    case 'S': {
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const rs2 = parseInt(binaryInstruction.slice(7, 12), 2);

      const imm11_5Str = binaryInstruction.slice(0, 7);
      const imm4_0Str = binaryInstruction.slice(20, 25);

      const immStr = imm11_5Str + imm4_0Str;
      const imm = parseImmediateWithSign(immStr);

      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);
      const name = classifyInstructionName(opcode, funct3);

      return {
        type: 'S',
        rs1,
        rs2,
        imm,
        funct3,
        opcode,
        name,
        binary: binaryInstruction,
      };
    }

    case 'B': {
      const rs1 = parseInt(binaryInstruction.slice(12, 17), 2);
      const rs2 = parseInt(binaryInstruction.slice(7, 12), 2);

      const imm12Str = binaryInstruction.slice(0, 1); // Bit 12
      const imm10_5Str = binaryInstruction.slice(1, 7); // Bits 10 a 5
      const imm4_1Str = binaryInstruction.slice(20, 24); // Bits 4 a 1
      const imm11Str = binaryInstruction.slice(24, 25); // Bit 11

      const immStr = imm12Str + imm11Str + imm10_5Str + imm4_1Str + '0';
      const imm = parseImmediateWithSign(immStr);

      const funct3 = parseInt(binaryInstruction.slice(17, 20), 2);

      const name = classifyInstructionName(opcode, funct3);

      return {
        type: 'B',
        rs1,
        rs2,
        imm,
        funct3,
        opcode,
        name,
        binary: binaryInstruction,
      };
    }

    case 'U': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);

      const immStr = binaryInstruction.slice(0, 20) + '000000000000';
      const imm = parseImmediateWithSign(immStr);

      const name = classifyInstructionName(opcode);

      return { type: 'U', rd, imm, binary: binaryInstruction, opcode, name };
    }

    case 'J': {
      const rd = parseInt(binaryInstruction.slice(20, 25), 2);

      const imm20Str = binaryInstruction.slice(0, 1); // Bit 20
      const imm10_1Str = binaryInstruction.slice(1, 11); // Bits 10 a 1
      const imm11Str = binaryInstruction.slice(11, 12); // Bit 11
      const imm19_12Str = binaryInstruction.slice(12, 20); // Bits 19 a 12

      const immStr = imm20Str + imm19_12Str + imm11Str + imm10_1Str + '0';
      const imm = parseImmediateWithSign(immStr);

      const name = classifyInstructionName(opcode);

      return { type: 'J', rd, imm, opcode, binary: binaryInstruction, name };
    }

    default:
      throw new Error(`Unsupported instruction type (${type})`);
  }
}
