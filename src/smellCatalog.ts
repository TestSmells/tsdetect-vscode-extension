/** Short, user-facing explanations of the smell types supported by tsDetect. */
const SMELL_DEFINITIONS: Readonly<Record<string, string>> = {
  'Assertion Roulette':
    'A test contains multiple assertions without descriptive messages, making it difficult to tell which assertion caused a failure.',
  'Conditional Test Logic':
    'A test contains control flow such as an if statement, switch, loop, or conditional expression, so different statements may run under different conditions.',
  'Constructor Initialization':
    'A test class initializes test state in a constructor instead of using the testing framework\'s setup methods.',
  'Default Test':
    'A generated example test class, such as ExampleUnitTest or ExampleInstrumentedTest, remains in the project instead of being removed or renamed.',
  'Dependent Test':
    'A test depends on another test running successfully or in a particular order, so it may not work correctly when executed independently.',
  'Duplicate Assert':
    'A test repeats an assertion with the same parameters, adding duplication without checking a different behavior.',
  'Eager Test':
    'A single test exercises several methods of the production object, which can make the test harder to understand and maintain.',
  'Empty Test':
    'A test contains no executable statements, so the testing framework may report it as passing even though it verifies nothing.',
  'Exception Catching Throwing':
    'A test explicitly catches or throws exceptions instead of using the testing framework\'s exception-testing features.',
  'General Fixture':
    'The shared test setup creates fields that are not used by every test, making the fixture broader and more expensive than necessary.',
  'Ignored Test':
    'A test method or class is disabled with an ignore annotation and therefore does not run with the rest of the test suite.',
  'Lazy Test':
    'Several test methods exercise the same production method, which may indicate duplicated or unnecessarily fragmented tests.',
  'Magic Number Test':
    'An assertion uses a numeric literal whose purpose is not explained by a descriptive constant or variable name.',
  'Mystery Guest':
    'A test depends on an external resource such as a file or database, making the dependency less visible and potentially less reliable.',
  'Redundant Assertion':
    'A test contains an assertion whose expected and actual values are the same, so the assertion does not meaningfully verify behavior.',
  'Redundant Print':
    'A test writes output using print or similar methods even though automated tests should communicate results through assertions.',
  'Resource Optimism':
    'A test assumes that an external resource exists without first checking its availability, which can cause unclear failures.',
  'Sensitive Equality':
    'A test compares an object through its toString output, so unrelated formatting changes can cause the test to fail.',
  'Sleepy Test':
    'A test calls Thread.sleep, making its behavior and execution time dependent on timing and the machine running it.',
  'Unknown Test':
    'A test contains no assertion or expected-exception declaration, making the behavior it verifies unclear.',
  'Verbose Test':
    'A test is long or complex enough that its purpose and expected behavior are difficult to understand quickly.',
};

/** Return the known definition or a safe fallback for an unfamiliar result. */
export function getSmellDefinition(smellName: string): string {
  return (
    SMELL_DEFINITIONS[smellName] ??
    'No definition is currently available for this test smell.'
  );
}
