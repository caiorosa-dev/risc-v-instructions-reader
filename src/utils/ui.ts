import { Table } from 'console-table-printer';
import colors from 'colors';
import { InstructionWithStatisticType, InstructionStatisticType } from '../types';

export function printTableOfInstructions(instructions: InstructionWithStatisticType[]) {
	// Calcular a tabela de estatísticas
	const statisticTable = instructions.reduce((acc, instruction) => {
		acc['TOTAL'] = (acc['TOTAL'] || 0) + 1;
		acc[instruction.statisticType] = (acc[instruction.statisticType] || 0) + 1;
		return acc;
	}, {} as Record<InstructionStatisticType | 'TOTAL', number>);

	// Exibir a tabela de estatísticas
	console.log(colors.blue.bold('Tabela de Estatísticas:'));
	const statTable = new Table({
		columns: [
			{ name: 'Tipo', alignment: 'left', color: 'green', maxLen: 6 },
			{ name: 'Quantidade', color: 'yellow', maxLen: 2 }
		]
	});
	for (const [key, value] of Object.entries(statisticTable)) {
		statTable.addRow({ Tipo: key, Quantidade: value });
	}
	statTable.printTable();

	// Exibir a tabela de instruções
	console.log(colors.blue.bold('Instruções:'));
	const instructionsTable = new Table({
		columns: [
			{ name: '#', color: 'blue', maxLen: 2 },
			{ name: 'Opcode', color: 'cyan', maxLen: 7 },
			{ name: 'Nome', color: 'magenta', maxLen: 4 },
			{ name: 'Tipo', color: 'green', maxLen: 1 },
			{ name: 'RD', color: 'yellow', maxLen: 3 },
			{ name: 'Funct3', color: 'yellow', maxLen: 3 },
			{ name: 'RS1', color: 'yellow', maxLen: 3 },
			{ name: 'RS2', color: 'yellow', maxLen: 3 },
			{ name: 'Imm', color: 'yellow', maxLen: 3 },
			{ name: 'Movido', color: 'red', maxLen: 3 }
		],
		rowSeparator: true, // Adiciona uma linha separadora entre as linhas
	});
	instructions.forEach((instruction: any, index: number) => {
		instructionsTable.addRow({
			'#': index,
			Opcode: instruction.opcode,
			Nome: instruction.isNop ? colors.dim('NOP') : instruction.name || '',
			Tipo: instruction.type,
			RD: instruction.rd ?? '',
			Funct3: instruction.funct3 ?? '',
			RS1: instruction.rs1 ?? '',
			RS2: instruction.rs2 ?? '',
			Imm: instruction.imm ?? '',
			Movido: instruction.moved ? colors.green('Sim') : colors.gray('Não')
		});
	});
	instructionsTable.printTable();
}