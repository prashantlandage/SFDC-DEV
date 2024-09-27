@isTest
public class CalculatorTest {
    @isTest
    static void testAddition() {
        Integer result = Calculator.add(10, 5);
        System.assertEquals(15, result, 'Addition failed.');
    }
    
    @isTest
    static void testSubtraction() {
        Integer result = Calculator.subtract(10, 5);
        System.assertEquals(5, result, 'Subtraction failed.');
    }
    
    @isTest
    static void testMultiplication() {
        Integer result = Calculator.multiply(10, 5);
        System.assertEquals(50, result, 'Multiplication failed.');
    }
    
    @isTest
    static void testMultiplicationByZero() {
        try {
            Calculator.multiply(10, 0);
            System.assert(false, 'Expected exception not thrown.');
        } catch (Calculator.CalculatorException e) {
            System.assertEquals('It doesn\'t make sense to multiply by zero', e.getMessage());
        }
    }
    
    @isTest
    static void testDivision() {
        Decimal result = Calculator.divide(10, 2);
        System.assertEquals(5, result, 'Division failed.');
    }
    
    @isTest
    static void testDivisionByZero() {
        try {
            Calculator.divide(10, 0);
            System.assert(false, 'Expected exception not thrown.');
        } catch (Calculator.CalculatorException e) {
            System.assertEquals('You still can\'t divide by zero', e.getMessage());
        }
    }
    
    @isTest
    static void testNegativeDivision() {
        try {
            Calculator.divide(-10, 2);
            System.assert(false, 'Expected exception not thrown.');
        } catch (Calculator.CalculatorException e) {
            System.assert(e.getMessage().contains('Division returned a negative value.'));
        }
    }
}