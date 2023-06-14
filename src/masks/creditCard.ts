export default function creditCardMask(v: string) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{4})/g, "$1 ");
    v = v.replace(/\.$/, "");
    v = v.substring(0, 19);

    return v;
}

export const creditCardExpirationDateMask = (date: string) => {
    const value = date.replace(/\D/g, "");
    const month = value.slice(0, 2);
    const year = value.slice(2, 4);

    return month + (year.length ? "/" + year : "");
};