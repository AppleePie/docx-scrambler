import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from "path";
import encode from './encode.js';
import decode from './decode.js';

const args = process.argv.slice(2);

switch (args[0]) {
    case '-e':
    case '--encode': {
        const [, wordPath, textPath, space] = args;

        if (!existsSync(wordPath) || !existsSync(textPath)) {
            throw new Error('Error: Недостаточно файлов для шифрования')
        }

        if (space && Number.isNaN(Number(space))) {
            throw new Error('Error: space is not a number');
        }

        const [wordData, textData] = await Promise.all(
            [readFile(wordPath), readFile(textPath, { encoding: 'utf-8' })]
        );

        const result = await encode(wordData, textData, space);

        await writeFile(path.join(process.cwd(), 'document-edited.docx'), result);
        break;
    }
    case '-d':
    case '--decode': {
        const [, wordPath, space] = args;

        if (!existsSync(wordPath)) {
            throw new Error('Error: Недостаточно файлов для дешифрования')
        }

        if (space && Number.isNaN(Number(space))) {
            throw new Error('Error: space is not a number');
        }

        const wordData = await readFile(wordPath);

        const result = await decode(wordData, space);
        console.log(result);

        break;
    }
    default:
        console.log('Use: node src/index.js (-e | -d) wordPath [textPath]')
}


