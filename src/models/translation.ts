
export class MultiLingualText {
    private readonly _ro_text: string;
    private readonly _en_text: string;
    private readonly _fr_text: string;

    public constructor(ro_text: string, en_text: string, fr_text: string) {

        ro_text = ro_text.trim();
        en_text = en_text.trim();
        fr_text = fr_text.trim();

        if (!ro_text || !en_text || !fr_text)
            throw new Error("Text must be supplied in all languages!");

        this._ro_text = ro_text;
        this._en_text = en_text;
        this._fr_text = fr_text;
    }

    public get RO(): string {
        return this._ro_text;
    }

    public get EN(): string {
        return this._en_text;
    }

    public get FR(): string {
        return this._fr_text;
    }
}

export class DualLingualText {
    private readonly _original_text: string;
    private readonly _original_language: Language;
    private readonly _translated_text: string;
    private readonly _translated_language: Language;

    private readonly _text;

    public constructor(original: [Language, string], translated: [Language, string]) {

        const original_language = original[0];
        const original_text = original[1].trim();

        const translated_language = translated[0];
        const translated_text = translated[1].trim();

        if (!original_language || !translated_language)
            throw new Error("Text must be paired with a language");

        if (!original_text || !translated_text)
            throw new Error("Text must be supplied in both languages!");

        this._original_text = original_text;
        this._original_language = original_language;
        this._translated_text = translated_text;
        this._translated_language = translated_language;

        this._text = { [original_language.EN]: original_text, [translated_language.EN]: translated_text };
    }

    public get original_text(): string {
        return this._original_text;
    }

    public get original_language(): Language {
        return this._original_language;
    }

    public get translated_text(): string {
        return this._translated_text;
    }

    public get translated_language(): Language {
        return this._translated_language;
    }

    public get RO(): string {
        return this._text[languages.ROMANIAN.EN];
    }

    public get EN(): string {
        return this._text[languages.ENGLISH.EN];
    }

    public get FR(): string {
        return this._text[languages.FRENCH.EN];
    }
}

export const languages = Object.freeze({
    ROMANIAN: Object.freeze(new MultiLingualText("română", "Romanian", "roumain")),
    ENGLISH: Object.freeze(new MultiLingualText("engleză", "English", "anglais")),
    FRENCH: Object.freeze(new MultiLingualText("franceză", "French", "français"))
});

export type Language = typeof languages[keyof typeof languages];

