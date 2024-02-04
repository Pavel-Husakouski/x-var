export function interpolate(args: string[], env: Record<string, string>) {
    return args.map(arg => {
        Object.keys(env)
            .sort((x, y) => y.length - x.length) // sort by descending length to prevent partial replacement
            .forEach(key => {
                const regex = new RegExp(`\\$${ key }|%${ key }%`, "ig");
                arg = arg.replace(regex, env[key]);
            });
        return arg;
    })
}
