import { Config } from './config';
import { parseInstruction } from './utils/parser';
import {
  InstructionStatisticType,
  InstructionWithStatisticType,
} from './types';
import { convertHexToBinary } from './utils/number-converter';

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

function parseInstructionSetString(
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

const instructions = `
00a00293
00500313
006283b3
40628e33
40530eb3
0062ef33
0062ffb3
00500293
00100313
406282b3
fe029ee3
`;

function printTableOfInstructions(
  instructions: InstructionWithStatisticType[]
) {
  const statisticTable = parsedInstructions.reduce((acc, instruction) => {
    acc['TOTAL'] = (acc['TOTAL'] || 0) + 1;
    acc[instruction.statisticType] = (acc[instruction.statisticType] || 0) + 1;

    return acc;
  }, {} as Record<InstructionStatisticType | 'TOTAL', number>);

  console.log('Statistic table:');
  console.table(statisticTable);

  console.log('Instructions:');
  console.table(instructions, [
    'opcode',
    'type',
    'rd',
    'funct3',
    'rs1',
    'rs2',
    'imm',
  ]);
}

const parsedInstructions = parseInstructionSetString(instructions);

printTableOfInstructions(parsedInstructions);
