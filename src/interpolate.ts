export function interpolate(args: string[], env: Record<string, string>, platform = process.platform) {
    const dollar = platform === 'win32' ? '\\\\?\\$' : '\\$';

    return args.map(arg => {
        Object.keys(env)
            .sort((x, y) => y.length - x.length) // sort by descending length to prevent partial replacement
            .forEach(key => {
                const regex = new RegExp(`${dollar}${ key }|%${ key }%|${dollar}\{${ key }\}`, "ig");
                arg = arg.replace(regex, env[key]);
            });
        return arg;
    })
}
