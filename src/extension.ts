// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const TERMINAL_NAME = "angular-schematic-runner #1";
const APP_NAME = "angular-schematic-runner";

function registerCommand(name: string, callback: (...args: any[]) => any) {
  return vscode.commands.registerCommand(`${APP_NAME}.${name}`, callback);
}

function askRequiredUserInput(title: string, placeHolder: string) {
  return vscode.window
    .showInputBox({ title, placeHolder })
    .then((userInput) => {
      if (!userInput) {
        throw new Error("");
      }
      return userInput;
    });
}

export function activate(context: vscode.ExtensionContext) {
  const terminal = vscode.window.createTerminal({
    name: TERMINAL_NAME,
    hideFromUser: true,
  });
  context.subscriptions.push(
    registerCommand("createComponent", (arg: { fsPath: string }) => {
      askRequiredUserInput(
        "Enter the name of new Component",
        "Enter the name of new Component"
      ).then((input) => _createComponent(terminal, arg.fsPath, input));
    }),
    registerCommand("createService", (arg: { fsPath: string }) => {
      askRequiredUserInput(
        "Enter the name of new Service",
        "Enter the name of new Service"
      ).then((input) => _createService(terminal, arg.fsPath, input));
    }),
    registerCommand("createDirective", (arg: { fsPath: string }) => {
      askRequiredUserInput(
        "Enter the name of new Directive",
        "Enter the name of new Directive"
      ).then((input) => _createDirective(terminal, arg.fsPath, input));
    }),
    registerCommand("createPipe", (arg: { fsPath: string }) => {
      askRequiredUserInput(
        "Enter the name of new Pipe",
        "Enter the name of new Pipe"
      ).then((input) => _createPipe(terminal, arg.fsPath, input));
    })
  );
}

function _createComponent(
  terminal: vscode.Terminal,
  path: string,
  name: string
) {
  runOnHiddenTerminal(terminal, [
    `cd ${path}`,
    `ng generate component ${name} --skip-import`,
  ]);
}

function _createService(terminal: vscode.Terminal, path: string, name: string) {
  runOnHiddenTerminal(terminal, [`cd ${path}`, `ng generate service ${name}`]);
}

function runOnHiddenTerminal(
  terminal: vscode.Terminal,
  commands: Array<string>
) {
  commands.forEach((command) => terminal.sendText(command));
}

function _createDirective(
  terminal: vscode.Terminal,
  path: string,
  name: string
) {
  runOnHiddenTerminal(terminal, [
    `cd ${path}`,
    `ng generate directive ${name} --skip-import`,
  ]);
}

function _createPipe(terminal: vscode.Terminal, path: string, name: string) {
  runOnHiddenTerminal(terminal, [
    `cd ${path}`,
    `ng generate pipe ${name} --skip-import`,
  ]);
}

export function deactivate() {
  const terml = vscode.window.terminals.find((x) => x.name === TERMINAL_NAME);
  terml?.dispose();
}
