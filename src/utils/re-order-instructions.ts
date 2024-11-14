import { InstructionWithStatisticType } from '../types';
import { isNOP, getWrittenRegisters, getReadRegisters } from './helpers';

/**
 * Reorders NOPs in the given set of instructions.
 * @author Caio Rosa
 * @param {InstructionWithStatisticType[]} instructions - The list of instructions to process.
 * @returns {InstructionWithStatisticType[]} - The list of instructions with NOPs reordered.
 */
export function reOrderInstructions(instructions: InstructionWithStatisticType[]) {
	const reorderedInstructions = [...instructions];

	for (let i = 0; i < reorderedInstructions.length; i++) {
		const instr = reorderedInstructions[i];

		if (isNOP(instr)) {
			// Encontrou uma NOP no index, variável para controlar se a instrução foi movida
			let moved = false;

			// Procurar substituição para a NOP 2 instruções antes dela
			for (let j = i - 3; j >= 0; j--) {
				const candidateInstr = reorderedInstructions[j];

				// Skip other NOPs
				if (isNOP(candidateInstr)) {
					continue;
				}

				// Cancelar, já que encontrou uma instrução que já foi movida
				if (candidateInstr.moved) {
					console.log('Found a moved instruction at', j, 'that would alter the execution flow');
					break;
				}

				// Cancelar, já que encontrou uma instrução de desvio (poderia alterar o fluxo de execução)
				if (candidateInstr.statisticType === 'BRANCH' || candidateInstr.statisticType === 'JUMP') {
					console.log('Found a branch instruction at', j, 'that would alter the execution flow');
					break;
				}

				// Move a instrução para o lugar da NOP
				if (canMoveInstruction(candidateInstr, j, i, reorderedInstructions)) {
					console.log('--------------------------------');
					console.log('Moving instruction', candidateInstr, 'from', j, 'to', i);
					console.log('--------------------------------');
					reorderedInstructions.splice(j, 1); // Remover a instrução substituta
					reorderedInstructions.splice(i - 1, 1); // Remover a NOP
					reorderedInstructions.splice(i - 1, 0, candidateInstr); // Inserir a instrução substituta no lugar da NOP

					candidateInstr.moved = true;
					moved = true;
					// Voltar a verificação, já que a quantidade de instruções alterou
					i -= 2;

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

/**
 * Checks if an instruction can be moved to replace a NOP.
 * @author Caio Rosa & Joshua Jackson
 * @param {InstructionWithStatisticType} candidateInstr - The instruction to check.
 * @param {number} candidateIndex - The index of the instruction to check.
 * @param {number} nopIndex - The index of the NOP to replace.
 * @param {InstructionWithStatisticType[]} instructions - The list of instructions.
 * @returns {boolean} - True if the instruction can be moved, false otherwise.
 */
function canMoveInstruction(
	candidateInstr: InstructionWithStatisticType,
	candidateIndex: number,
	nopIndex: number,
	instructions: InstructionWithStatisticType[]
): boolean {
	const candidateWrites = getWrittenRegisters(candidateInstr);

	// For pra verificar se o RD da instrução está sendo usado como RS1 ou RS2 nas instruções intermediárias
	for (let k = candidateIndex + 1; k < nopIndex; k++) {
		const intermediateInstr = instructions[k];
		const intermediateReads = getReadRegisters(intermediateInstr);

		for (const reg of candidateWrites) {
			if (intermediateReads.includes(reg)) {
				return false;
			}
		}
	}

	return true;
}