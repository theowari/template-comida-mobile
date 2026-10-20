import { onlyDigits } from './masks';

export interface CepResult {
  street: string;
  district: string;
  city: string;
  state: string;
}

export class CepNotFoundError extends Error {}

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

/** Looks up a CEP on ViaCEP. Throws CepNotFoundError or a network error. */
export async function lookupCep(cep: string, signal?: AbortSignal): Promise<CepResult> {
  const digits = onlyDigits(cep);
  const timeout = AbortSignal.timeout(6000);
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) throw new CepNotFoundError(`CEP ${digits} não encontrado`);
  const data = (await response.json()) as ViaCepResponse;
  if (data.erro) throw new CepNotFoundError(`CEP ${digits} não encontrado`);
  return {
    street: data.logradouro ?? '',
    district: data.bairro ?? '',
    city: data.localidade ?? '',
    state: data.uf ?? '',
  };
}

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
