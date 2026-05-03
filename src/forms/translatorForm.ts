import { TranslatorDetails, genders } from "@/models/translator_details";
import { languages } from "@/models/translation";

export const translatorFormId: string = "translator-form";

const translator = new TranslatorDetails();

const container = document.getElementById(translatorFormId);

container!.innerHTML = `
    <h2>Translator Details</h2>

    <label for="name">Translator Name</label>
    <input type="text" id="${translatorFormId}-name" value="${translator.name}" />

    <label for="gender">Gender</label>
    <select id="${translatorFormId}-gender">
        <option value="${genders.MALE}">${genders.MALE}</option>
        <option value="${genders.FEMALE}">${genders.FEMALE}</option>
    </select>

    <label for="auth_no">Authorisation Number</label>
    <input type="text" id="${translatorFormId}-auth_no" value="${translator.authorisation_no}"/>

    <label for="auth_date">Authorisation Date</label>
    <input type="date" id="${translatorFormId}-auth_date" value="${translator.translator_auth_date.toISOString().split("T")[0]}"/>

    <label for="auth_languages">Authorised Languages</label>
    <select id="${translatorFormId}-auth_languages" multiple>
        <option value="ENGLISH" selected>${languages.ENGLISH.EN}</option>
        <!-- <option value="ROMANIAN">${languages.ROMANIAN.EN}</option> -->
    </select>

    <button id="${translatorFormId}-validate">Validate</button>

    <label for="${translatorFormId}-out">Validation Messages</label>
    <pre id="${translatorFormId}-out">Empty</pre>
`;

function safeSet<T>(func: () => void, errors: string[]) {
    try {
        func();
    }
    catch (e) {
        errors.push((e as Error).message);
    }
}

function validateTranslator() {

    // Gather data
    const translatorDetails = new TranslatorDetails();

    const name = (document.getElementById(`${translatorFormId}-name`) as HTMLInputElement).value;
    const auth_no = (document.getElementById(`${translatorFormId}-auth_no`) as HTMLInputElement).value;
    const auth_date = new Date((document.getElementById(`${translatorFormId}-auth_date`) as HTMLInputElement).value);
    
    const gender_html = (document.getElementById(`${translatorFormId}-gender`) as HTMLSelectElement).value;
    const gender = genders[gender_html as keyof typeof genders];

    const langs_html = (document.getElementById(`${translatorFormId}-auth_languages`) as HTMLSelectElement).selectedOptions;
    const langs = Array.from(langs_html).map(o => languages[o.value as keyof typeof languages]);

    // Catch errors to alert the user
    const errors: string[] = [];
    safeSet(() => {translatorDetails.name = name}, errors);
    safeSet(() => {translatorDetails.gender = gender}, errors);
    safeSet(() => {translatorDetails.authorisation_no = auth_no}, errors);
    safeSet(() => {translatorDetails.authorisation_date = auth_date}, errors);
    safeSet(() => {translatorDetails.authorisation_languages = langs}, errors);

    if(import.meta.env.DEV)
        console.log(translatorDetails);

    const pre_out = document.getElementById(`${translatorFormId}-out`)!;
    if (errors.length > 0) {
        const error_message: string = "Failed to validate the TranslatorDetails:\n\n";
        pre_out.textContent = error_message + errors.join("\n");
        pre_out.style.color = "red";
    }
    else {
        pre_out.textContent = "Validation successful ✅";
        pre_out.style.color = "lightgreen";
    }
}
document.getElementById(`${translatorFormId}-validate`)!.addEventListener("click", validateTranslator);