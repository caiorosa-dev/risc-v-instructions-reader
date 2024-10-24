import fs from 'fs';
import path from 'path';

import {
  InstructionStatisticType,
  InstructionWithStatisticType,
} from './types';
import { parseInstructionSetString } from './utils/instruction-set-parser';
import { detectAndFixHazards } from './modules/hazart-fixer';
import { exportInstructions } from './modules/instructions-exporter';
import { fixBranchHazards } from './modules/branch-fixer';

function printTableOfInstructions(
  instructions: InstructionWithStatisticType[]
) {
  const statisticTable = instructions.reduce((acc, instruction) => {
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
    'isNop',
  ]);
}

function readFilesFromInputFolder(inputFolder: string) {
  const files = fs.readdirSync(inputFolder);

  for (const file of files) {
    const filePath = path.join(inputFolder, file);
    if (!filePath.endsWith('.txt')) continue;

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const instructions = fileContent.split('\n');

    console.log(`Reading file (${file})...\n`);

    console.log(
      '--------------------------------------------------------------\n'
    );
    const parsedInstructions = parseInstructionSetString(instructions);
    const fixedInstructions = detectAndFixHazards(parsedInstructions, false);
    console.log(
      '--------------------------------------------------------------\nWITH FORWARDING:\n'
    );

    const fixedInstructionsWithForwarding = detectAndFixHazards(
      parsedInstructions,
      true
    );

    console.log(
      '--------------------------------------------------------------\nBRANCH FIXED:\n'
    );

    const branchFixedInstructions = fixBranchHazards(parsedInstructions);

    console.log(
      '--------------------------------------------------------------\n'
    );


    printTableOfInstructions(parsedInstructions);

    console.log(
      '--------------------------------------------------------------\nFIXED INSTRUCTIONS:\n'
    );

    const amountOfNops = fixedInstructions.filter(
      (instruction) => instruction.isNop
    ).length;
    console.log(
      `Number of NOPs inserted (and corresponding cycles added): ${amountOfNops}`
    );

    printTableOfInstructions(fixedInstructions);

    console.log(
      '--------------------------------------------------------------\nFIXED INSTRUCTIONS WITH FORWARDING:\n'
    );

    const amountOfNopsWithForwarding = fixedInstructionsWithForwarding.filter(
      (instruction) => instruction.isNop
    ).length;
    console.log(
      `Number of NOPs inserted (and corresponding cycles added): ${amountOfNopsWithForwarding}`
    );

    printTableOfInstructions(fixedInstructionsWithForwarding);

    console.log(
      '--------------------------------------------------------------\n'
    );

    console.log(
      '--------------------------------------------------------------\nBRANCH FIXED:\n'
    );

    printTableOfInstructions(branchFixedInstructions);

    console.log(
      '--------------------------------------------------------------\n'
    );

    exportInstructions(fixedInstructions, file.split('.')[0]);
  }
}

readFilesFromInputFolder('./input');
