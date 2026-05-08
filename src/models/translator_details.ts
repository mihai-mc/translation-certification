import { languages } from "@/models/translation";
import type { Language } from "@/models/translation";

export const genders = Object.freeze({
    MALE: "MALE",
    FEMALE: "FEMALE"
} as const);

export type Gender = typeof genders[keyof typeof genders];

export class TranslatorDetails {
    private _name: string;
    private _gender: Gender;
    private _authorisation_no: string;
    private _authorisation_date: Date;
    private _authorisation_languages: Language[];

    public constructor() {
        this._name = "OLTEANU Mihai-Cristian";
        this._gender = genders.MALE;
        this._authorisation_no = "39429";
        this._authorisation_date = new Date(2026, 4, 7); // NOTE: months are 0-indexed for some obscure reason
        this._authorisation_languages = [languages.ENGLISH];
    }

    public set name(otherName: string) {
        const character_limit: number = 128
        if (otherName.length >= character_limit)
            throw new Error(`Please trim input to strictly under ${character_limit} characters`);
        if(otherName.length === 0)
            throw new Error("You forgot to add the translator's name");

        this._name = otherName;
    }

    public get name(): string {
        return this._name;
    }

    public set gender(otherGender: Gender) {
        this._gender = otherGender;
    }

    public get gender(): Gender {
        return this._gender;
    }

    public set authorisation_no(auth_no: string) {
        // NOTE: Sometimes, the Romanian Ministry of Justice (MJ) issues numbers that are NOT numbers
        //       In such cases, the "*bis" suffix is added. Cute, I know...
        const other_auth_no = auth_no;

        const MJ_suffix = "bis";
        if (auth_no.endsWith(MJ_suffix))
            auth_no = auth_no.slice(0, -MJ_suffix.length);

        const auth_number = Number(auth_no);
        if (!Number.isInteger(auth_number) || auth_number < 0)
            throw new Error("That's not a valid authorisation number!");

        const plausible_limit = 60000;
        if (auth_number > plausible_limit)
            throw new Error(`There is NO way the Romanian Ministry of Justice managed to issue more than ${plausible_limit} authorisations since 2026!`);

        // If everything passed, assign the original/unaltered authorisation number we had saved at the beginning
        this._authorisation_no = other_auth_no;
    }

    public get authorisation_no(): string {
        return this._authorisation_no;
    }

    public set authorisation_date(auth_date: Date) {
        // Law 178/1997 came in force in 1997 but we'll allow a small
        const lower_threshold = new Date(1990, 0, 1);  // NOTE: Months are 0-indexed for some obscure reason
        const upper_threshold = new Date(); // today's date, whatever that may be

        if (auth_date < lower_threshold || auth_date > upper_threshold)
            throw new Error("Check that translator authorisation date again, something's wrong!")

        this._authorisation_date = new Date(auth_date);
    }

    public get translator_auth_date(): Date {
        return new Date(this._authorisation_date);
    }

    public set authorisation_languages(auth_langs: Language[]) {

        if (auth_langs.length === 0)
            throw new Error("At least one language must be provided for the translator");

        const languages_set = new Set(Object.values(languages));
        for (const auth_lang of auth_langs)
            if(!languages_set.has(auth_lang))
                throw new Error("That's not a valid option for the authorised languages");

        // NOTE: There is NO reason why `languages.ROMANIAN` should be in this list!
        if (auth_langs.includes(languages.ROMANIAN))
            throw new Error(`When setting the translator details, ${languages.ROMANIAN.EN} must not be included!`);

        this._authorisation_languages = [...auth_langs];
    }

    public get authorisation_languages(): Language[] {
        return [... this._authorisation_languages];
    }
}
