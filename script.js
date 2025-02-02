// Tokenizer: Converts the input string into tokens
function tokenize(input) {
    const tokens = [];
    const tokenRegex = /\s*(=>|[\+\-\*\/\(\)]|\d+)\s*/g;
    let match;

    while ((match = tokenRegex.exec(input)) !== null) {
        tokens.push(match[1]);
    }
    console.log(tokens);
    return tokens;
}

// Parser: Converts tokens into an Abstract Syntax Tree (AST)
function parse(tokens) {
    let current = 0;

    function parseExpression() {
        let node = parseTerm();

        while (tokens[current] === '+' || tokens[current] === '-') {
            const operator = tokens[current++];
            const right = parseTerm();
            node = {
                type: 'BinaryExpression',
                operator,
                left: node,
                right
            };
        }
        return node;
    }

    function parseTerm() {
        let node = parseFactor();

        while (tokens[current] === '*' || tokens[current] === '/') {
            const operator = tokens[current++];
            const right = parseFactor();
            node = {
                type: 'BinaryExpression',
                operator,
                left: node,
                right
            };
        }
        return node;
    }

    function parseFactor() {
        const token = tokens[current++];

        if (!isNaN(token)) {
            return { type: 'Literal', value: Number(token) };
        } else if (token === '(') {
            const node = parseExpression();
            if (tokens[current++] !== ')') {
                throw new Error('Expected closing parenthesis');
            }
            return node;
        }

        throw new Error(`Unexpected token: ${token}`);
    }

    return parseExpression();
}

// Main Function: Tokenizes and parses the input code
function parseToAST(code) {
    const tokens = tokenize(code);
    return parse(tokens);
}

// Example usage
const code = '3 + 4 * (2 - 1)';
const ast = parseToAST(code);

// Display the AST
// JSON.stringify(ast, null, 4)
console.log(JSON.stringify(ast, null, 4));
