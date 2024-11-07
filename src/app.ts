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
import { fixHazardsAndReOrderNop } from './modules/re-order-hazard-fixer';

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
    'name',
    'type',
    'rd',
    'funct3',
    'rs1',
    'rs2',
    'imm',
  ]);
}

function processFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const instructions = fileContent.split('\n');

  console.log(`Reading file (${path.basename(filePath)})...\n`);
  console.log(
    '--------------------------------------------------------------\n'
  );

  const parsedInstructions = parseInstructionSetString(instructions);
  const fixedInstructions = detectAndFixHazards(parsedInstructions, false);
  const fixedInstructionsWithForwarding = detectAndFixHazards(
    parsedInstructions,
    true
  );
  const branchFixedInstructions = fixBranchHazards(parsedInstructions);
  const reorderedInstructions = fixHazardsAndReOrderNop(parsedInstructions);

  printInstructionDetails(
    parsedInstructions,
    fixedInstructions,
    fixedInstructionsWithForwarding,
    branchFixedInstructions,
    reorderedInstructions
  );

  exportInstructions(fixedInstructions, path.basename(filePath, '.txt'));
}

function printInstructionDetails(
  parsedInstructions: InstructionWithStatisticType[],
  fixedInstructions: InstructionWithStatisticType[],
  fixedInstructionsWithForwarding: InstructionWithStatisticType[],
  branchFixedInstructions: InstructionWithStatisticType[],
  reorderedInstructions: InstructionWithStatisticType[]
) {
  printTableOfInstructions(parsedInstructions);

  // console.log('--------------------------------------------------------------\nFIXED INSTRUCTIONS:\n');
  // printNopCount(fixedInstructions);
  // printTableOfInstructions(fixedInstructions);

  // console.log('--------------------------------------------------------------\nFIXED INSTRUCTIONS WITH FORWARDING:\n');
  // printNopCount(fixedInstructionsWithForwarding);
  // printTableOfInstructions(fixedInstructionsWithForwarding);

  // console.log('--------------------------------------------------------------\nBRANCH FIXED:\n');
  // printTableOfInstructions(branchFixedInstructions);

  console.log(
    '--------------------------------------------------------------\nREORDERED INSTRUCTIONS:\n'
  );
  printTableOfInstructions(reorderedInstructions);
  console.log(
    '--------------------------------------------------------------\n'
  );
}

function printNopCount(instructions: InstructionWithStatisticType[]) {
  const amountOfNops = instructions.filter(
    (instruction) => instruction.isNop
  ).length;
  console.log(
    `Number of NOPs inserted (and corresponding cycles added): ${amountOfNops}`
  );
}

function readFilesFromInputFolder(inputFolder: string) {
  const files = fs.readdirSync(inputFolder);

  for (const file of files) {
    const filePath = path.join(inputFolder, file);
    if (filePath.endsWith('.txt')) {
      processFile(filePath);
    }
  }
}

readFilesFromInputFolder('./input');
