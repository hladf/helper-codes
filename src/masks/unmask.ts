export default function unmask(value: string) {
    return value.replace(/[^\d]+/g, "");
}