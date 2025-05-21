export type Operation = 'add' | 'sub' | 'mul' | 'div' | 'all';

export interface CalculationRequest {
  n1: number;
  n2: number;
  op: Operation;
}

export interface CalculationResult extends CalculationRequest {
  result: number;
}
