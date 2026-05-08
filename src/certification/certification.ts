import { TranslatorDetails, genders } from "@/models/translator_details";
import { DocumentDetails } from "@/models/document_details";
import { PaymentDetails } from "@/models/payment_details";

import { Document, Paragraph, TextRun, AlignmentType, Packer } from "docx";
import { languages } from "@/models/translation";

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
    return Array.from({length: num_spaces}, () => new_paragraph());
}

export class Certification {
    public translator_details: TranslatorDetails;
    public document_details: DocumentDetails;
    public payment_details: PaymentDetails;

    // FIXME: Should add some tests to ensure the thing works end-to-end
    public constructor() {
        this.translator_details = new TranslatorDetails();
        this.document_details = new DocumentDetails();
        this.payment_details = new PaymentDetails();
    }

    public async getCertification(): Promise<Blob> {
        const paragraphs: Paragraph[] = this.certification_in_ro();

        // NOTE: Only add second certification if the translation is done from RO to a foreign language
        if (this.document_details.translation_language != languages.ROMANIAN) {
            // Some spacing
            const num_spaces: number = 12;
            
            const additional_paragraphs = this.certification_in_en();

            // Append
            paragraphs.push(...new_line(num_spaces));
            paragraphs.push(...additional_paragraphs);
        }

        const certification_document = new Document({sections: [{children: paragraphs}]});

        return await Packer.toBlob(certification_document);
    }

    private certification_in_ro(): Paragraph[] {

        // NOTE: These only happen in Romanian, so I'm not going to handle it via `MultiLingualText` for now
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
        const paragraph_1: string = 
            `I, the undersigned, **${this.translator_details.name}**, a certified translator and interpreter for 
            **${this.translator_details.authorisation_languages.map(x => x.EN).join(", ")}**, pursuant to Authorisation 
            No. **${this.translator_details.authorisation_no}** issued by the Romanian Ministry of Justice on 
            **${date_to_string(this.translator_details.translator_auth_date)}**, hereby certify the accuracy of this translation from 
            **${this.document_details.document_language.EN}** into ${this.document_details.translation_language.EN}, 
            that the entire text was translated, without omissions, and that the content and the meaning of the document
            were not altered through translation.`;

        const paragraph_2: string = 
            `The document for which the translation is required in **${this.document_details.translation_language.EN}** 
            has, in its entirerity, a total of **${this.document_details.number_of_pages}** 
            ${this.document_details.page_suffix.EN}, bears the **${this.document_details.document_heading.EN}** of 
            **\"${this.document_details.document_name.EN}\"**, was issued by 
            **\"${this.document_details.issuing_authority.EN}\"** and was presented to me in 
            **${this.document_details.text_seen_in.EN}**.`;

        const paragraph_3: string = 
            `The translation of the document has a total of **${this.document_details.translated_number_of_pages}** 
            ${this.document_details.translated_page_suffix.EN} and was carried out according to the written request 
            registered nuder no. **${this.payment_details.translation_request_id}\/${date_to_string(this.payment_details.translation_request_date)}**, 
            which are kept in the undersigned's archive.`;

        const paragraph_4: string = 
            `Translation fees: **${(this.payment_details.payment_amount_in_cents / 100).toFixed(2)}** RON, with 
            **${this.payment_details.payment_method.EN}** no. 
            **${this.payment_details.payment_id}\/${this.payment_details.payment_date}**.`;

        const last_paragraph: string = 
            `**CERTIFIED TRANSLATOR AND INTERPRETER,\n${this.translator_details.name}\n(Stamp and signature)**`;

        // return [paragraph_1, paragraph_2, paragraph_3, paragraph_4, last_paragraph];
        throw new Error("Not implemented");
    }
}