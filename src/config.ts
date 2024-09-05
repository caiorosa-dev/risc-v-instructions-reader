import { Configuration } from './types';

export const Config: Configuration = {
  instructionsTypes: {
    ALU: ['0010011', '0110011', '0011011', '0111011'],
    JUMP: ['1101111', '1100111'],
    BRANCH: ['1100011'],
    MEMORY: ['0000011', '0100011'],
    OTHER: [],
  },
};
