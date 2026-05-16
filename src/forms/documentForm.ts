import { DocumentDetails, text_part, document_heading } from "@/models/document_details";
import { languages, DualLingualText, type Language } from "@/models/translation";
import { safeSet } from "@/forms/common";

const documentFormId: string = "document-form";

const documentDetails = new DocumentDetails();

const container = document.getElementById(documentFormId)!;

// FIXME: Needs a better way of handling id's
container.innerHTML = `
    <h2>Document Details</h2>

    <div class="dual-column">
        <div class="col">
            <h3>Original Document</h3>

            <label for="${documentFormId}-document-language">Language</label>
            <select id="${documentFormId}-document-language">
                <option value="ENGLISH" selected>${languages.ENGLISH.EN}</option>
                <option value="FRENCH">${languages.FRENCH.EN}</option>
                <option value="ROMANIAN">${languages.ROMANIAN.EN}</option>
            </select>
            
            <label for="${documentFormId}-document-pages">Number of pages</label>
            <input type="number" id="${documentFormId}-document-pages" value="${documentDetails.number_of_pages}" />
            
            <label for="${documentFormId}-document-part">Document seen in</label>
            <select id="${documentFormId}-document-part">
                <option value="FULL" selected>${text_part.FULL.EN.toUpperCase()}</option>
                <option value="EXCERPT">${text_part.EXCERPT.EN.toUpperCase()}</option>
            </select>
        </div>
        <div class="divider"></div>
        <div class="col">
            <h3>Translation</h3>
            
            <label for="${documentFormId}-translation-language">Language</label>
            <select id="${documentFormId}-translation-language">
                <option value="ENGLISH">${languages.ENGLISH.EN}</option>
                <option value="FRENCH">${languages.FRENCH.EN}</option>
                <option value="ROMANIAN" selected>${languages.ROMANIAN.EN}</option>
            </select>
            
            <label for="${documentFormId}-translation-pages">Number of pages</label>
            <input type="number" id="${documentFormId}-translation-pages" value="${documentDetails.translated_number_of_pages}" />

            <label for="${documentFormId}-translation-part">Translation requested in</label>
            <select id="${documentFormId}-translation-part">
                <option value="FULL" selected>${text_part.FULL.EN.toUpperCase()}</option>
                <option value="EXCERPT">${text_part.EXCERPT.EN.toUpperCase()}</option>
            </select>
        </div>
    </div>

    <h2>Document Title</h2>

    <label for="${documentFormId}-document-heading">Choose document heading</label>
    <select id="${documentFormId}-document-heading">
        <option value="NAME" selected>${document_heading.NAME.EN.toUpperCase()}</option>
        <option value="TITLE">${document_heading.TITLE.EN.toUpperCase()}</option>
    </select>

    <div class="dual-column">
        <div class="col">
            <h3>Original Document</h3>

            <label for="${documentFormId}-document-name">Title</label>
            <input type="text" id="${documentFormId}-document-name" value="${documentDetails.document_name.EN}" />
            
            <label for="${documentFormId}-document-issuing_authority">Issuing Authority</label>
            <input type="text" id="${documentFormId}-document-issuing_authority" value="${documentDetails.issuing_authority.EN}" />
        </div>
        <div class="divider"></div>
        <div class="col">
            <h3>Translation</h3>

            <label for="${documentFormId}-translation-name">Title</label>
            <input type="text" id="${documentFormId}-translation-name" value="${documentDetails.document_name.RO}" />

            <label for="${documentFormId}-translation-issuing_authority">Issuing Authority</label>
            <input type="text" id="${documentFormId}-translation-issuing_authority" value="${documentDetails.issuing_authority.RO}" />
        </div>
    </div>

    <button id="${documentFormId}-validate">Validate</button>

    <label for="${documentFormId}-out">Validation Messages</label>
    <pre id="${documentFormId}-out">Validation not yet run</pre>
`;

export function validateDocumentDetails() {

    function getDocumentDetails(id: string) {
        // Original Document
        const number_of_pages = Number((document.getElementById(`${documentFormId}-${id}-pages`) as HTMLInputElement).value);

        const language_html = (document.getElementById(`${documentFormId}-${id}-language`) as HTMLSelectElement).value;
        const language = languages[language_html as keyof typeof languages];

        const doc_text_part_html = (document.getElementById(`${documentFormId}-${id}-part`) as HTMLSelectElement).value;
        const doc_text_part = text_part[doc_text_part_html as keyof typeof text_part];

        return {
            number_of_pages: number_of_pages,
            language: language,
            text_part: doc_text_part
        };
    }

    function constructDualLingualText(id: string, original_language: Language, translated_language: Language): DualLingualText {
        const document_title = (document.getElementById(`${documentFormId}-document-${id}`) as HTMLInputElement).value;
        const translation_title = (document.getElementById(`${documentFormId}-translation-${id}`) as HTMLInputElement).value;

        return new DualLingualText([original_language, document_title], [translated_language, translation_title]);
    }

    // Gather data
    const documentDetails = new DocumentDetails();

    // Details for the Original Document and the Translation
    const original_document_details = getDocumentDetails("document");
    const translation_details = getDocumentDetails("translation");

    const heading_html = (document.getElementById(`${documentFormId}-document-heading`) as HTMLSelectElement).value;
    const heading = document_heading[heading_html as keyof typeof document_heading];

    const document_name = constructDualLingualText("name", original_document_details.language, translation_details.language);
    const issuing_authority = constructDualLingualText("issuing_authority", original_document_details.language, translation_details.language);

    // Catch errors to alert the user
    const errors: string[] = [];
    safeSet(() => { documentDetails.number_of_pages = original_document_details.number_of_pages }, errors);
    safeSet(() => { documentDetails.document_language = original_document_details.language }, errors);
    safeSet(() => { documentDetails.text_seen_in = original_document_details.text_part }, errors);
    safeSet(() => { documentDetails.translated_number_of_pages = translation_details.number_of_pages }, errors);
    safeSet(() => { documentDetails.translation_language = translation_details.language }, errors);
    safeSet(() => { documentDetails.translation_requested_in = translation_details.text_part }, errors);
    safeSet(() => { documentDetails.document_heading = heading }, errors);
    safeSet(() => { documentDetails.document_name = document_name }, errors);
    safeSet(() => { documentDetails.issuing_authority = issuing_authority }, errors);

    // Object validation
    safeSet(() => { documentDetails.validateDocumentAndTranslationLanguages() }, errors);

    if (import.meta.env.DEV)
        console.log(documentDetails);

    const pre_out = document.getElementById(`${documentFormId}-out`)!;
    if (errors.length > 0) {
        const error_message: string = "Failed to validate the DocumentDetails:\n\n";
        pre_out.textContent = error_message + errors.join("\n");
        pre_out.style.color = "red";
    }
    else {
        pre_out.textContent = "Validation successful ✅";
        pre_out.style.color = "lightgreen";
    }

    return documentDetails;
}
document.getElementById(`${documentFormId}-validate`)!.addEventListener("click", validateDocumentDetails);