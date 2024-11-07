import { InstructionWithStatisticType } from '../types';
import { getDistanceBetweenUseAndDef } from '../utils/helpers';
import { NOP_INSTRUCTION } from '../utils/nop';

export function detectAndFixHazards(
  instructions: InstructionWithStatisticType[],
  isWithForwarding: boolean
) {
  const fixedInstructions: InstructionWithStatisticType[] = [...instructions];

  for (let i = 0; i < fixedInstructions.length; i++) {
    const { distance: distanceToNextUseOfRegisters, conflictRegister } =
      getDistanceBetweenUseAndDef(fixedInstructions, i, isWithForwarding ? ['0000011'] : undefined);

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
