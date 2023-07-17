class bracketsParser {
    static parse = async (str, ...args) => {
        str = str.split("");
        let stack = [[]];
        let t = '';
        while (str.length) {
            let next = () => {
                while (str.length) {
                    let t = str.shift();
                    if (t !== '\n' && t !== "\t") {
                        return t;
                    }
                }
            }
            let ch = next();
            if (ch === "(") {
                stack.push([]);
            } else if (ch === ")") {
                //
                stack[stack.length - 1].push(t);
                t = '';
                //
                let c = stack[stack.length - 1];
                stack.pop();
                stack[stack.length - 1].push(c);
            } else {
                if (ch == " ") {
                    stack[stack.length - 1].push(t);
                    t = '';
                } else {
                    t += ch;
                }

            }
        }
        if (t.length) {
            stack[stack.length - 1].push(t);
        }

        let calc = async (arr) => {
            for (const arg of args) {
                for (let i = 0; i <= arr.length - 1; i++) {
                    for (const key of Object.keys(arg)) {
                        if (arr[i] === key) {
                            arr.splice(i - 1, 3, { kek: await arg[key](arr[i - 1], arr[i + 1]) });
                            i = i - 1;
                        }
                    }
                }
            }
        }
        let deep = async (arr) => {
            for (let i = 0; i <= arr.length - 1; i++) {
                if (Array.isArray(arr[i])) {
                    if (arr[i].length === 1) {
                        arr[i] = arr[i][0];
                    } else {
                        await deep(arr[i]);
                        i = i - 1;
                    }
                }
            }
            await calc(arr);
        }
        await deep(stack[0]);
        return stack[0];
    }
}
module.exports = bracketsParser