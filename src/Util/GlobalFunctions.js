export const  capitalize=(string)=> {
    return string
        .split('')
        .map((letter, index) =>
            index ? letter.toLowerCase() : letter.toUpperCase(),
        )
        .join('');
}
