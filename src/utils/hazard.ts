import { InstructionWithStatisticType } from '../types';

export function isInstructionWithRD(instruction: InstructionWithStatisticType) {
	return instruction.type === 'R' || instruction.type === 'I';
}

export function isNOP(instruction: InstructionWithStatisticType) {
	return (
		instruction.type === 'I' &&
		instruction.rd === 0 &&
		instruction.rs1 === 0 &&
		instruction.imm === 0 &&
		instruction.funct3 === 0
	);
}

export function getDistanceBetweenUseAndDef(
	instructions: InstructionWithStatisticType[],
	index: number,
	whitelistOpcodes?: string[]
):
	| { distance: number; conflictRegister: string }
	| { distance: -1; conflictRegister: undefined } {
	let distance = 0;
	const selectedInstruction = instructions[index];

	if (
		!isInstructionWithRD(selectedInstruction) ||
		isNOP(selectedInstruction) ||
		index === instructions.length - 1
	) {
		return { distance: -1, conflictRegister: undefined };
	}

	if (whitelistOpcodes && !whitelistOpcodes.includes(selectedInstruction.opcode)) {
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