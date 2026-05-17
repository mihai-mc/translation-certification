import { TranslatorDetails, genders } from "@/models/translator_details";
import { DocumentDetails } from "@/models/document_details";
import { PaymentDetails } from "@/models/payment_details";

import { languages } from "@/models/translation";
import type { Language } from "@/models/translation";

import { Document, Paragraph, TextRun, AlignmentType, Packer } from "docx";

function date_to_string(date: Date): string {

    const DD: string = String(date.getDate()).padStart(2, "0");
    const MM: string = String(date.getMonth() + 1).padStart(2, "0");  // NOTE: Remember, months are 0-indexed -_-
    const YYYY: string = String(date.getFullYear());

    return `${DD}.${MM}.${YYYY}`;
}

function normal(_text: string): TextRun {
    return new TextRun({
        text: _text,
        size: 24
    });
}

function bold(_text: string): TextRun {
    return new TextRun({
        text: _text,
        bold: true,
        size: 24
    });
}

function new_paragraph(_paragraphs: TextRun[] = []): Paragraph {
    return new Paragraph({
        children: _paragraphs,
        alignment: AlignmentType.JUSTIFIED,
    });
}

function centredParagraph(_paragraphs: TextRun[]): Paragraph {
    return new Paragraph({
        children: _paragraphs,
        alignment: AlignmentType.CENTER,
    });
}

function new_line(num_spaces: number = 1): Paragraph[] {
    return Array.from({ length: num_spaces }, () => new_paragraph());
}

export class Certification {
    public translator_details: TranslatorDetails;
    public document_details: DocumentDetails;
    public payment_details: PaymentDetails;

    public add_legalisation_certification: boolean;

    // FIXME: Should add some tests to ensure the thing works end-to-end
    public constructor() {
        this.translator_details = new TranslatorDetails();
        this.document_details = new DocumentDetails();
        this.payment_details = new PaymentDetails();

        this.add_legalisation_certification = false;
    }

    private certification_text(lang: Language): Paragraph[] {
        switch (lang) {
            case languages.ROMANIAN: return this.certification_in_ro();
            case languages.ENGLISH: return this.certification_in_en();
            case languages.FRENCH: return this.certification_in_fr();
            default: throw new Error(`There is no certification text for ${lang.EN} !`);
        }
    }

    private legalisation_text(lang: Language): Paragraph[] {
                switch (lang) {
            case languages.ROMANIAN: return this.legalisation_in_ro();
            case languages.ENGLISH: return this.legalisation_in_en();
            case languages.FRENCH: return this.legalisation_in_fr();
            default: throw new Error(`There is no legalisation text for ${lang.EN} !`);
        }
    }

    public async getCertification(): Promise<Blob> {
        // Certification in RO
        const paragraphs: Paragraph[] = this.certification_text(languages.ROMANIAN);

        // Number of spaces to add each time
        const num_spaces: number = 10;
        
        if(this.add_legalisation_certification) {
            // Legalisation text in RO
            paragraphs.push(...new_line(num_spaces));
            paragraphs.push(...this.legalisation_text(languages.ROMANIAN));
        }

        // NOTE: Only add second certification if the translation is done from RO to a foreign language
        const translation_lang = this.document_details.translation_language;
        if (translation_lang != languages.ROMANIAN) {

            // Certification in the foreign language
            paragraphs.push(...new_line(num_spaces));
            paragraphs.push(...this.certification_text(translation_lang));

            if(this.add_legalisation_certification) {
                // Legalisation text in the foreign language
                paragraphs.push(...new_line(num_spaces));
                paragraphs.push(...this.legalisation_text(translation_lang));
            }
        }

        const certification_document = new Document({ sections: [{ children: paragraphs }] });

        return await Packer.toBlob(certification_document);
    }

    private certification_in_ro(): Paragraph[] {

        // NOTE: These only happen in Romanian and French, so I'm not going to handle it via `MultiLingualText` for now
        const language_suffix: string = this.translator_details.authorisation_languages.length == 1 ? "limba" : "limbile";
        const undersigned_N: string = this.translator_details.gender == genders.MALE ? "Subsemnatul" : "Subsemnata";
        const undersigned_G: string = this.translator_details.gender == genders.MALE ? "subsemnatului" : "subsemnatei";

        const paragraph_1: Paragraph = new_paragraph([
            normal(`\t${undersigned_N}, `),
            bold(`${this.translator_details.name}`),
            normal(`, interpret și traducător autorizat pentru ${language_suffix} `),
            bold(`${this.translator_details.authorisation_languages.map(x => x.RO).join(", ")}`),
            normal(`, în temeiul Autorizației nr. `),
            bold(`${this.translator_details.authorisation_no}`),
            normal(` din data de `),
            bold(`${date_to_string(this.translator_details.translator_auth_date)}`),
            normal(`, eliberată de Ministerul Justiției din România, certific exactitatea traducerii efectuate din limba `),
            bold(`${this.document_details.document_language.RO}`),
            normal(` în limba `),
            bold(`${this.document_details.translation_language.RO}`),
            normal(`, că textul prezentat a fost tradus complet, fără omisiuni, și că, prin traducere, înscrisului nu i-au fost denaturate conținutul și sensul.`)
        ]);

        const paragraph_2: Paragraph = new_paragraph([
            normal(`\tÎnscrisul a cărui traducere se solicită în `),
            bold(`${this.document_details.translation_requested_in.RO}`),
            normal(` are, în integralitatea sa, un număr de `),
            bold(`${this.document_details.number_of_pages}`),
            normal(` ${this.document_details.page_suffix.RO}, poartă `),
            bold(`${this.document_details.document_heading.RO}`),
            normal(` de `),
            bold(`\"${this.document_details.document_name.RO}\"`),
            normal(` a fost emis de `),
            bold(`\"${this.document_details.issuing_authority.RO}\"`),
            normal(` și mi-a fost prezentat mie în `),
            bold(`${this.document_details.text_seen_in.RO}`),
            normal(`.`)
        ]);

        const paragraph_3: Paragraph = new_paragraph([
            normal(`\tTraducerea înscrisului prezentat are un număr de `),
            bold(`${this.document_details.translated_number_of_pages}`),
            normal(` ${this.document_details.translated_page_suffix.RO} și a fost efectuată potrivit cererii scrise înregistrate cu nr. `),
            bold(`${this.payment_details.translation_request_id}\/${date_to_string(this.payment_details.translation_request_date)}`),
            normal(`, păstrate în arhiva ${undersigned_G}.`),
        ]);

        const paragraph_4: Paragraph = new_paragraph([
            normal(`\tS-a încasat onorariul de `),
            bold(`${(this.payment_details.payment_amount_in_cents / 100).toFixed(2)}`),
            normal(` lei, cu `),
            bold(`${this.payment_details.payment_method.RO}`),
            normal(` nr. `),
            bold(`${this.payment_details.payment_id}\/${date_to_string(this.payment_details.payment_date)}`),
            normal(`.`)
        ]);

        const last_paragraphs: Paragraph[] = [
            centredParagraph([bold(`INTERPRET ȘI TRADUCĂTOR AUTORIZAT,`)]),
            centredParagraph([bold(`${this.translator_details.name}`)]),
            centredParagraph([bold(`(semnătura, ștampila)`)])
        ];

        return [paragraph_1, paragraph_2, paragraph_3, paragraph_4, ...new_line(), ...last_paragraphs];
    }

    private certification_in_en(): Paragraph[] {

        const paragraph_1: Paragraph = new_paragraph([
            normal(`I, the undersigned, `),
            bold(`${this.translator_details.name}`),
            normal(`, a certified translator and interpreter for `),
            bold(`${this.translator_details.authorisation_languages.map(x => x.EN).join(", ")}`),
            normal(`, pursuant to Authorisation No. `),
            bold(`${this.translator_details.authorisation_no}`),
            normal(` issued by the Romanian Ministry of Justice on `),
            bold(`${date_to_string(this.translator_details.translator_auth_date)}`),
            normal(`, hereby certify the accuracy of this translation from `),
            bold(`${this.document_details.document_language.EN}`),
            normal(` into `),
            bold(`${this.document_details.translation_language.EN}`),
            normal(`, that the entire text was translated, without omissions, and that the content and the meaning of the document were not altered through translation.`)
        ]);

        const paragraph_2: Paragraph = new_paragraph([
            normal(`The document for which the translation is required in `),
            bold(`${this.document_details.translation_language.EN}`),
            normal(` has, in its entirerity, a total of `),
            bold(`${this.document_details.number_of_pages}`),
            normal(` ${this.document_details.page_suffix.EN}, bears the `),
            bold(`${this.document_details.document_heading.EN}`),
            normal(` of `),
            bold(`\"${this.document_details.document_name.EN}\"`),
            normal(`, was issued by `),
            bold(`\"${this.document_details.issuing_authority.EN}\"`),
            normal(` and was presented to me in `),
            bold(`${this.document_details.text_seen_in.EN}`),
            normal(`.`)
        ]);

        const paragraph_3: Paragraph = new_paragraph([
            normal(`The translation of the document has a total of `),
            bold(`${this.document_details.translated_number_of_pages}`),
            normal(` ${this.document_details.translated_page_suffix.EN} and was carried out according to the written request registered nuder no. `),
            bold(`${this.payment_details.translation_request_id}\/${date_to_string(this.payment_details.translation_request_date)}`),
            normal(`, which are kept in the undersigned's archive.`)
        ]);

        const paragraph_4: Paragraph = new_paragraph([
            normal(`Translation fees: `),
            bold(`${(this.payment_details.payment_amount_in_cents / 100).toFixed(2)}`),
            normal(` RON, with `),
            bold(`${this.payment_details.payment_method.EN}`),
            normal(` no. `),
            bold(`${this.payment_details.payment_id}\/${date_to_string(this.payment_details.payment_date)}`),
            normal(`.`)
        ]);

        const last_paragraphs: Paragraph[] = [
            centredParagraph([bold(`CERTIFIED TRANSLATOR AND INTERPRETER,`)]),
            centredParagraph([bold(`${this.translator_details.name}`)]),
            centredParagraph([bold(`(stamp and signature)`)])
        ];

        return [paragraph_1, ...new_line(), paragraph_2, ...new_line(), paragraph_3, ...new_line(), paragraph_4, ...new_line(), ...last_paragraphs];
    }

    private certification_in_fr(): Paragraph[] {

        // NOTE: These only happen in Romanian and French, so I'm not going to handle it via `MultiLingualText` for now
        const undersigned_N: string = this.translator_details.gender == genders.MALE ? "Le soussigné" : "La sousignée";
        const undersigned_G: string = this.translator_details.gender == genders.MALE ? "du soussigné" : "de la sousignée";
        const language_suffix: string = this.translator_details.authorisation_languages.length == 1 ? "la langue" : "les langues";

        const paragraph_1: Paragraph = new_paragraph([
            normal(`\t${undersigned_N}, `),
            bold(`${this.translator_details.name}`),
            normal(` interprète et traducteur assermenté pour ${language_suffix} `),
            bold(`${this.translator_details.authorisation_languages.map(x => x.FR).join(", ")}`),
            normal(`, en vertu de l'authorisation nº `),
            bold(`${this.translator_details.authorisation_no}`),
            normal(` du `),
            bold(`${date_to_string(this.translator_details.translator_auth_date)}`),
            normal(`, delivrée par le Ministère de la Joustice de Roumanie, certifie l'exactitude de la traduction realisée du `),
            bold(`${this.document_details.document_language.FR}`),
            normal(` en `),
            bold(`${this.document_details.translation_language.FR}`),
            normal(`, que le texte presenté a été complètement traduit, sans omissions et que par le processus de traduction son contenu et le sens du document n'ont pas été altérés.`)
        ]);

        const paragraph_2: Paragraph = new_paragraph([
            normal(`\tLe document dont la traduction est demandée `),
            bold(`${this.document_details.translation_requested_in.FR}`),
            normal(` comporte, dans son intégralité, un nombre de `),
            bold(`${this.document_details.number_of_pages}`),
            normal(` ${this.document_details.page_suffix.FR}, porte `),
            bold(`${this.document_details.document_heading.FR}`),
            normal(` de `),
            bold(`« ${this.document_details.document_name.FR} »`),
            normal(`, a été délivré par `),
            bold(`« ${this.document_details.issuing_authority.FR} »`),
            normal(` et m'a été presenté `),
            bold(`${this.document_details.text_seen_in.FR}`),
            normal(`.`)
        ]);

        const paragraph_3: Paragraph = new_paragraph([
            normal(`\tLa traduction de ce document a un nombre de `),
            bold(`${this.document_details.translated_number_of_pages}`),
            normal(` ${this.document_details.translated_page_suffix.FR} et a été realisée conformément à la demande écrite enregistrée sous le nº `),
            bold(`${this.payment_details.translation_request_id}\/${date_to_string(this.payment_details.translation_request_date)}`),
            normal(`, gardée dans l'archive ${undersigned_G}.`)
        ]);

        const paragraph_4: Paragraph = new_paragraph([
            normal(`\tFrais de traduction: `),
            bold(`${(this.payment_details.payment_amount_in_cents / 100).toFixed(2)}`),
            normal(` RON, conformément `),
            bold(`${this.payment_details.payment_method.FR}`),
            normal(` nº `),
            bold(`${this.payment_details.payment_id}\/${date_to_string(this.payment_details.payment_date)}`),
            normal(`.`)
        ]);

        const last_paragraphs: Paragraph[] = [
            centredParagraph([bold(`INTERPRÈTE ET TRADUCTEUR ASSERMENTÉ,`)]),
            centredParagraph([bold(`${this.translator_details.name}`)]),
            centredParagraph([bold(`(signature, tampon)`)])
        ];

        return [paragraph_1, paragraph_2, paragraph_3, paragraph_4, ...new_line(), ...last_paragraphs];
    }

    private legalisation_in_ro(): Paragraph[] {

        const opening_paragraphs = [
            new_paragraph([bold(`ROMÂNIA`)]),
            new_paragraph([bold(`Uniunea Națională a Notarilor Publici`)]),
            new_paragraph([normal(`Birou Notarial .........................................`)]),
            new_paragraph([normal(`Licența de funcționare nr. .......................`)]),
            new_paragraph([normal(`Sediul ......................................................`)]),
        ];

        const title: Paragraph[] = [
            ...new_line(),
            centredParagraph([bold(`ÎNCHEIERE DE LEGALIZARE A SEMNĂTURII TRADUCĂTORULUI NR. .....`)]),
            centredParagraph([normal(`Anul ............ luna ............ ziua ............`)]),
            ...new_line()
        ];

        const paragraph_1: Paragraph = new_paragraph([
            normal(`\t...................................., notar public, în temeiul art. 12 lit. j) din Legea Notarilor publici și a activității notariale nr. 36/1995, republicată, cu modificările ulterioare, legalizez semnătura de mai sus, apaținând lui `),
            bold(`${this.translator_details.name}`),
            normal(`, interpret și traducător autorizat în baza .................................................., de pe cele ...... exemplare ale înscrisului, care are ca parte integrantă o copie a actului tradus.`)
        ]);

        const paragraph_2: Paragraph = new_paragraph([
            normal(`\tÎnscrisul a cărui traducere se solicită este un înscris ........................ .`)
        ]);

        const paragraph_3: Paragraph = new_paragraph([
            normal(`\tS-a încasat onorariul de ............ lei, cu chitanță/bon fiscal/ordin de plată nr. ............ .`)
        ]);

        const last_paragraphs: Paragraph[] = [
            centredParagraph([bold(`Notar public,`)]),
            centredParagraph([normal(`........................`)]),
            centredParagraph([normal(`L.S.`)])
        ];

        return [...opening_paragraphs, ...title, paragraph_1, paragraph_2, paragraph_3, ...new_line(), ...last_paragraphs];
    }

    private legalisation_in_en(): Paragraph[] {
        const opening_paragraphs = [
            new_paragraph([bold(`ROMANIA`)]),
            new_paragraph([bold(`The National Union of Notaries Public`)]),
            new_paragraph([normal(`Notary Office ...........................................`)]),
            new_paragraph([normal(`Operating Licence no. ..............................`)]),
            new_paragraph([normal(`Registered Address ...................................`)]),
        ];

        const title: Paragraph[] = [
            ...new_line(),
            centredParagraph([bold(`LEGALISATION OF THE TRANSLATOR'S SIGNATURE NO. .....`)]),
            centredParagraph([normal(`Year ............ month ............ day ............`)]),
            ...new_line()
        ];

        const paragraph_1: Paragraph = new_paragraph([
            normal(`I, the undersigned, ...................................., notary public, pursuant to Art. 12 letter j) of Law no. 36/1995 of the Public Notaries and Notarial Activity, republished, with its subsequent changes and alterations, hereby legalise the above signature, belonging to `),
            bold(`${this.translator_details.name}`),
            normal(`, certified translator and interpreter according to .................................................., on the ...... copies of the document, that includes a copy of the document that was translated as an integral part.`)
        ]);

        const paragraph_2: Paragraph = new_paragraph([
            normal(`The document for which translation is requested is a ........................ .`)
        ]);

        const paragraph_3: Paragraph = new_paragraph([
            normal(`Notary fees: ............ RON, with slip/receipt/payment order no. ............ .`)
        ]);

        const last_paragraphs: Paragraph[] = [
            centredParagraph([bold(`Notary Public,`)]),
            centredParagraph([normal(`........................`)]),
            centredParagraph([normal(`L.S.`)])
        ];

        return [...opening_paragraphs, ...title, paragraph_1, ...new_line(), paragraph_2, ...new_line(), paragraph_3, ...new_line(), ...last_paragraphs];
    }

    private legalisation_in_fr(): Paragraph[] {

        const opening_paragraphs = [
            new_paragraph([bold(`ROUMANIE`)]),
            new_paragraph([bold(`L'Union nationale des Notaires Publics`)]),
            new_paragraph([normal(`Bureau de Notaire ....................................`)]),
            new_paragraph([normal(`Authorisation de fonctionnement nº ........`)]),
            new_paragraph([normal(`Siège ........................................................`)]),
        ];

        const title: Paragraph[] = [
            ...new_line(),
            centredParagraph([bold(`LEGALISATION DE LA SIGNATURE DU TRADUCTEUR Nº .....`)]),
            centredParagraph([normal(`Année ............ mois ............ jour ............`)]),
            ...new_line()
        ];

        const paragraph_1: Paragraph = new_paragraph([
            normal(`\t...................................., Notaire Public, en vertu de l'art. 12 let. j) de la Loi des Notaires Publics et de l'activité notariale nº 36/1995, republiée, avec ses modifications ultériueres, légalise la signature au-dessus appartenant à `),
            bold(`${this.translator_details.name}`),
            normal(`, interprète et traducteur assermenté sur la base du .................................................., sur le(s) ...... copie(s) du document, qui a en tant que partie intégrante une copie de l'acte traduit.`)
        ]);

        const paragraph_2: Paragraph = new_paragraph([
            normal(`\tLe document dont la traduction est demandé est un document ........................ .`)
        ]);

        const paragraph_3: Paragraph = new_paragraph([
            normal(`\tFrais notarielles: ............ RON, avec reçu/justificatif fiscale/ordre de virement nº ............ .`)
        ]);

        const last_paragraphs: Paragraph[] = [
            centredParagraph([bold(`Notaire Public,`)]),
            centredParagraph([normal(`........................`)]),
            centredParagraph([normal(`L.S.`)])
        ];

        return [...opening_paragraphs, ...title, paragraph_1, paragraph_2, paragraph_3, ...new_line(), ...last_paragraphs];
    }
}