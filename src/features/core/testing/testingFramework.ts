// Enterprise Testing Framework - Unit, Integration, E2E

interface TestCase {
  name: string;
  fn: () => Promise<void> | void;
  timeout?: number;
  skip?: boolean;
  only?: boolean;
}

interface TestSuite {
  name: string;
  tests: TestCase[];
  beforeAll?: () => Promise<void> | void;
  afterAll?: () => Promise<void> | void;
  beforeEach?: () => Promise<void> | void;
  afterEach?: () => Promise<void> | void;
}

interface AssertionHelpers {
  toBe(expected: any): void;
  toEqual(expected: any): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toContain(item: any): void;
  toThrow(expected?: string | RegExp): void;
  toBeGreaterThan(expected: number): void;
  toBeLessThan(expected: number): void;
  toBeInstanceOf(expected: any): void;
}

class TestRunner {
  private static instance: TestRunner;
  private suites: TestSuite[] = [];
  private results: Array<{
    suite: string;
    test: string;
    status: "pass" | "fail";
    duration: number;
    error?: string;
  }> = [];

  static getInstance(): TestRunner {
    if (!TestRunner.instance) {
      TestRunner.instance = new TestRunner();
    }
    return TestRunner.instance;
  }

  suite(name: string, fn: () => void) {
    const suite: TestSuite = { name, tests: [] };
    this.suites.push(suite);

    // Execute
    fn();
  }

  async run() {
    this.results = [];

    for (const suite of this.suites) {
      if (suite.beforeAll) await suite.beforeAll();

      for (const test of suite.tests) {
        if (test.skip) continue;

        const startTime = Date.now();
        try {
          if (test.timeout) {
            await this.withTimeout(test.fn, test.timeout);
          } else {
            await test.fn();
          }

          this.results.push({
            suite: suite.name,
            test: test.name,
            status: "pass",
            duration: Date.now() - startTime,
          });
        } catch (error) {
          this.results.push({
            suite: suite.name,
            test: test.name,
            status: "fail",
            duration: Date.now() - startTime,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      if (suite.afterAll) await suite.afterAll();
    }

    return this.results;
  }

  getResults() {
    return this.results;
  }

  getStats() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === "pass").length;
    const failed = this.results.filter((r) => r.status === "fail").length;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total) * 100 : 0,
    };
  }

  private async withTimeout(fn: () => Promise<void> | void, timeout: number): Promise<void> {
    return Promise.race([
      Promise.resolve(fn()),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error(`Test timed out after ${timeout}ms`)), timeout)
      ),
    ]);
  }
}

export const testRunner = TestRunner.getInstance();

// Test DSL
export const describe = (name: string, fn: () => void) => testRunner.suite(name, fn);
export const it = (name: string, fn: () => Promise<void> | void, options?: Partial<TestCase>) => {
  const suite = testRunner["suites"][testRunner["suites"].length - 1];
  if (suite) {
    suite.tests.push({
      name,
      fn,
      timeout: options?.timeout || 5000,
      skip: options?.skip || false,
      only: options?.only || false,
    });
  }
};
export const test = it;
export const skip = (name: string, fn: () => Promise<void> | void) => it(name, fn, { skip: true });
export const only = (name: string, fn: () => Promise<void> | void) => it(name, fn, { only: true });

// Assertions
export const expect = (actual: any): AssertionHelpers => ({
  toBe: (expected: any) => {
    if (actual !== expected) {
      throw new Error(`Expected ${actual} to be ${expected}`);
    }
  },
  toEqual: (expected: any) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
    }
  },
  toBeTruthy: () => {
    if (!actual) {
      throw new Error(`Expected ${actual} to be truthy`);
    }
  },
  toBeFalsy: () => {
    if (actual) {
      throw new Error(`Expected ${actual} to be falsy`);
    }
  },
  toContain: (item: any) => {
    if (!actual.includes(item)) {
      throw new Error(`Expected ${JSON.stringify(actual)} to contain ${item}`);
    }
  },
  toThrow: (expected?: string | RegExp) => {
    try {
      actual();
      throw new Error("Expected function to throw");
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      if (expected instanceof RegExp) {
        if (!expected.test(errorObj.message)) {
          throw new Error(`Expected error to match ${expected}`);
        }
      } else if (expected && errorObj.message !== expected) {
        throw new Error(`Expected error "${errorObj.message}" to equal "${expected}"`);
      }
    }
  },
  toBeGreaterThan: (expected: number) => {
    if (actual <= expected) {
      throw new Error(`Expected ${actual} to be greater than ${expected}`);
    }
  },
  toBeLessThan: (expected: number) => {
    if (actual >= expected) {
      throw new Error(`Expected ${actual} to be less than ${expected}`);
    }
  },
  toBeInstanceOf: (expected: any) => {
    if (!(actual instanceof expected)) {
      throw new Error(`Expected ${actual} to be instance of ${expected.name}`);
    }
  },
});

// Mock utilities
export function mock<T extends (...args: any[]) => any>(fn: T): MockFunction<T> {
  const mockFn = ((...args: any[]) => {
    return fn(...args);
  }) as MockFunction<T>;

  mockFn.mockImplementation = (impl: T) => {
    return mock(impl);
  };

  mockFn.mockReturnValue = (value: any) => {
    return mock((() => value) as T);
  };

  mockFn.mockRejectedValue = (error: any) => {
    return mock((() => Promise.reject(error)) as T);
  };

  mockFn.mockResolvedValue = (value: any) => {
    return mock((() => Promise.resolve(value)) as T);
  };

  mockFn.mockClear = () => {
    // Reset calls
  };

  mockFn.mockCalls = [];
  mockFn.mockResults = [];

  return mockFn;
}

type MockFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T>;
  mockImplementation: (fn: T) => MockFunction<T>;
  mockReturnValue: (value: any) => MockFunction<T>;
  mockRejectedValue: (error: any) => MockFunction<T>;
  mockResolvedValue: (value: any) => MockFunction<T>;
  mockClear: () => void;
  mockCalls: any[];
  mockResults: any[];
};

// Test utilities
export async function runTests() {
  const runner = testRunner;
  const results = await runner.run();
  const stats = runner.getStats();

  console.log("\n=== Test Results ===");
  console.log(`Total: ${stats.total}`);
  console.log(`Passed: ${stats.passed}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Pass Rate: ${stats.passRate.toFixed(2)}%`);

  if (stats.failed > 0) {
    console.log("\n=== Failed Tests ===");
    results
      .filter((r) => r.status === "fail")
      .forEach((r) => {
        console.log(`  ${r.suite} > ${r.test}`);
        console.log(`    Error: ${r.error}`);
      });
  }

  return { results, stats };
}
