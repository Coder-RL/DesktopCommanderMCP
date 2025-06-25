Build/Test Output:
```bash
$ npm test

> @wonderwhy-er/desktop-commander@0.1.39 test
> node test/run-all-tests.js

[36m===== Starting test runner =====
[0m

[36m===== Building project =====[0m

[34mRunning command: npm run build[0m

> @wonderwhy-er/desktop-commander@0.1.39 build
> tsc && shx cp setup-claude-server.js dist/ && shx chmod +x dist/*.js

TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/version.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/version.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/capture.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/capture.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config-manager.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config-manager.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/command-manager.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/command-manager.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/custom-stdio.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/custom-stdio.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/types.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/types.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/error-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/error-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/schemas.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/schemas.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/config.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/config.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/withTimeout.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/withTimeout.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/mime-types.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/mime-types.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/filesystem.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/filesystem.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/filesystem-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/filesystem-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/terminal-manager.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/terminal-manager.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/execute.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/execute.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/terminal-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/terminal-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/process.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/process.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/process-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/process-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/search.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/search.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/fuzzySearch.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/fuzzySearch.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/lineEndingHandler.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/lineEndingHandler.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/edit.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/edit.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/edit-search-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/edit-search-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/task-manager-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/task-manager-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/sequential-thinking-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/sequential-thinking-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/index.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/index.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/server.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/server.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/index.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/index.d.ts
Files:                         236
Lines of Library:            39719
Lines of Definitions:        80265
Lines of TypeScript:          4860
Lines of JavaScript:             0
Lines of JSON:                   0
Lines of Other:                  0
Identifiers:                141594
Symbols:                    135724
Types:                       32929
Instantiations:             160801
Memory used:               185484K
Assignability cache size:     7800
Identity cache size:           634
Subtype cache size:            232
Strict subtype cache size:      85
I/O Read time:               0.03s
Parse time:                  0.16s
ResolveModule time:          0.03s
ResolveLibrary time:         0.00s
ResolveTypeReference time:   0.00s
Program time:                0.25s
Bind time:                   0.07s
Check time:                  0.31s
transformTime time:          0.02s
commentTime time:            0.00s
I/O Write time:              0.01s
printTime time:              0.07s
Emit time:                   0.07s
Total time:                  0.70s

[36m===== Running tests =====[0m


[36mRunning test module: ./test.js[0m
Loading schemas.ts
Edit block result: {
  content: [
    {
      type: 'text',
      text: 'Successfully applied 1 edit to /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test.txt'
    }
  ]
}
File content after replacement: This is new content to replace
Replace test passed!
All tests passed! 🎉
✓ Teardown: test directories cleaned up and config restored
[32m✓ Test passed: ./test.js[0m

[36mRunning test module: ./test-directory-creation.js[0m
Cleaning up test directories...
Cleanup complete.
✓ Setup: created base test directory: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_directories
✓ Setup: set allowed directories to include: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_directories
=== Directory Creation Tests ===


Test 1: Create directory with existing parent

Test 2: Create directory with non-existent parent

Test 3: Create nested directory structure

Verifying directory creation:
✓ Verified: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_directories/simple_dir exists and is a directory
✓ Verified: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_directories/nonexistent/test_dir exists and is a directory
✓ Verified: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_directories/nested/path/structure exists and is a directory

✅ All tests passed!
Cleaning up test directories...
Cleanup complete.
✓ Teardown: test directories cleaned up
[32m✓ Test passed: ./test-directory-creation.js[0m

[36mRunning test module: ./test-allowed-directories.js[0m
Cleaning up test directories...
Cleanup complete.
✓ Setup: created test directories
  - Test dir: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
  - Outside dir: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
=== allowedDirectories Configuration Tests ===


Test 1: Empty allowedDirectories array
DEBUG Test1 - Config: []
DEBUG isPathAccessible - Checking access to: /Users/robertlee
DEBUG isPathAccessible - Validation successful: /Users/robertlee
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG isPathAccessible - Validation successful: /private/var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG isPathAccessible - Checking access to: /
DEBUG isPathAccessible - Validation successful: /
✓ Empty allowedDirectories array allows access to all directories as expected

Test 2: Specific directory in allowedDirectories
DEBUG Test2 - Config: ["/Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs"]
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/test-file.txt
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/test-file.txt
DEBUG isPathAccessible - Checking access to: /Users/robertlee
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /Users/robertlee. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: ~
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: ~. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: /
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
✓ Specific allowedDirectories setting correctly restricts access

Test 3: Root directory in allowedDirectories
DEBUG: Using TEST_ROOT_PATH: /
DEBUG Test3 - Config: ["/"]
DEBUG Test3 - Testing ROOT_PATH access: /
DEBUG isPathAccessible - Checking access to: /
DEBUG isPathAccessible - Validation successful: /
DEBUG Test3 - ROOT_PATH access result: true
DEBUG isPathAccessible - Checking access to: ~
DEBUG isPathAccessible - Validation successful: /Users/robertlee
DEBUG Test3 - Testing HOME_DIR access: /Users/robertlee
DEBUG isPathAccessible - Checking access to: /Users/robertlee
DEBUG isPathAccessible - Validation successful: /Users/robertlee
DEBUG Test3 - HOME_DIR access result: true
DEBUG Test3 - Testing TEST_DIR access: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG Test3 - TEST_DIR access result: true
DEBUG Test3 - Testing OUTSIDE_DIR access: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG isPathAccessible - Checking access to: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG isPathAccessible - Validation successful: /private/var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG Test3 - OUTSIDE_DIR access result: true
✓ Root in allowedDirectories test passed with platform-specific behavior

Test 4: Home directory in allowedDirectories
DEBUG Test4 - Config: ["/Users/robertlee"]
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/test-file.txt
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/test-file.txt
DEBUG isPathAccessible - Checking access to: /Users/robertlee
DEBUG isPathAccessible - Validation successful: /Users/robertlee
DEBUG isPathAccessible - Checking access to: ~
DEBUG isPathAccessible - Validation successful: /Users/robertlee
DEBUG isPathAccessible - Checking access to: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed. Must be within one of these directories: /Users/robertlee
DEBUG isPathAccessible - Checking access to: /
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /. Must be within one of these directories: /Users/robertlee
✓ Home directory allowedDirectories setting correctly restricts access

Test 5: Specific directory with slash at the end in allowedDirectories
DEBUG Test5 - Config: ["/Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/"]
TEST_DIR_WITH_SLASH /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/test-file.txt
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/test-file.txt
DEBUG isPathAccessible - Checking access to: /Users/robertlee
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /Users/robertlee. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/
DEBUG isPathAccessible - Checking access to: ~
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: ~. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/
DEBUG isPathAccessible - Checking access to: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /var/folders/80/ghlc1ydd0zq5zv277btpc4l40000gn/T/test_outside_allowed. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/
DEBUG isPathAccessible - Checking access to: /
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_allowed_dirs/
✓ Specific allowedDirectories setting correctly restricts access

Test 6: Prefix path blocking
DEBUG Test6 - Base directory: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc
DEBUG Test6 - Prefix-matching directory: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc_xyz
DEBUG Test6 - Config: ["/Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc"]
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc/base-file.txt
DEBUG isPathAccessible - Validation successful: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc/base-file.txt
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc_xyz
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc_xyz. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc
DEBUG isPathAccessible - Checking access to: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc_xyz/prefix-file.txt
DEBUG isPathAccessible - Validation failed: Error: Path not allowed: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc_xyz/prefix-file.txt. Must be within one of these directories: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_dir_abc
✓ Prefix path blocking works correctly

✅ All allowedDirectories tests passed!
Cleaning up test directories...
Cleanup complete.
✓ Teardown: test directories cleaned up and config restored
[32m✓ Test passed: ./test-allowed-directories.js[0m

[36mRunning test module: ./test-blocked-commands.js[0m
Cleaning up test directories...
Cleanup complete.
✓ Setup: created test directory: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test/test_blocked_commands
=== blockedCommands Configuration Tests ===


Test 1: Execution of non-blocked commands
Testing command: echo "Hello World"
✓ Command executed successfully: echo "Hello World"
Testing command: pwd
✓ Command executed successfully: pwd
Testing command: date
✓ Command executed successfully: date

Test 2: Execution of blocked commands
Testing blocked command: rm
Command rm allowed: false
✓ Command was correctly blocked: rm
Testing blocked command: mkfs
Command mkfs allowed: false
✓ Command was correctly blocked: mkfs
Testing blocked command: dd
Command dd allowed: false
✓ Command was correctly blocked: dd

Test 3: Updating blockedCommands list
Command echo blocked before update: true
Command echo allowed after update: true
✓ blockedCommands list was successfully updated

Test 4: Empty blockedCommands array
Testing with empty blockedCommands: echo "Hello World"
✓ Command allowed with empty blockedCommands: echo "Hello World"
Testing with empty blockedCommands: pwd
✓ Command allowed with empty blockedCommands: pwd
Testing with empty blockedCommands: date
✓ Command allowed with empty blockedCommands: date
Testing with empty blockedCommands: rm
✓ Command allowed with empty blockedCommands: rm
Testing with empty blockedCommands: mkfs
✓ Command allowed with empty blockedCommands: mkfs
Testing with empty blockedCommands: dd
✓ Command allowed with empty blockedCommands: dd

✅ All blockedCommands tests passed!
Cleaning up test directories...
Cleanup complete.
✓ Teardown: test directories cleaned up and config restored
[32m✓ Test passed: ./test-blocked-commands.js[0m

[36mRunning test module: ./test-home-directory.js[0m
Cleaning up test directories...
Cleanup complete.
Set allowed directories to: /Users/robertlee, /Users/robertlee/GitHubProjects/DesktopCommanderMCP/test
=== Home Directory (~) Path Handling Tests ===


Test 1: Basic tilde expansion
Testing tilde expansion for: ~
Home directory from os.homedir(): /Users/robertlee
Tilde (~) expanded to: /Users/robertlee
✓ Basic tilde expansion works correctly

Test 2: Tilde with subdirectory expansion
Testing tilde with subdirectory expansion for: ~/Documents
Home documents directory: /Users/robertlee/Documents
~/Documents expanded to: /Users/robertlee/Documents
✓ Tilde with subdirectory expansion works correctly

Test 3: Tilde in allowedDirectories config
Config: ["~"]
Home directory access: /Users/robertlee
Home documents directory access: /Users/robertlee/Documents
✓ Tilde in allowedDirectories works correctly

Test 4: File operations with tilde
Attempting to create directory: ~/.claude-test-tilde
Created test directory: ~/.claude-test-tilde
Attempting to write to file: ~/.claude-test-tilde/test-file.txt
Wrote to test file: ~/.claude-test-tilde/test-file.txt
Attempting to read file: ~/.claude-test-tilde/test-file.txt
Read from test file content: This is a test file for tilde expansion
Attempting to list directory: ~/.claude-test-tilde
Listed test directory: [FILE] test-file.txt
✓ File operations with tilde work correctly

✅ All home directory (~) tests passed!
Cleaning up test directories...
Cleanup complete.
✓ Teardown: test directories cleaned up and config restored
[32m✓ Test passed: ./test-home-directory.js[0m

[36mRunning test module: ./test-edit-block-line-endings.js[0m
✓ Setup: created test directory and files
=== edit_block Line Ending Tests ===


Test 1: LF line endings (Unix/Linux)
✓ LF line endings test passed

Test 2: CRLF line endings (Windows)
✓ CRLF line endings test passed

Test 3: CR line endings (Old Mac)
✓ CR line endings test passed

Test 4: Mixed line endings
✓ Mixed line endings test passed

Test 5: Context-aware replacement across line ending types
✓ Context-aware replacement test passed

Test 6: Performance with large files
✓ Performance test passed (LF: 1ms, CRLF: 0ms)

Test 7: Edge cases
✓ Edge cases test passed

✅ All edit_block line ending tests passed!
✓ Teardown: test directory cleaned up and config restored
[32m✓ Test passed: ./test-edit-block-line-endings.js[0m

[36mRunning test module: ./test-edit-block-occurrences.js[0m
✓ Setup: created test directory and files
=== edit_block Multiple Occurrences Tests ===


Test 1: More occurrences than expected
✓ Test correctly failed with more occurrences than expected

Test 2: Fewer occurrences than expected
✓ Test correctly failed with fewer occurrences than expected

Test 3: Exactly the right number of occurrences
✓ Test succeeded with exact number of occurrences

Test 4: Context-specific replacements
✓ Test succeeded with context-specific replacements

Test 5: Non-existent pattern
✓ Test correctly handled non-existent pattern

Test 6: Empty search string
✓ Test correctly rejected empty search string

✅ All edit_block multiple occurrences tests passed!
✓ Teardown: test directory cleaned up and config restored
[32m✓ Test passed: ./test-edit-block-occurrences.js[0m

[36mRunning test module: ./test-error-sanitization.js[0m
✅ Test passed: sanitizeError - Error object with path
✅ Test passed: sanitizeError - Windows path
✅ Test passed: sanitizeError - Multiple paths
✅ Test passed: sanitizeError - String error
✅ Test passed: sanitizeError - Error code preservation
✅ Test passed: sanitizeError - Path with special characters
✅ Test passed: sanitizeError - Non-error input
✅ Test passed: sanitizeError - Actual system paths
✅ Test passed: Integration - capture with error object
All error sanitization tests complete.
[32m✓ Test passed: ./test-error-sanitization.js[0m

[36m===== Test Summary =====[0m

Total tests: 8
[32mPassed: 8[0m

[32mAll tests passed! 🎉[0m

$ npm run build

> @wonderwhy-er/desktop-commander@0.1.39 build
> tsc && shx cp setup-claude-server.js dist/ && shx chmod +x dist/*.js

TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/version.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/version.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/capture.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/capture.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config-manager.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/config-manager.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/command-manager.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/command-manager.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/custom-stdio.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/custom-stdio.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/types.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/types.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/error-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/error-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/schemas.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/schemas.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/config.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/config.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/withTimeout.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/withTimeout.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/mime-types.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/mime-types.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/filesystem.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/filesystem.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/filesystem-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/filesystem-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/terminal-manager.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/terminal-manager.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/execute.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/execute.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/terminal-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/terminal-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/process.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/process.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/process-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/process-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/search.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/search.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/fuzzySearch.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/fuzzySearch.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/lineEndingHandler.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/utils/lineEndingHandler.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/edit.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/tools/edit.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/edit-search-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/edit-search-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/task-manager-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/task-manager-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/sequential-thinking-handlers.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/sequential-thinking-handlers.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/index.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/handlers/index.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/server.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/server.d.ts
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/index.js
TSFILE: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/index.d.ts
Files:                         236
Lines of Library:            39719
Lines of Definitions:        80265
Lines of TypeScript:          4860
Lines of JavaScript:             0
Lines of JSON:                   0
Lines of Other:                  0
Identifiers:                141594
Symbols:                    135724
Types:                       32929
Instantiations:             160801
Memory used:               185610K
Assignability cache size:     7800
Identity cache size:           634
Subtype cache size:            232
Strict subtype cache size:      85
I/O Read time:               0.01s
Parse time:                  0.15s
ResolveModule time:          0.02s
ResolveLibrary time:         0.00s
ResolveTypeReference time:   0.00s
Program time:                0.22s
Bind time:                   0.07s
Check time:                  0.31s
transformTime time:          0.02s
commentTime time:            0.01s
I/O Write time:              0.00s
printTime time:              0.07s
Emit time:                   0.07s
Total time:                  0.67s
```
