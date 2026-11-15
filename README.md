# Test Smell Detector for VS Code

## Introduction

Test smells are poor design or implementation practices in unit test code. They
can make tests harder to understand, maintain, and trust. This extension brings
the Java-based Test Smell Detector (`tsDetect`) into Visual Studio Code so that
developers can review test-smell findings without manually creating CSV files
or running the detector from a terminal.

For the research definitions and detection strategies, see the official
[Test Smell Types](https://testsmells.org/pages/testsmells.html) catalog.

## Project overview

The extension analyzes saved Java test files with the bundled tsDetect engine.
It can:

- Analyze the active Java test file from the Command Palette.
- Reanalyze supported Java test files automatically after they are saved.
- Find or request the production file associated with the test file.
- Display findings in the Problems panel, editor, Output panel, and
  notifications.
- Map engine-confirmed findings to affected test methods or classes when source
  information is available.
- Let users choose which smell types are reported.
- Explain a reported smell through a **Learn about this smell** code action.
- Cancel a manual analysis and stop detector processes that exceed a timeout.
- Clear outdated findings after a change, failure, cancellation, or superseded
  run.

## Requirements

- Visual Studio Code 1.90.0 or newer.
- Java 11 or newer available through the `java` command, or an explicit Java
  executable configured in the extension settings.
- Saved Java test and production files stored on the local filesystem.
- A trusted VS Code workspace. Restricted Mode is not currently supported.

Node.js is only required when building or testing the extension from source.
Development and CI use Node.js 22 or newer.

## Installation

### Install a pilot VSIX

1. Obtain the release candidate file named `test-smell-detector.vsix`.
2. Open VS Code and run **Extensions: Install from VSIX...** from the Command
   Palette.
3. Select the VSIX file and reload VS Code when prompted.
4. Open VS Code Settings and search for **Test Smell Detector** to confirm the
   extension settings are available.

The extension has not yet been published to the VS Code Marketplace. Pilot
builds are distributed as controlled VSIX artifacts.

### Run from source

1. Install the dependencies with `npm ci`.
2. Open this repository in VS Code.
3. Press `F5` to open an Extension Development Host.
4. Open a folder containing a saved Java test file and its production file in
   the new window.

## Usage

### Manual analysis

1. Open a saved Java test file and keep it as the active editor.
2. Run **Test Smell Detector: Analyze Current File** from the Command Palette.
3. Select the related production Java file if the extension cannot identify it
   automatically.
4. Review the findings in the Problems panel and the run summary in the
   **Test Smell Detector** Output channel.

The command validates that an editor is open and that the active file is a
saved Java file with no unsaved changes. Informative messages explain why an
unsupported file cannot be analyzed.

### Incremental analysis

When **Analyze On Save** is enabled, saving a supported Java test file schedules
a new analysis after a short delay. The extension:

- Recognizes common test suffixes such as `Test`, `Tests`, `IT`, and `Spec`, as
  well as Java files under `src/test`.
- Debounces repeated save events to avoid unnecessary detector runs.
- Serializes runs for the same file and rejects outdated results.
- Allows different test files to be analyzed independently.
- Clears old diagnostics as soon as a Java file changes.

If automatic matching cannot find a production file, run a manual analysis
once and select the correct file. The extension remembers that choice for the
current session.

## Results and interface

Findings are presented through standard VS Code features:

- **Problems panel:** Lists each reported smell as a warning and opens the
  associated source location when selected.
- **Editor diagnostics:** Adds warning squiggles to affected test methods or
  classes. When an exact declaration is unavailable, the diagnostic falls back
  to the test class or file.
- **Diagnostic hover:** Displays the smell name when the pointer is placed over
  a warning squiggle.
- **Output channel:** Records the analyzed test and production files, test
  method count, findings, mapped locations, and technical failure details.
- **Notifications:** Summarize successful, cancelled, and failed analyses.

### Learn about a smell

Place the cursor on a Test Smell Detector diagnostic and open the lightbulb or
Quick Fix menu. Select **Learn about _Smell Name_** to display a short
definition of that smell. These explanations help users understand a finding;
they do not automatically modify the test code.

## Preferences

Open VS Code Settings and search for **Test Smell Detector**.

| Setting | Default | Purpose |
| --- | --- | --- |
| `testSmellDetector.javaPath` | `java` | Java executable used to start the bundled detector. |
| `testSmellDetector.analyzeOnSave` | `true` | Reanalyzes supported Java test files after save. |
| `testSmellDetector.analysisTimeoutSeconds` | `60` | Stops a detector process after 1–600 seconds. |
| `testSmellDetector.smells.*` | `true` | Enables or disables reporting for an individual smell. |

Every smell is enabled by default. Disabling a smell filters it from the
Problems panel, Output channel, squiggles, hover messages, and notifications on
the next analysis. The bundled engine still runs its analyzers; the preference
controls reporting rather than engine execution.

## Test and production-file matching

Some tsDetect analyzers compare a test file with its related production file.
The extension supports common layouts and naming conventions, including
`CalculatorTest.java` paired with `Calculator.java`, and prefers production
files under `src/main`.

If there is no safe automatic match, the extension asks the user to choose a
production Java file. Unusual naming conventions or project layouts may
therefore require one manual selection.

## Supported smells

The bundled engine exposes the following smell analyzers:

- Assertion Roulette
- Conditional Test Logic
- Constructor Initialization
- Default Test
- Dependent Test
- Duplicate Assert
- Eager Test
- Empty Test
- Exception Catching Throwing, called **Exception Handling** in the website
  catalog
- General Fixture
- Ignored Test
- Lazy Test
- Magic Number Test
- Mystery Guest
- Redundant Assertion
- Redundant Print
- Resource Optimism
- Sensitive Equality
- Sleepy Test
- Unknown Test
- Verbose Test

The official TestSmells.org catalog currently documents 19 of these smells.
Dependent Test and Verbose Test are additional analyzers exposed by the bundled
tsDetect build. The current Dependent Test analyzer contains an inherited
comparison bug and cannot produce a finding; it remains listed to accurately
document the bundled engine's capabilities. Verbose Test remains available,
while its website documentation is being verified.

## Detector execution and troubleshooting

Each detector process has a 60-second timeout by default. Change
`testSmellDetector.analysisTimeoutSeconds` when a project needs more time.
Manual analysis displays cancellable VS Code progress; selecting **Cancel**
terminates the Java process and prevents that run from publishing results.

Starting a newer analysis for the same file supersedes the older run. Failed,
cancelled, timed-out, and superseded runs clear existing diagnostics for that
file so stale findings are not left visible.

When analysis fails, open **View > Output** and select **Test Smell Detector**.
The channel records the failure category, Java executable, arguments, timeout,
exit information, and captured process output.

Common problems include:

- **Java cannot be started:** Install Java 11 or newer, or update
  `testSmellDetector.javaPath`.
- **Bundled JAR is missing:** Reinstall the extension from a complete VSIX.
- **Analysis times out:** Increase the timeout setting or analyze a smaller
  test/production pair.
- **No production file is found:** Run manual analysis and select the related
  Java production file.
- **Changes are not analyzed:** Save both files before starting analysis and
  confirm **Analyze On Save** is enabled.

## Known limitations

- Only Java test files are supported.
- The detector reads files from disk, so unsaved changes are not analyzed.
- One test/production pair is processed per analysis request; the extension
  does not perform whole-project analysis.
- Automatic production-file matching depends on common naming and directory
  conventions.
- Some findings can only be placed at class or file level because the engine
  does not always identify the exact expression responsible for the smell.
- Detection rules, accuracy, and analyzer-specific defects are inherited from
  the bundled tsDetect engine.
- Dependent Test is registered by the bundled engine, but its current
  implementation compares a called-method name with a stream of test-method
  names. The comparison cannot match, so this analyzer does not currently
  report findings.
- Dependent Test and Verbose Test are not currently described in the official
  website catalog.

## Developer setup

1. Install Node.js 22 or newer and Java 11 or newer.
2. Clone the repository.
3. Run `npm ci`.
4. Open the repository in VS Code.
5. Press `F5` and select **VS Code Extension Development** if VS Code asks for
   a debug configuration.

The TypeScript extension code is under `src/`. The bundled detector and its
license are under `detector/`. `java/LocationBridge.java` connects tsDetect
findings to JavaParser method and class ranges.

## Building, testing, and packaging

Run the same checks used by continuous integration:

```sh
npm ci
npm run check
npm run compile
npm run test:preferences
npm run test:execution
npm run test:corpus
npm run package:vsix
```

The preference, execution-control, and corpus tests expect compiled files in
`out/`, so run `npm run compile` first. The packaging command creates
`test-smell-detector.vsix`.

GitHub Actions runs these checks for pull requests targeting `main`, pushes to
`main`, and manual workflow runs. The generated VSIX is uploaded as the
`test-smell-detector-vsix` workflow artifact.

## Regression corpus

`regression-corpus/` contains ten controlled Java test/production pairs and
their expected normalized detector results. It covers JUnit 4, JUnit 5, known
smells, a clean test, malformed input, naming conventions, and unusual paths.

The corpus is the shared detector compatibility baseline for the VS Code and
Eclipse integrations. IDE-specific interface tests remain in their respective
repositories.

## Licensing

The VS Code extension source is licensed under the MIT License. The bundled
`tsdetect.jar` is licensed separately under GNU GPL version 3. See
`detector/README.md` and `detector/LICENSE` for the pinned engine revision and
license information.

The distribution approach and the bundled detector's source-distribution and
notice obligations must be confirmed by the project owner before public
publication.

## Related projects

- [Test Smell Types](https://testsmells.org/pages/testsmells.html)
- [tsDetect core engine](https://github.com/TestSmells/TestSmellDetector)
- [Eclipse Test Smell Detector plugin](https://github.com/TestSmells/TestSmellDetectorPlugin2026)
