import { namedTypes, visit } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";
import * as fs from "fs";
import * as recast from "recast";
import * as tsParser from "recast/parsers/babel-ts";

interface StatiShakerOptions {
  isExported: boolean;
  isFunction: boolean;
}

function staticShaker(
  path: string,
  identifier: string,
  options?: Partial<StatiShakerOptions>
) {
  const baseOptions: StatiShakerOptions = {
    isExported: false,
    isFunction: false,
  };

  const _options = { ...baseOptions, ...(options ? options : {}) };
  const code = fs.readFileSync(path, "utf-8");
  const file: namedTypes.File = recast.parse(code, { parser: tsParser });

  namedTypes.Program.assert(file.program);

  const store = new Map<string, number[]>();
  const deps = new Map<number, number[]>();
  let mainNode: NodePath["node"];

  function mapper(
    cb: (_path: NodePath) => string | undefined,
    _store: Map<string, number[]>
  ) {
    return (path: NodePath) => {
      const id = cb(path);
      let parentP = path;
      while (!namedTypes.Program.check(parentP.parentPath.node)) {
        parentP = parentP.parentPath;
      }
      if (id === identifier) mainNode = path.node;
      const prevLocs = id ? _store.get(id) || [] : [];
      if (id) _store.set(id, [...prevLocs, parentP.name]);
      return false;
    };
  }

  visit(file.program, {
    visitFunctionDeclaration: mapper((path) => path.node.id?.name, store),
    visitVariableDeclarator: mapper((path) => path.node.id?.name, store),
    visitImportSpecifier: mapper((path) => path.node.local?.name, store),
    visitImportDefaultSpecifier: mapper((path) => path.node.local?.name, store),
    visitExportDefaultDeclaration: mapper(
      (path) => path.node.declaration?.name || path.node.declaration?.id?.name,
      store
    ),
  });

  const mainNodePos = store.get(identifier) || [];
  if (!mainNodePos.length) throw new Error(identifier + " not defined");
  const mainNodeGrands = mainNodePos.map((p) => file.program.body[p]);

  if (
    _options.isExported &&
    !mainNodeGrands.some((g) => namedTypes.ExportNamedDeclaration.check(g))
  )
    throw new Error("config found but not exported");
  if (_options.isFunction && !namedTypes.FunctionDeclaration.check(mainNode))
    throw new Error("config exported but definition isn't a function");

  file.program.body.forEach((node, i) => {
    const tempDeps: number[] = [];
    visit(node, {
      visitIdentifier(path) {
        const id = path.node.name;
        const bodyNum = store.get(id) || [];
        if (bodyNum.length) tempDeps.push(...bodyNum);
        this.traverse(path);
      },
    });
    deps.set(
      i,
      tempDeps.filter((v) => v !== i)
    );
  });

  const unvisited = mainNodePos;
  const lines: number[] = [];
  while (unvisited.length > 0) {
    const shifted = unvisited.shift();
    const v: number = shifted === undefined ? -1 : shifted;
    if (lines.includes(v)) continue;
    const vDeps = v ? deps.get(v) || [] : [];
    unvisited.push(...vDeps);
    lines.push(v);
  }

  file.program.body = file.program.body.filter((_, i) => {
    return lines.includes(i);
  });
  return recast.print(file).code;
}

export default staticShaker;
