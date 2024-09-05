import { Config } from '../config';
import {
  InstructionStatisticType,
  InstructionWithStatisticType,
} from '../types';
import { convertHexToBinary } from './number-converter';
import { parseInstruction } from './parser';

function classifyInstructionStatisticType(
  binaryInstruction: string
): InstructionStatisticType {
  const opcode = binaryInstruction.slice(25, 32);

  for (const key in Config.instructionsTypes) {
    const instructionsOfType =
      Config.instructionsTypes[key as InstructionStatisticType];

    if (instructionsOfType.includes(opcode)) {
      return key as InstructionStatisticType;
    }
  }

  return 'OTHER';
}

export function parseInstructionSetString(
  instructions: string
): InstructionWithStatisticType[] {
  const instructionSet = instructions.split('\n');

  const parsedInstructions: InstructionWithStatisticType[] = [];

  instructionSet.forEach((instruction) => {
    if (instruction.length < 8) return;

    const binaryInstruction = convertHexToBinary(instruction);
    try {
      const parsedInstruction = parseInstruction(binaryInstruction);

      const statisticType = classifyInstructionStatisticType(binaryInstruction);

      const instructionWithStatisticType: InstructionWithStatisticType = {
        ...parsedInstruction,
        statisticType,
      };

      parsedInstructions.push(instructionWithStatisticType);
    } catch (error) {
      console.error(error);
    }
  });

  return parsedInstructions;
}
