# cli-change-observer

Quickly find what to change when upgrading Angular CLI generated project.

## Usage

```bash
node index 1.2.0 1.2.1
```

Will generate a patch file in `reports` folder of changes need to be done.

## CLI configuration

For project name, use a `--project-name` or `-n` arg to specify it:

```bash
node index --project-name my-project 1.2.0 1.2.1
```

For custom CLI args, just pass it after `--`.

For example, if you're creating the project by:

```bash
ng new --style less
```

Then the command would be:

```bash
node index 1.2.0 1.2.1 -- --style less
```

## Additional args

A boolean arg of `--yarn` or `-y` could be specified for using Yarn to speed up the task:

```bash
node index --yarn 1.2.0 1.2.1
```

An arg of `--output-path` or `-o` can be specified for the output path of patch file:

```bash
node index --output-path ~/Documents/awesome-changes.patch 1.2.0 1.2.1
```

