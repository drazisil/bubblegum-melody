import { readFile, stat } from "fs/promises"
import { getArgs } from "./src/util.js"
import { DOSHeader } from "./src/DOSHeader.js"

class FileHeader {
    #machine
    
    constructor() {
        this.#machine = -1
    }
    
    get name() {
        return 'FileHeader'
    }
    
    /**
     * 
     * @param {Buffer} data 
    */
   parse(data) {
       let cursor = 0
       console.log(`Parsing ${data.byteLength} bytes into a ${this.name} structure...`)
       console.group()
       this.#machine = data.readUInt16LE(cursor)
       console.log(`Machine: ${this.Machine}`)
       console.groupEnd()
    }

    get Machine() {
        switch(this.#machine) {
            case 0x14c:
                return `i386`
            default:
                return `Unknown (${this.#machine})`
        }
    }
    
}

class NTHeaders {
    #signature // dword
    #fileHeader
    
    constructor() {
        this.#signature = ""
        this.#fileHeader = new FileHeader()
    }
    
    get name() {
        return 'NTHeaders'
    }
    
    /**
     * 
     * @param {Buffer} data 
    */
   parse(data) {
       let cursor = 0
       console.log(`Parsing ${data.byteLength} bytes into a ${this.name} structure...`)
       console.group()
       this.#signature = data.subarray(cursor, 4).toString()
       console.log(`signature: ${this.#signature.toString()}`)
       cursor += 4
        this.#fileHeader.parse(data.subarray(cursor))
        console.groupEnd()
    }
}

class SectionTable {}

class PEFile {
    #dosHeader
    #ntHeaders

    constructor() {
        this.#dosHeader = new DOSHeader()
        this.#ntHeaders = new NTHeaders()
    }

    get name() {
        return 'PEFile'
    }

    /**
     * 
     * @param {Buffer} fileBuffer 
     * @returns {PEFile}
     */
    static Parse(fileBuffer) {
        
        const self = new PEFile()
        self.parse(fileBuffer)
        return self
    }
    
    /**
     * 
     * @param {Buffer} data 
    */
   parse(data) {
        console.log(`Parsing ${data.byteLength} bytes into a ${this.name} structure...`)
        
        let cursor = 0
        console.group()
        this.#dosHeader.parse(data.subarray(cursor))
        cursor += this.#dosHeader.e_lfanew
        this.#ntHeaders.parse(data.subarray(cursor))
        console.groupEnd()
    }

}

async function main() {
    process.exitCode = -1

    const args = getArgs()

    const filePath = args[0]

    console.log(filePath)

    const file = await stat(filePath)

    const tmp = await readFile(filePath)

    if (tmp === null) {
        throw new Error('Error reading file!')
    }


    try {
        const file = PEFile.Parse(tmp)
        process.exitCode = 0
    } catch (e) {
        console.log(e)
    }

}

await main()