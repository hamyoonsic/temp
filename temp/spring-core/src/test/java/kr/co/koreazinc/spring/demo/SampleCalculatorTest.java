package kr.co.koreazinc.spring.demo;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

@DisplayName("계산기 샘플 테스트")
class SampleCalculatorTest {

    static class Calculator {
        public int add(int a, int b) {
            return a + b;
        }

        public int subtract(int a, int b) {
            return a - b;
        }

        public int multiply(int a, int b) {
            return a * b;
        }

        public int divide(int a, int b) {
            if (b == 0) {
                throw new IllegalArgumentException("0으로 나눌 수 없습니다");
            }
            return a / b;
        }
    }

    Calculator calc = new Calculator();

    @Test
    @DisplayName("더하기 테스트")
    void testAdd() {
        assertEquals(5, calc.add(2, 3));
        assertEquals(0, calc.add(-2, 2));
        assertEquals(10, calc.add(5, 5));
    }

    @Test
    @DisplayName("빼기 테스트")
    void testSubtract() {
        assertEquals(1, calc.subtract(3, 2));
        assertEquals(-5, calc.subtract(0, 5));
    }

    @Test
    @DisplayName("곱하기 테스트")
    void testMultiply() {
        assertEquals(6, calc.multiply(2, 3));
        assertEquals(0, calc.multiply(0, 5));
    }

    @Test
    @DisplayName("나누기 - 정상 케이스")
    void testDivideNormal() {
        assertEquals(2, calc.divide(4, 2));
        assertEquals(3, calc.divide(9, 3));
    }

    @Test
    @DisplayName("나누기 - 0으로 나눌 때 예외 발생")
    void testDivideByZero() {
        assertThrows(IllegalArgumentException.class, () -> calc.divide(5, 0));
    }
}
