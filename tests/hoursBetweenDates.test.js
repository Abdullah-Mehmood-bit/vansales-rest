const { hoursBetweenDates } = require('../utils/hoursBetweenDates')

describe('hoursBetweenDates', () => {
    it('should return hours between two dates', () => {
        const result = hoursBetweenDates('2020-03-30 18:58:18', '2020-03-30 21:10:18')
        expect(result).toBe(2)
    })
})