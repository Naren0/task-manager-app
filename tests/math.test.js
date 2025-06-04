const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require ('../src/math')

test('should calculate total with tip', () => {
    const total = calculateTip(10, 0.2)
    expect(total).toBe(12)
})

test ('Should calculate total with default tip', () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('Async test demo', (done) => {
    setTimeout(()=>{
        expect(1).toBe(1) 
        done()
    }, 1000)
    
})

test('Should add two numbers', (done) => {
    add(1,2).then( (sum) => {
        expect (sum).toBe(3)
        done()
    })
})

test ('Should add two numbers with async/await', async () => {
    const sum = await add(2,3);
    expect(sum).toBe(5)
})