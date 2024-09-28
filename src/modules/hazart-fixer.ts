import { InstructionWithStatisticType } from '../types';

function isInstructionWithRD(instruction: InstructionWithStatisticType) {
  return instruction.type === 'R' || instruction.type === 'I';
}

function isInstructionNOP(instruction: InstructionWithStatisticType) {
  return (
    instruction.type === 'I' &&
    instruction.rd === 0 &&
    instruction.rs1 === 0 &&
    instruction.imm === 0 &&
    instruction.funct3 === 0
  );
}

function getDistanceBetweenUseAndDef(
  instructions: InstructionWithStatisticType[],
  index: number
) {
  let distance = 0;
  const selectedInstruction = instructions[index];

  if (
    !isInstructionWithRD(selectedInstruction) ||
    isInstructionNOP(selectedInstruction) ||
    index === instructions.length - 1
  ) {
    return -1;
  }

  const { rd } = selectedInstruction;

  for (let i = index + 1; i < instructions.length; i++) {
    const currentInstruction = instructions[i];

    if (isInstructionWithRD(currentInstruction)) {
      if ('rs1' in currentInstruction && currentInstruction.rs1 === rd) {
        return distance;
      }

      if (currentInstruction.type === 'R' && currentInstruction.rs2 === rd) {
        return distance;
      }
    }

    distance++;
  }

  return -1;
}

const NOP_INSTRUCTION: InstructionWithStatisticType = {
  type: 'I',
  statisticType: 'ALU',
  imm: 0,
  funct3: 0,
  rd: 0,
  rs1: 0,
  opcode: '0010011',
  binary: '00000000000000000000000000010011',
  isNop: true,
};

export function detectAndFixHazards(
  instructions: InstructionWithStatisticType[]
) {
  const fixedInstructions: InstructionWithStatisticType[] = [...instructions];

  for (let i = 0; i < fixedInstructions.length; i++) {
    const distanceToNextUseOfRegisters = getDistanceBetweenUseAndDef(
      fixedInstructions,
      i
    );

    console.log(`Index: ${i}, distance: ${distanceToNextUseOfRegisters}`);

    if (distanceToNextUseOfRegisters !== -1) {
      const nopsNeeded = 2 - distanceToNextUseOfRegisters;

      if (nopsNeeded > 0) {
        const indexToInsert = i + distanceToNextUseOfRegisters + 1;

        console.log(
          `Inserting ${nopsNeeded} NOP(s) at index ${indexToInsert}, because distance is ${distanceToNextUseOfRegisters}`
        );
        fixedInstructions.splice(
          indexToInsert,
          0,
          ...Array(nopsNeeded).fill(NOP_INSTRUCTION)
        );
      }
    }
  }

  return fixedInstructions;
}
