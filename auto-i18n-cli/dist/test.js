var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { transformFromAstSync } from '@babel/core';
import parser from '@babel/parser';
import template from '@babel/template';
import { jsxExpressionContainer } from '@babel/types';
import prettier from 'prettier';
const sourceCode = `
  import { useState } from 'react'
  import './App.css'

  function App() {
    const [count, setCount] = useState(0)
    return (
      <div>
        <div>{count}</div>
        <button onClick={() => setCount(count => count + 1)}>增加</button>
        <button onClick={() => setCount(count => count - 1)}>减小</button>
      </div>
    )
  }

  export default App
`;
function myPlugin() {
    return {
        visitor: {
            Program(path) {
                let index = 0;
                while (path.node.body[index].type === 'ImportDeclaration') {
                    index++;
                }
                const ast = template.statement("import { defineMessages, useIntl } from 'react-intl'")();
                path.node.body.splice(index, 0, ast);
                const textArr = [];
                path.traverse({
                    JSXText(p) {
                        if (p.node.value.trim() !== '') {
                            textArr.push(p.node.value);
                        }
                    }
                });
                const messagesAst = template.statement(`
            const messsages = defineMessages({
              ${textArr.map(item => {
                    return `${item}: {
                  id: "${item}"
                }`;
                }).join(',')}
            }) 
        `)();
                path.node.body.splice(index + 1, 0, messagesAst);
            },
            FunctionDeclaration(path, state) {
                if (path.parent.type === 'Program') {
                    let methodName = 'intl';
                    if (path.scope.getBinding(methodName)) {
                        methodName = path.scope.generateUid(methodName);
                    }
                    const ast = template.statement(`const ${methodName} = useIntl();`)();
                    path.node.body.body.unshift(ast);
                    state.intlName = methodName;
                }
            },
            JSXText(path, state) {
                if (path.node.value.trim() !== '') {
                    const ast = template.expression(`${state.intlName}.formatMessage(messages["${path.node.value}"])`)();
                    path.replaceWith(jsxExpressionContainer(ast));
                }
            }
        }
    };
}
const ast = parser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx']
});
const res = transformFromAstSync(ast, sourceCode, {
    plugins: [myPlugin],
    retainLines: true
});
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const formattedCode = yield prettier.format(res === null || res === void 0 ? void 0 : res.code, {
            filepath: 'aaa.tsx'
        });
        console.log(formattedCode);
    });
})();
