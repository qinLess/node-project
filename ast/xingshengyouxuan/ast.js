let fs = require('fs');
let esprima = require('esprima');
let estraverse = require('estraverse');
let escodegen = require('escodegen');

let code = fs.readFileSync('./code.js', {encoding: 'utf8'})

let ast = esprima.parse(code);

estraverse.traverse(ast, {
    enter(node) {
        if (node.type === 'CallExpression') {
            if (node.callee && node.callee.name === 'f') {
                // console.log('old: ', node)
                let func_name = node.callee.name
                let param1 = node.arguments[0].value
                let param2 = node.arguments[1].value
                let new_code = eval(`${func_name}('${param1}', '${param2}')`)
                delete node.callee
                delete node.arguments
                node.type = 'Literal'
                node.value = new_code
                node.raw = new_code
            }
        }
    }
});

let result = escodegen.generate(ast)

fs.writeFileSync('./new_code.js', result, {encoding: 'utf8'})
