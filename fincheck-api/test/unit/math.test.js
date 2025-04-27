import { describe, it, expect } from 'vitest'

// Suponha que temos uma função para somar dois números
function sum(a, b) {
  return a + b
}

// Testes começam aqui
describe('Função sum', () => {
  
  it('deve somar dois números corretamente', () => {
    const result = sum(2, 3)
    expect(result).toBe(5) // esperamos que 2 + 3 = 5
  })

  it('deve retornar valor negativo se a soma for negativa', () => {
    const result = sum(-2, -3)
    expect(result).toBe(-5)
  })

})
