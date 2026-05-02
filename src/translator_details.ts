

const languages = {
    ROMANIAN: {
        RO: "română",
        EN: "Romanian"
    },
    ENGLISH: {
        RO: "engleză",
        EN: "English"
    }
} as const;

type Language = typeof languages[keyof typeof languages];


class TranslatorDetails {
    private _name: string;
    private _authorisation_no: number | string;
    private _authorisation_date: Date;
    private _authorisation_languages: Language[];

    public constructor() {
        this._name = "OLTEANU Mihai-Cristian";
        this._authorisation_no = 39429;
        this._authorisation_date = new Date(2026, 3, 25); // NOTE: months are 0-indexed for some obscure reason
        this._authorisation_languages = [languages.ENGLISH];
    }

    public set name(otherName: string) {
        const character_limit: number = 128
        if (otherName.length >= character_limit)
            throw new Error(`Please trim input to strictly under ${character_limit} characters`);

        this._name = otherName;
    }

    public get name(): string {
        return this._name;
    }

    public set authorisation_no(auth_no: string) {
        // NOTE: Sometimes, the Romanian Ministry of Justice (MJ) issues numbers that are NOT numbers
        //       In such cases, the "*bis" suffix is added. Cute, I know...
        const MJ_suffix = "bis";
        if (auth_no.endsWith(MJ_suffix))
            auth_no = auth_no.slice(0, -MJ_suffix.length);

        const auth_number = Number(auth_no);
        if (!Number.isInteger(auth_number) || auth_number < 0)
            throw new Error("That's not a valid authorisation number!");

        const plausible_limit = 60000;
        if (auth_number > plausible_limit)
            throw new Error(`There is NO way the Romanian Ministry of Justice managed to issue more than ${plausible_limit} authorisations since 2026!`);

        this._authorisation_no = auth_number;
    }

    public get authorisation_no(): string | number {
        return this._authorisation_no;
    }

    public set authorisation_date(auth_date: Date) {
        // Law 178/1997 came in force in 1997 but we'll allow a small
        const lower_threshold = new Date(1990, 1, 1);
        const upper_threshold = new Date(); // today's date, whatever that may be

        if (auth_date < lower_threshold || auth_date > upper_threshold)
            throw new Error("Check that translator authorisation date again, something's wrong!")

        this._authorisation_date = auth_date;
    }

    public get translator_auth_date(): Date {
        return this._authorisation_date;
    }

    public set authorisation_languages(auth_langs: Language[]) {
        // NOTE: There is NO reason why `languages.ROMANIAN` should be in this list!
        if (auth_langs.includes(languages.ROMANIAN))
            throw new Error(`When setting the translator details, ${languages.ROMANIAN.EN} must not be included!`);

        this._authorisation_languages = auth_langs;
    }

    public get authorisation_languages(): Language[] {
        return this._authorisation_languages;
    }
}
