import { InstructionWithStatisticType } from '../types';
import { reOrderInstructions } from '../utils/re-order-instructions';
import { fixBranchHazards } from './branch-hazard-fixer';
import { fixDataHazards } from './data-hazard-fixer';

/**
 * Fixes hazards and reorders NOPs in the given set of instructions.
 * @author Caio Rosa & Joshua Jackson
 * @param {InstructionWithStatisticType[]} instructions - The list of instructions to process.
 * @returns {InstructionWithStatisticType[]} - The list of instructions with hazards fixed and NOPs reordered.
 */
export function fixHazardsAndReOrderNop(
	instructions: InstructionWithStatisticType[]
) {
	const fixedInstructions = fixDataHazards(instructions, true);

	const reOrderedInstructions = reOrderInstructions(fixedInstructions);

	return reOrderedInstructions;
}

/**
 * Fixes hazards and reorders NOPs in the given set of instructions.
 * @author Caio Rosa & Joshua Jackson
 * @param {InstructionWithStatisticType[]} instructions - The list of instructions to process.
 * @returns {InstructionWithStatisticType[]} - The list of instructions with hazards fixed and NOPs reordered.
 */
export function fixHazardsApplyingDelayedBranch(instructions: InstructionWithStatisticType[]) {
	const fixedInstructions = fixBranchHazards(instructions);

	const reOrderedInstructions = reOrderInstructions(fixedInstructions);

	return reOrderedInstructions;
}

export function fixDataAndBranchHazards(instructions: InstructionWithStatisticType[]) {
	const fixedInstructions = fixHazardsAndReOrderNop(instructions);
	const fixDelayedBranchInstructions = fixHazardsApplyingDelayedBranch(fixedInstructions);

	return fixDelayedBranchInstructions;
}
