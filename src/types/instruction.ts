export type InstructionStatisticType = 'ALU' | 'JUMP' | 'BRANCH' | 'MEMORY' | 'OTHER';

export type Configuration = {
  instructionsTypes: Record<InstructionStatisticType, string[]>;
};

type Register = number;
type Immediate = number;
type Funct3 = number;
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
  imm: Immediate;
  funct3: Funct3;
}

interface STypeInstruction {
  type: 'S';
  rs1: Register;
  rs2: Register;
  imm: Immediate;
  funct3: Funct3;
}

interface BTypeInstruction {
  type: 'B';
  rs1: Register;
  rs2: Register;
  imm: Immediate;
  funct3: Funct3;
}

interface UTypeInstruction {
  type: 'U';
  rd: Register;
  imm: Immediate;
}

interface JTypeInstruction {
  type: 'J';
  rd: Register;
  imm: Immediate;
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
  isNop?: boolean;
};

export type InstructionWithStatisticType = Instruction & {
  statisticType: InstructionStatisticType;
};
