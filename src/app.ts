import {
  InstructionStatisticType,
  InstructionWithStatisticType,
} from './types';
import { parseInstructionSetString } from './utils/instruction-set-parser';

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
