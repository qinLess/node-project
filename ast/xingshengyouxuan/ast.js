function _typeof(o) {
    return typeof o;
}

var t = _typeof
    , n = "length"
    , i = "charCodeAt"
    , r = "fromCharCode"
    , e = "MXQdEgf"
    , u = "9Bp2:C7D"
    , s = "Tl)*Iaa"
    , o = 'i"B=f|z'
    , f = "w0LO`xx*c((u!"
    , h = ";8J+9D?"
    , c = "xw$f~{p"
    , a = "\\[kJZg\\"
    , v = "ts brt"
    , w = "WTfG]XS"
    , l = "1.<~72)"
    , D = "IFT5OJA"
    , b = "30B#1<7"
    , x = "('7w.+ "
    , m = "?E?MxU"
    , S = "DFGN"
    , d = '  |-1)6Z "t,'
    , E = "6Hz@B?D"
    , g = ",+;{*7,"
    , A = "87G&>;0"
    , H = "EPMQJBP@"
    , M = "QZ)TQ]RJTD"
    , p = "hupvuom"
    , _ = "9DAEF>L<"
    , k = ")4156.<,"
    , P = "HGW6NK@"
    , z = "u!Mx}y~v)x"
    , C = "S\\/ZS_PHVF"
    , O = "/0|}%*)";

function J(t, e) {
    for (var u = "", s = 0; s < t[n]; s++)
        u += String[r]((95 + (t[i](s) - 32 ^ 31 & s) - e) % 95 + 30);
    return u;
}

function N(t, n) {
    return n[J("KQDD^4N", 63)](t + J("2fa", 85)) > -1;
}

let fs = require('fs');
let esprima = require('esprima');
let estraverse = require('estraverse');
let escodegen = require('escodegen');

let code = fs.readFileSync('./code.js', {encoding: 'utf8'})

let ast = esprima.parse(code);

estraverse.traverse(ast, {
    enter(node) {
        if (node.type === 'CallExpression') {
            if (node.callee && node.callee.name === 'J') {
                // console.log('old: ', node)
                let func_name = node.callee.name;
                let param1 = node.arguments[0].value;
                let param2 = node.arguments[1].value;
                let new_code = '';

                try {
                    // if (/'/.test(param1)) {
                    //     new_code = eval(`${func_name}("${param1}", ${param2})`)
                    // } else if (/"/.test(param1)) {
                    //     new_code = eval(`${func_name}('${param1}', ${param2})`)
                    // }

                    param1 = param1.replace(/'/gi, "\\'");
                    param1 = param1.replace(/"/gi, '\\"');
                    param1 = param1.replace(/`/gi, '\\`');

                    new_code = eval(`${func_name}("${param1}", ${param2})`);

                    console.log('new_code: ', new_code);
                    delete node.callee;
                    delete node.arguments;
                    node.type = 'Literal';
                    node.value = new_code;
                    node.raw = new_code

                } catch (error) {}
            }
        }
    }
});

let result = escodegen.generate(ast)

fs.writeFileSync('./new_code.js', result, {encoding: 'utf8'})
