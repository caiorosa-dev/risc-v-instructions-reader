import { log } from 'node:console';
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
  index: number,
  isWithForwarding: boolean
):
  | { distance: number; conflictRegister: string }
  | { distance: -1; conflictRegister: undefined } {
  let distance = 0;
  const selectedInstruction = instructions[index];

  if (
    !isInstructionWithRD(selectedInstruction) ||
    isInstructionNOP(selectedInstruction) ||
    index === instructions.length - 1
  ) {
    return { distance: -1, conflictRegister: undefined };
  }

  if (isWithForwarding && selectedInstruction.opcode !== '0000011') {
    return { distance: -1, conflictRegister: undefined };
  }

  const { rd } = selectedInstruction;

  for (let i = index + 1; i < instructions.length; i++) {
    const currentInstruction = instructions[i];

    if ('rs1' in currentInstruction && currentInstruction.rs1 === rd) {
      return { distance, conflictRegister: 'rs1' };
    }

    if ('rs2' in currentInstruction && currentInstruction.rs2 === rd) {
      return { distance, conflictRegister: 'rs2' };
    }

    distance++;
  }

  return { distance: -1, conflictRegister: undefined };
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
  instructions: InstructionWithStatisticType[],
  isWithForwarding: boolean
) {
  const fixedInstructions: InstructionWithStatisticType[] = [...instructions];

  for (let i = 0; i < fixedInstructions.length; i++) {
    const { distance: distanceToNextUseOfRegisters, conflictRegister } =
      getDistanceBetweenUseAndDef(fixedInstructions, i, isWithForwarding);

    if (distanceToNextUseOfRegisters !== -1) {
      const minimalDistanceBetweenDefAndUse = isWithForwarding ? 1 : 2;

      let nopsNeeded =
        minimalDistanceBetweenDefAndUse - distanceToNextUseOfRegisters;

      if (nopsNeeded > 0) {
        const indexToInsert = i + distanceToNextUseOfRegisters + 1;

        console.log(
          `${nopsNeeded} NOP(s) will be inserted at index ${indexToInsert} due to the use of register ${conflictRegister} defined in instruction ${i}.`
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
