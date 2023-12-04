import { authentication, random } from '../src/helpers'
import { randomBytes, createHmac } from 'crypto'

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('mockedRandomBytesResult')),
  createHmac: jest.fn(() => ({
    update: jest.fn(() => ({
      digest: jest.fn(() => Buffer.from('mockedDigestResult')),
    })),
  })),
}))

describe('test helpers functions', () => {
  describe('random function', () => {
    it('generates a base64-encoded string', () => {
      // Mock the randomBytes implementation
      ;(randomBytes as jest.Mock).mockReturnValue(
        Buffer.from('mockedRandomBytesResult')
      )

      const result = random()

      // Ensure randomBytes was called with the correct parameters
      expect(randomBytes).toHaveBeenCalledWith(128)

      // Ensure the result is a base64-encoded string
      expect(result).toEqual('bW9ja2VkUmFuZG9tQnl0ZXNSZXN1bHQ=')

      // Clean up the mock
      ;(randomBytes as jest.Mock).mockRestore()
    })
  })

  describe('authentication function', () => {
    it('generates a HMAC digest', () => {
      // Mock the createHmac implementation
      const mockedDigestResult = authentication('mockedSalt', 'mockedPassword')

      // Ensure createHmac was called with the correct parameters
      expect(createHmac).toHaveBeenCalledWith(
        'sha256',
        'mockedSalt/mockedPassword'
      )

      // Ensure the result is a Buffer
      expect(Buffer.isBuffer(mockedDigestResult)).toBe(true)

      // Clean up the mock
      ;(createHmac as jest.Mock).mockRestore()
    })
  })
})
