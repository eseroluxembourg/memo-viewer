export function generateLink() {
    return {
        id: '10_11',
        fromCardId: '10',
        toCardId: '11',
        status: 'valid',
        langs: [],
        removed: false,
        explanations: { 'en-GB': 'Ha ha ha, my english', 'fr-FR': 'ANd in french' },
    };
}

export function generateCard() {
    return {
        id: 'my_id',
        title: { 'fr-FR': 'title in french', 'en-GB': 'and in english' },
        lot: '0',
        num: 1,
        isFrontOnly: true,
        cardContent: { 'en-US': 'Ha ha ha, my english', 'fr-FR': 'ANd in french' },
    };
}

export function generateLinks() {
    return {
        my_id: generateLink(),
    };
}
