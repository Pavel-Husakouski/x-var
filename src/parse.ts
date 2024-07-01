export function getVar(text: string): [string, string] {
    const regex = /^[A-Za-z_][A-Za-z0-9_]*=/g;

    if (regex.test(text)) {
        return [text.slice(0, regex.lastIndex - 1), text.slice(regex.lastIndex)];
    }

    return null;
}

export function extractArgs(args: string[], platform: string): [string[], string, Record<string, string>] {
    const vars: Record<string, string> = {};
    const list = [...args];
    let env = '';

    if (list.length === 0) {
        return [[], env, vars];
    }

    if (list[0] === '-e') {
        list.shift();

        env = list.shift();
    } else if (list[0].startsWith('-e=')) {
        const item = list.shift();

        env = item.slice(3);
    }

    for (let va = getVar(list[0]); va != null; va = getVar(list[0])) {
        list.shift();
        const [key, value] = va;

        vars[key] = value;
    }

    return [unquote(list, platform), env, vars];
}

function isOpening(chunk: string) {
    return chunk.startsWith('\'') && !chunk.endsWith('\'');
}

function isClosing(chunk: string) {
    return !chunk.startsWith('\'') && chunk.endsWith('\'');
}

function unquote(list: string[], platform: string) {
    if (platform != 'win32') {
        return list;
    }

    const result = [];

    for (let i = 0; i < list.length; i++) {
        const x = list[i];

        if (isOpening(x)) {
            let cmd = [x.slice(1)];
            i++;
            while (i < list.length && !isClosing(list[i])) {
                cmd.push(list[i]);
                i++;
            }
            if(i < list.length) {
                if(isClosing(list[i])) {
                    cmd.push(list[i].slice(0, -1));
                } else {
                    cmd.push(list[i]);
                }
            }
            result.push(cmd.join(' '));
        } else {
            result.push(x);
        }
    }

    return result;
}