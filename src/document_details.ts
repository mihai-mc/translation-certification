import { MultiLingualText, languages } from "./translation";


const page_suffix = Object.freeze({
    SINGULAR: new MultiLingualText("pagină", "page"),
    PLURAL: new MultiLingualText("pagini", "pages"),
}) satisfies Readonly<Record<string, MultiLingualText>>;

type PageSuffix = typeof page_suffix[keyof typeof page_suffix];

const text_part = Object.freeze({
    FULL: new MultiLingualText("întregime", "full"),
    EXCERPT: new MultiLingualText("extras", "excerpt"),
}) satisfies Readonly<Record<string, MultiLingualText>>;

type TextPart = typeof text_part[keyof typeof text_part];

const document_heading = Object.freeze({
    NAME: new MultiLingualText("denumirea", "name"),
    TITLE: new MultiLingualText("titlul", "title"),
}) satisfies Readonly<Record<string, MultiLingualText>>;

type DocumentHeading = typeof document_heading[keyof typeof document_heading];


class DocumentDetails {
    private _number_of_pages: number;
    private _translated_number_of_pages: number;
    private _text_seen_in: TextPart;
    private _translation_requested_in: TextPart;
    private _document_heading: DocumentHeading;

    private _document_name: MultiLingualText;
    private _issuing_authority: MultiLingualText;

    private _document_language: MultiLingualText;
    private _translation_language: MultiLingualText;

    public constructor() {
        this._number_of_pages = 1;
        this._translated_number_of_pages = 1;
        this._text_seen_in = text_part.FULL;
        this._translation_requested_in = text_part.FULL;
        this._document_heading = document_heading.NAME;
        this._document_name = new MultiLingualText("Document neintitulat", "Untitled document");
        this._issuing_authority = new MultiLingualText("Autoritate emitentă", "Issuing Authority");
        this._document_language = languages.ROMANIAN;
        this._translation_language = languages.ENGLISH;
    }

    // NOTE: Helper function to avoid logic duplication
    private validateNumberOfPages(n: number) {
        if (n <= 0 || !Number.isInteger(n))
            throw new Error("Invalid number of pages");
        const upper_threshold: number = 100000;
        if (n > upper_threshold)
            throw new Error(`There is no way on Earth you translated more than ${upper_threshold} pages`);
        return;
    }

    public set number_of_pages(no_of_pages: number) {
        this.validateNumberOfPages(no_of_pages);
        this._number_of_pages = no_of_pages;
    }

    public get number_of_pages(): number {
        return this._number_of_pages;
    }

    public set translated_number_of_pages(no_of_translated_pages: number) {
        this.validateNumberOfPages(no_of_translated_pages);
        this._translated_number_of_pages = no_of_translated_pages;
    }

    public get translated_number_of_pages(): number {
        return this._translated_number_of_pages;
    }

    // NOTE: Helper function to avoid logic duplication
    private pageSuffix(n: number): PageSuffix {
        if (n === 1)
            return page_suffix.SINGULAR;
        else
            return page_suffix.PLURAL;
    }

    // NOTE: There are NO setters for this, it's a derived property
    public get page_suffix(): PageSuffix {
        return this.pageSuffix(this._number_of_pages);
    }

    // NOTE: There are NO setters for this, it's a derived property
    public get translated_page_suffix(): PageSuffix {
        return this.pageSuffix(this._translated_number_of_pages);
    }

    public set text_seen_in(other_text_part: TextPart) {
        if (other_text_part === text_part.EXCERPT && this._translation_requested_in === text_part.FULL)
            throw new Error(`Cannot translate the text in ${text_part.FULL.EN} if it was only seen in ${text_part.EXCERPT.EN}!`);

        this._text_seen_in = other_text_part;
    }

    public get text_seen_in(): TextPart {
        return this._text_seen_in;
    }

    public set translation_requested_in(other_text_part: TextPart) {
        if (this._text_seen_in === text_part.EXCERPT && other_text_part === text_part.FULL)
            throw new Error(`Cannot translate the text in ${text_part.FULL.EN} if it was only seen in ${text_part.EXCERPT.EN}!`);

        this._translation_requested_in = other_text_part;
    }

    public get translation_requested_in(): TextPart {
        return this._translation_requested_in;
    }

    public set document_heading(heading: DocumentHeading) {
        this._document_heading = heading;
    }

    public get document_heading(): DocumentHeading {
        return this._document_heading;
    }

    public set document_name(name: MultiLingualText) {
        this._document_name = name;
    }

    public get document_name(): MultiLingualText {
        return this._document_name;
    }

    public set issuing_authority(authority: MultiLingualText) {
        this._issuing_authority = authority;
    }

    public get issuing_authority(): MultiLingualText {
        return this._issuing_authority;
    }

    private validateDocumentAndTranslationLanguages(document_lang: MultiLingualText, translation_lang: MultiLingualText) {
        if (document_lang === translation_lang)
            throw new Error("The document language and the translation language must be different");
        return;
    }

    public set document_language(lang: MultiLingualText) {
        this.validateDocumentAndTranslationLanguages(lang, this._translation_language);

        this._document_language = lang;
    }

    public get document_language(): MultiLingualText {
        return this._document_language;
    }

    public set translation_language(lang: MultiLingualText) {
        this.validateDocumentAndTranslationLanguages(this._document_language, lang);

        this._translation_language = lang;
    }

    public get translation_language(): MultiLingualText {
        return this._translation_language;
    }
}