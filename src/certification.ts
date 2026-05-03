import { TranslatorDetails, genders } from "./translator_details";
import { DocumentDetails } from "./document_details";
import { PaymentDetails } from "./payment_details";

class Certification {
    public translator_details: TranslatorDetails;
    public document_details: DocumentDetails;
    public payment_details: PaymentDetails;

    public constructor() {
        this.translator_details = new TranslatorDetails();
        this.document_details = new DocumentDetails();
        this.payment_details = new PaymentDetails();
    }

    private certification_in_ro(): string[] {

        // NOTE: These only happen in Romanian, so I'm not going to handle it via `MultiLingualText` for now
        const language_suffix: string = this.translator_details.authorisation_languages.length == 1 ? "limba" : "limbile";
        const undersigned_N: string = this.translator_details.gender == genders.MALE ? "Subsemnatul" : "Subsemnata";
        const undersigned_G: string = this.translator_details.gender == genders.MALE ? "subsemnatului" : "subsemnatei";

        const paragraph_1: string =
            `${undersigned_N}, **${this.translator_details.name}**, interpret și traducător autorizat pentru ${language_suffix} 
            **${this.translator_details.authorisation_languages.map(x => x.RO).join(", ")}**, în temeiul Autorizației 
            nr. **${this.translator_details.authorisation_no}**, eliberată de Ministerul Justiției din România, certific 
            exactitatea traducerii efectuate din limba **${this.document_details.document_language.RO}** în limba 
            **${this.document_details.translation_language.RO}**, că textul prezentat a fost tradus complet, fără 
            omisiuni, și că, prin traducere, înscrisului nu i-au fost denaturate conținutul și sensul.`;

        const paragraph_2: string =
            `Înscrisul a cărui traducere se solicită în **${this.document_details.translation_requested_in.RO}** are, în 
            integralitatea sa, un număr de **${this.document_details.number_of_pages}** 
            ${this.document_details.page_suffix.RO}, poartă **${this.document_details.document_heading.RO}** de 
            **\"${this.document_details.document_name.RO}\"**, a fost emis de 
            **\"${this.document_details.issuing_authority.RO}\"** și mi-a fost prezentat mie în 
            **${this.document_details.text_seen_in.RO}**.`;

        const paragraph_3: string = 
            `Traducerea înscrisului prezentat are un număr de **${this.document_details.translated_number_of_pages}** 
            ${this.document_details.translated_page_suffix.RO} și a fost efectuată potrivit cererii scrise înregistrate 
            cu nr. **${this.payment_details.translation_request_id}\/${this.payment_details.translation_request_date}**, 
            păstrate în arhiva ${undersigned_G}.`;

        const paragraph_4: string = 
            `S-a încasat onorariul de **${(this.payment_details.payment_amount_in_cents / 100).toFixed(2)}** lei, cu 
            **${this.payment_details.payment_method.RO}** nr. 
            **${this.payment_details.payment_id}\/${this.payment_details.payment_date}**.`;

        const last_paragraph: string = 
            `**INTERPRET ȘI TRADUCĂTOR AUTORIZAT,\n${this.translator_details.name}\n(semnătura, ștampila)**`;

        return [paragraph_1, paragraph_2, paragraph_3, paragraph_4, last_paragraph];
    }

    private certification_in_en(): string[] {
        const paragraph_1: string = 
            `I, the undersigned, **${this.translator_details.name}**, a certified translator and interpreter for 
            **${this.translator_details.authorisation_languages.map(x => x.EN).join(", ")}**, pursuant to Authorisation 
            No. **${this.translator_details.authorisation_no}** issued by the Romanian Ministry of Justice on 
            **${this.translator_details.translator_auth_date}**, hereby certify the accuracy of this translation from 
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
            registered nuder no. **${this.payment_details.translation_request_id}\/${this.payment_details.translation_request_date}**, 
            which are kept in the undersigned's archive.`;

        const paragraph_4: string = 
            `Translation fees: **${(this.payment_details.payment_amount_in_cents / 100).toFixed(2)}** RON, with 
            **${this.payment_details.payment_method.EN}** no. 
            **${this.payment_details.payment_id}\/${this.payment_details.payment_date}**.`;

        const last_paragraph: string = 
            `**CERTIFIED TRANSLATOR AND INTERPRETER,\n${this.translator_details.name}\n(Stamp and signature)**`;

        return [paragraph_1, paragraph_2, paragraph_3, paragraph_4, last_paragraph];
    }
}