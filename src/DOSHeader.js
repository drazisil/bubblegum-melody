export class DOSHeader {
    #e_magic; // word
    #e_lfanew; // word

    constructor() {
        this.#e_magic = "";
        this.#e_lfanew = -1;
    }

    get size() {
        return 64;
    }

    get name() {
        return 'DOSHeader';
    }

    /**
     *
     * @param {Buffer} data
     */
    parse(data) {
        let cursor = 0;

        this.#e_magic = data.subarray(cursor, 2).toString();
        console.log(`Parsing ${data.byteLength} bytes into a ${this.name} structure...`);

        console.group();
        console.log(`e_magic: ${this.#e_magic.toString()}`);
        cursor = 0x3c;
        this.#e_lfanew = data.readInt16LE(cursor);
        console.log(`e_lfanew: ${this.#e_lfanew}`);
        console.groupEnd();
    }

    get e_lfanew() {
        return this.#e_lfanew;
    }
}
