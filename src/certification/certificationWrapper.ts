import { validateTranslator } from "@/forms/translatorForm";
import { validateDocumentDetails } from "@/forms/documentForm";
import { validatePaymentForm } from "@/forms/paymentForm";

import { Certification } from "@/certification/certification";

import { saveAs } from "file-saver";

const certificationId: string = "certification";

const container = document.getElementById(certificationId)!;
container.innerHTML = `
    <button id="${certificationId}-validation">Validate all forms</button>
    <button id="${certificationId}-generate">Generate .docx</button>
    <label class="checkbox">
        <input type="checkbox" id="${certificationId}-legalisation">
        Include Legalisation
    </label>
`;

function validateAll() {
    validateTranslator();
    validateDocumentDetails();
    validatePaymentForm();
}
document.getElementById(`${certificationId}-validation`)!.addEventListener("click", validateAll);

// FIXME: Found a bug - the certification is still being generated, even though the validation failed !
async function generateCertification() {
    const certification = new Certification();
    certification.translator_details = validateTranslator();
    certification.document_details = validateDocumentDetails();
    certification.payment_details = validatePaymentForm();

    // Get state of checkbox for whether or not to include the legalisation text
    const add_legalisation_certification = (document.getElementById(`${certificationId}-legalisation`) as HTMLInputElement).checked;
    certification.add_legalisation_certification = add_legalisation_certification;

    const blob = await certification.getCertification();
    saveAs(blob, "Încheiere de traducător.docx");
}
document.getElementById(`${certificationId}-generate`)!.addEventListener("click", generateCertification);