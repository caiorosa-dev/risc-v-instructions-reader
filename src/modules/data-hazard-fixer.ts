import { InstructionWithStatisticType } from '../types';
import { createCopiedArrayOfInstructions, getDistanceBetweenUseAndDef } from '../utils/helpers';
import { NOP_INSTRUCTION } from '../utils/nop';

/**
 * Detects and fixes hazards in the given set of instructions.
 * @author Caio Rosa
 * @param {InstructionWithStatisticType[]} instructions - The list of instructions to process.
 * @param {boolean} isWithForwarding - Flag indicating if forwarding is enabled.
 * @returns {InstructionWithStatisticType[]} - The list of instructions with hazards fixed.
 */
export function fixDataHazards(
  instructions: InstructionWithStatisticType[],
  isWithForwarding: boolean
) {
  const fixedInstructions: InstructionWithStatisticType[] = createCopiedArrayOfInstructions(instructions);

  for (let i = 0; i < fixedInstructions.length; i++) {
    const { distance: distanceToNextUseOfRegisters, conflictRegister } =
      getDistanceBetweenUseAndDef(fixedInstructions, i, isWithForwarding ? ['0000011'] : undefined);

    if (distanceToNextUseOfRegisters !== -1) {
      const minimalDistanceBetweenDefAndUse = isWithForwarding ? 1 : 2;

      let nopsNeeded =
        minimalDistanceBetweenDefAndUse - distanceToNextUseOfRegisters;

      if (nopsNeeded > 0) {
        const indexToInsert = i + distanceToNextUseOfRegisters + 1;

        // console.log(
        //   `${nopsNeeded} NOP(s) will be inserted at index ${indexToInsert} due to the use of register ${conflictRegister} defined in instruction ${i}.`
        // );
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
