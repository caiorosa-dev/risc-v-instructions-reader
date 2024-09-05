import { Instruction } from './instruction';

export type InstructionStatisticType =
  | 'ALU'
  | 'JUMP'
  | 'BRANCH'
  | 'MEMORY'
  | 'OTHER';

export type InstructionWithStatisticType = Instruction & {
  statisticType: InstructionStatisticType;
};

export type Configuration = {
  instructionsTypes: Record<InstructionStatisticType, string[]>;
};
