# Generate Tests

Your goal is to generate comprehensive tests following BedRkBase testing standards.

Requirements:
* Use Jest for backend and utility tests
* Use React Testing Library for component tests
* Include error cases and edge conditions
* Mock external services appropriately
* Test async operations properly
* Include proper type checking in tests
* Add meaningful test descriptions
* Follow AAA (Arrange-Act-Assert) pattern
* Include performance considerations
* Test error boundaries for components

Testing Patterns:
* Group related tests in describe blocks
* Use beforeEach for common setup
* Mock API calls using MSW
* Test loading and error states
* Verify accessibility for components
* Include integration tests where appropriate

Reference files:
* Test utils: [../../test/testUtils.ts](../../test/testUtils.ts)
* MSW handlers: [../../test/msw/handlers.ts](../../test/msw/handlers.ts)

Ask for:
1. Code being tested (component/function/API)
2. Expected behaviors to test
3. Required mocks
4. Edge cases to consider
5. Performance requirements