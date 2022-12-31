const getDate = require('../utils/getDate')

describe('getDate', () => {
    it("should return a valid date", () => {
        const result = getDate('2020.10.15')
        expect(result).toEqual('2020-10-15')
    })
})