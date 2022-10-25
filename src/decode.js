import DocumentEditor from "docx_editor";

export default async function decode(wordData) {
    const docEditor = new DocumentEditor();

    await docEditor.extract(wordData);

    let result = '';

    docEditor.parse("word/document.xml", (xmlData) => {
        if (!Array.isArray(xmlData['w:document']['w:body']['w:p'])) {
            xmlData['w:document']['w:body']['w:p'] = [xmlData['w:document']['w:body']['w:p']];
        }

        const paragraphs = xmlData['w:document']['w:body']['w:p'];

        result = paragraphs
            .filter(Boolean)
            .flatMap(p => Array.isArray(p['w:r']) ? p['w:r'] : [p['w:r']])
            .filter(r => r?.['w:rPr']?.['w:spacing'])
            .map(r => r['w:t'])
            .reduce((a, b) => a + b);
    });

    return result;
}