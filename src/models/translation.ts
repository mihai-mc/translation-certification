
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

export const languages = Object.freeze({
    ROMANIAN: Object.freeze(new MultiLingualText("română", "Romanian", "roumain")),
    ENGLISH: Object.freeze(new MultiLingualText("engleză", "English", "anglais")),
    FRENCH: Object.freeze(new MultiLingualText("franceză", "French", "français"))
});

export type Language = typeof languages[keyof typeof languages];

