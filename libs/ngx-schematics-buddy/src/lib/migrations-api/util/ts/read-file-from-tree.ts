import { Tree } from '@angular-devkit/schematics';

export function readFileFromTree(tree: Tree, filePath: string) {
  const codeBuffer = tree.read('.' + filePath);
  if (!codeBuffer) {
    return;
  }
  return codeBuffer.toString();
}
