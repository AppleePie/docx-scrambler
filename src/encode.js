import DocumentEditor from "docx_editor";

export default async function encode(wordData, textData, space = '25') {
    const docEditor = new DocumentEditor();

    await docEditor.extract(wordData);

    docEditor.parse("word/document.xml", (xmlData) => {
        if (!Array.isArray(xmlData['w:document']['w:body']['w:p'])) {
            xmlData['w:document']['w:body']['w:p'] = [xmlData['w:document']['w:body']['w:p']];
        }

        const paragraphs = xmlData['w:document']['w:body']['w:p'];

        for (const paragraph of paragraphs.filter(p => p)) {
            if (!Array.isArray(paragraph['w:r'])) {
                paragraph['w:r'] = [paragraph['w:r']];
            }

            const runs = paragraph['w:r'].filter(Boolean).flatMap(run => {
                let text = run['w:t'];

                if (typeof text === "object") {
                    text = text['#text'];
                }

                return Array.from(text).map(chr => ({ 'w:rPr': run['w:rPr'], 'w:t': chr }));
            });

            paragraph['w:r'] = runs;

            for (const run of runs) {
                if (run == null) {
                    continue;
                }

                if (/\s+/.test(run['w:t'])) {
                    run['w:t'] = run['w:t'].replace(/\s+/, '&#160;')
                }

                if (run['w:t'] === textData[0]) {
                    run['w:rPr'] = { ...run['w:rPr'], 'w:spacing': { '@_w:val': space }};
                    textData = textData.substring(1);
                }
            }
        }

        if (textData) {
            throw new Error('Error: Недостаточно нужных символов для шифрования');
        }
    });

    return docEditor.archive();
}