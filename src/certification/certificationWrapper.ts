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
`;

function validateAll() {
    validateTranslator();
    validateDocumentDetails();
    validatePaymentForm();
}
document.getElementById(`${certificationId}-validation`)!.addEventListener("click", validateAll);

async function generateCertification() {
    const certification = new Certification();
    certification.translator_details = validateTranslator();
    certification.document_details = validateDocumentDetails();
    certification.payment_details = validatePaymentForm();

    const blob = await certification.getCertification();
    saveAs(blob, "certification.docx");
}
document.getElementById(`${certificationId}-generate`)!.addEventListener("click", generateCertification);