import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from "path";
import encode from './encode.js';
import decode from './decode.js';

const args = process.argv.slice(2);

switch (args[0]) {
    case '-e':
    case '--encode': {
        const [, wordPath, textPath] = args;

        if (!existsSync(wordPath) || !existsSync(textPath)) {
            throw new Error('Error: Недостаточно файлов для шифрования')
        }

        const [wordData, textData] = await Promise.all(
            [readFile(wordPath), readFile(textPath, { encoding: 'utf-8' })]
        );

        const result = await encode(wordData, textData);

        await writeFile(path.join(process.cwd(), 'document-edited.docx'), result);
        break;
    }
    case '-d':
    case '--decode': {
        const [, wordPath] = args;

        if (!existsSync(wordPath)) {
            throw new Error('Error: Недостаточно файлов для дешифрования')
        }

        const wordData = await readFile(wordPath);

        const result = await decode(wordData);
        console.log(result);

        break;
    }
    default:
        console.log('Use: node src/index.js (-e | -d) wordPath [textPath]')
}


