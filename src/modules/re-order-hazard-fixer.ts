import { InstructionWithStatisticType } from '../types';
import { Register } from '../types/instruction';
import { isNOP } from '../utils/helpers';
import { detectAndFixHazards } from './hazart-fixer';

export function fixHazardsAndReOrderNop(
	instructions: InstructionWithStatisticType[]
) {
	const fixedInstructions = detectAndFixHazards(instructions, true);

	const reOrderedInstructions = reOrderInstructions(fixedInstructions);

	return reOrderedInstructions;
}

function reOrderInstructions(instructions: InstructionWithStatisticType[]) {
	const reorderedInstructions = [...instructions];

	for (let i = 0; i < reorderedInstructions.length; i++) {
		const instr = reorderedInstructions[i];

		if (isNOP(instr)) {
			// Found a NOP at index i
			let moved = false;

			// Try to find a suitable instruction before the NOP to move into its place
			for (let j = i - 1; j >= 0; j--) {
				const candidateInstr = reorderedInstructions[j];

				// Skip other NOPs
				if (isNOP(candidateInstr)) {
					continue;
				}

				// Move the instruction to the NOP's position
				if (canMoveInstruction(candidateInstr, j, i, reorderedInstructions)) {
					reorderedInstructions.splice(j, 1); // Remove from original position
					reorderedInstructions.splice(i - 1, 1); // Remove the NOP
					reorderedInstructions.splice(i - 1, 0, candidateInstr); // Insert at NOP's position
					moved = true;
					break;
				}
			}

			if (!moved) {
				continue;
			}
		}
	}

	return reorderedInstructions;
}

function canMoveInstruction(
	candidateInstr: InstructionWithStatisticType,
	candidateIndex: number,
	nopIndex: number,
	instructions: InstructionWithStatisticType[]
): boolean {
	if (candidateInstr.statisticType === 'BRANCH' || candidateInstr.statisticType === 'JUMP') {
		return false;
	}

	// Check for hazards when moving the instruction to the NOP position
	for (let k = candidateIndex + 1; k < nopIndex; k++) {
		const intermediateInstr = instructions[k];

		if (
			introducesHazard(candidateInstr, intermediateInstr) ||
			introducesHazard(intermediateInstr, candidateInstr)
		) {
			return false;
		}
	}

	// Ensure removing the instruction doesn't introduce hazards after its original position
	for (let k = candidateIndex + 1; k < instructions.length; k++) {
		const followingInstr = instructions[k];
		if (introducesHazard(candidateInstr, followingInstr)) {
			return false;
		}
	}

	return true;
}

function introducesHazard(
	instr1: InstructionWithStatisticType,
	instr2: InstructionWithStatisticType
): boolean {
	const instr1Writes = getWrittenRegisters(instr1);
	const instr1Reads = getReadRegisters(instr1);

	const instr2Writes = getWrittenRegisters(instr2);
	const instr2Reads = getReadRegisters(instr2);

	for (const reg of instr1Writes) {
		if (instr2Reads.includes(reg)) {
			return true;
		}
	}

	for (const reg of instr1Writes) {
		if (instr2Writes.includes(reg)) {
			return true;
		}
	}

	for (const reg of instr1Reads) {
		if (instr2Writes.includes(reg)) {
			return true;
		}
	}

	return false;
}

function getWrittenRegisters(
	instr: InstructionWithStatisticType
): Register[] {
	if ('rd' in instr && instr.rd !== 0) {
		return [instr.rd];
	}
	return [];
}

function getReadRegisters(instr: InstructionWithStatisticType): Register[] {
	const regs: Register[] = [];
	if ('rs1' in instr && instr.rs1 !== 0) {
		regs.push(instr.rs1);
	}
	if ('rs2' in instr && instr.rs2 !== 0) {
		regs.push(instr.rs2);
	}
	return regs;
}
