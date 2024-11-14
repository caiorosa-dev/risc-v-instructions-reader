import fs from 'fs';
import path from 'path';
import colors from 'colors';

import {
  InstructionWithStatisticType,
} from './types';
import { parseInstructionSetString } from './utils/instruction-set-parser';
import { exportInstructions } from './modules/instructions-exporter';
import { fixBranchHazards } from './modules/branch-hazard-fixer';
import { fixDataAndBranchHazards, fixHazardsAndReOrderNop, fixHazardsApplyingDelayedBranch } from './modules/re-ordenation-instructions';
import { printTableOfInstructions } from './utils/ui';

function processFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const instructions = fileContent.split('\n');

  console.log(`Reading file (${path.basename(filePath)})...\n`);
  console.log(
    '--------------------------------------------------------------\n'
  );

  const parsedInstructions = parseInstructionSetString(instructions);

  const reorderedDataHazardInstructions = fixHazardsAndReOrderNop(parsedInstructions); // 1
  const branchFixedInstructions = fixBranchHazards(parsedInstructions); // 2
  const delayedBranchFixedInstructions = fixHazardsApplyingDelayedBranch(parsedInstructions); // 3
  const finalReorderedInstructions = fixDataAndBranchHazards(parsedInstructions); // 4

  printInstructionDetails(
    parsedInstructions,
    reorderedDataHazardInstructions,
    branchFixedInstructions,
    delayedBranchFixedInstructions,
    finalReorderedInstructions
  );

  exportInstructions(finalReorderedInstructions, path.basename(filePath, '.txt'));
}

function printInstructionDetails(
  parsedInstructions: InstructionWithStatisticType[],
  reorderedDataHazardInstructions: InstructionWithStatisticType[],
  branchFixedInstructions: InstructionWithStatisticType[],
  delayedBranchFixedInstructions: InstructionWithStatisticType[],
  finalReorderedInstructions: InstructionWithStatisticType[]
) {
  console.log(colors.gray.bold('--------------------------------------------------------------\n'));
  console.log(colors.cyan.bold('PARSED INSTRUCTIONS:\n'));
  printTableOfInstructions(parsedInstructions);
  console.log(colors.gray.bold('--------------------------------------------------------------'));

  console.log('\n\n\n');
  console.log(colors.magenta.bold('1. REORDERED DATA HAZARD INSTRUCTIONS:\n'));
  printTableOfInstructions(reorderedDataHazardInstructions);
  printNopCount(reorderedDataHazardInstructions);
  console.log(colors.gray.bold('--------------------------------------------------------------'));

  console.log('\n\n\n');
  console.log(colors.green.bold('2. BRANCH FIXED:\n'));
  printTableOfInstructions(branchFixedInstructions);
  printNopCount(branchFixedInstructions);
  console.log(colors.gray.bold('--------------------------------------------------------------'));

  console.log('\n\n\n');
  console.log(colors.yellow.bold('3. DELAYED BRANCH REORDERED:\n'));
  printTableOfInstructions(delayedBranchFixedInstructions);
  printNopCount(delayedBranchFixedInstructions);
  console.log(colors.gray.bold('--------------------------------------------------------------'));

  console.log('\n\n\n');
  console.log(colors.white.bold('4. FINAL REORDERED INSTRUCTIONS:\n'));
  printTableOfInstructions(finalReorderedInstructions);
  printNopCount(finalReorderedInstructions);

  console.log(colors.gray.bold('--------------------------------------------------------------\n'));
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
