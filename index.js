const path = require('path')
const minimist = require('minimist')
const shell = require('shelljs')

const argv = minimist(process.argv.slice(2), {
  boolean: ['interactive', 'yarn'],
  alias: {
    'projectName': ['project-name', 'name', 'n'],
    'outputPath': ['output-path', 'output', 'o'],
    'yarn': ['yarn-pkg', 'y'],
    'interactive': ['i'],
  },
  '--': true,
})

console.log(JSON.stringify(argv))

const [oldVersion, newVersion] = argv._
const cliArgs = argv['--']
const { 
  projectName = 'project-name',
  outputPath = path.join(__dirname, `./reports/changes-of-${oldVersion}-to-${newVersion}.patch`),
  yarn = false,
  interactive = false,
} = argv

const cliArgsStr = cliArgs.join(' ')
const basePath = `/tmp/workspaces`
const cliProjectPath = `${basePath}/cli-change-observer`
const projectPath = `${basePath}/${projectName}`
const projectOldPath = `${basePath}/${projectName}-old`
const binPath = `${cliProjectPath}/node_modules/.bin`

const installCmd = yarn ? `yarn add` : `npm install`

shell.echo(`Checking difference from ${oldVersion} to ${newVersion}`)
shell.echo(`For command: ng new ${cliArgsStr} ${projectName}`)

shell.rm('-rf', cliProjectPath)
shell.rm('-rf', projectPath)
shell.rm('-rf', projectOldPath)

shell.mkdir('-p', cliProjectPath)
shell.mkdir('-p', projectPath)

shell.cd(cliProjectPath)
shell.echo(`Installing Angular CLI version ${oldVersion}`)
shell.exec(`${installCmd} @angular/cli@${oldVersion}`)

shell.cd(basePath)
shell.echo(`Creating project in version ${oldVersion}`)
shell.exec(`${binPath}/ng new -si ${cliArgsStr} ${projectName}`)

shell.mv(projectPath, projectOldPath)

shell.cd(cliProjectPath)
shell.echo(`Installing Angular CLI version ${newVersion}`)
shell.exec(`${installCmd} @angular/cli@${newVersion}`)

shell.cd(basePath)
shell.echo(`Creating project in version ${newVersion}`)
shell.exec(`${binPath}/ng new -si ${cliArgsStr} ${projectName}`)

shell.rm('-rf', `${projectPath}/.git`)
shell.cp('-r', `${projectOldPath}/.git`, `${projectPath}/.git`)

shell.cd(projectPath)
if (interactive) {
  shell.exec('git diff')
} else {
  shell.exec(`git diff > ${outputPath}`)
}
