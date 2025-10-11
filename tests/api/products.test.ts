import request from 'supertest'

// We will spin up Next server in CI via Playwright, so here unit-test a helper once added
describe('placeholder', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
