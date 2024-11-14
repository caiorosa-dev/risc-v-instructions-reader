import { InstructionWithStatisticType } from '../types';
import { createCopiedArrayOfInstructions } from '../utils/helpers';
import { NOP_INSTRUCTION } from '../utils/nop';

/**
 * Fixes branch hazards in the given set of instructions.
 * @author Caio Rosa & Jordan Lippert
 * @param {InstructionWithStatisticType[]} instructions - The list of instructions to process.
 * @returns {InstructionWithStatisticType[]} - The list of instructions with branch hazards fixed.
 */
export function fixBranchHazards(instructions: InstructionWithStatisticType[]) {
	const fixedInstructions: InstructionWithStatisticType[] = createCopiedArrayOfInstructions(instructions);

	for (let i = 0; i < fixedInstructions.length; i++) {
		const currentInstruction = fixedInstructions[i];

		if (
			currentInstruction.type === 'B' ||
			currentInstruction.statisticType === 'JUMP'
		) {
			let nopsNeeded = 2;

			const indexToInsert = i + 1;

			// console.log(
			// 	`${nopsNeeded} NOP(s) will be inserted at index ${indexToInsert} due to the branch instruction at index ${i}.`
			// );
			fixedInstructions.splice(
				indexToInsert,
				0,
				...Array(nopsNeeded).fill(NOP_INSTRUCTION)
			);
		}
	}

	return fixedInstructions;
}
