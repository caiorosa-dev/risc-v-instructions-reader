export type Register = number;
export type Immediate = number;
export type Funct3 = number;
type Funct7 = number;

export type InstructionType = 'R' | 'I' | 'S' | 'B' | 'U' | 'J';

interface RTypeInstruction {
  type: 'R';
  rd: Register;
  rs1: Register;
  rs2: Register;
  funct3: Funct3;
  funct7: Funct7;
}

interface ITypeInstruction {
  type: 'I';
  rd: Register;
  rs1: Register;
  imm: Immediate; // Imediato de 12 bits
  funct3: Funct3;
}

interface STypeInstruction {
  type: 'S';
  rs1: Register;
  rs2: Register;
  imm: Immediate; // Imediato dividido em duas partes (imm[11:5] e imm[4:0])
  funct3: Funct3;
}

interface BTypeInstruction {
  type: 'B';
  rs1: Register;
  rs2: Register;
  imm: Immediate; // Imediato para desvio
  funct3: Funct3;
}

interface UTypeInstruction {
  type: 'U';
  rd: Register;
  imm: Immediate; // Imediato de 20 bits
}

interface JTypeInstruction {
  type: 'J';
  rd: Register;
  imm: Immediate; // Imediato para salto
}

export type Instruction = (
  | RTypeInstruction
  | ITypeInstruction
  | STypeInstruction
  | BTypeInstruction
  | UTypeInstruction
  | JTypeInstruction
) & {
  binary: string;
  opcode: string;
  name?: string;
  isNop?: boolean;
  moved?: boolean;
};
