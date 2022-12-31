const { daysBetweenDates } = require('../utils/daysBetweenDates')

describe('daysBetweenDates', () => {
    it('should return days between two dates', () => {
        const result = daysBetweenDates('2020.05.06', '2020.05.09')
        expect(result).toBe(4)
    })
})