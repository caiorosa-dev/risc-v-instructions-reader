import { InstructionWithStatisticType } from '../types';

export const NOP_INSTRUCTION: InstructionWithStatisticType = {
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