# About this Project

![CI](https://github.com/mihai-mc/translation-certification/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/github/license/mihai-mc/translation-certification)

![Python Version](https://img.shields.io/badge/python-3.12-blue)
![TypeScript](https://img.shields.io/badge/typescript-6.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-8.x-646CFF?logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/node-26.x%20(current)-339933?logo=node.js&logoColor=white)

This is a standalone project to auto-generate the Translator's Certification („Încheiere de traducere”) for certified translators („traducători autorizați”) in Romania.

It takes care of putting the fields in the correct place without the translator having to remember what-goes-where. This is especially important when doing translations from Romanian into a foreign language, where a translator has to ensure that the text matches in Romanian and the foreign language (same number of pages, same titles, etc.).

## Supported Languages

While the text is currently displayed in English only, the project currently supports 3 languages for auto-generating the Translator's Certification:
* Romanian
* English
* French

## Legalisation Certification

In Romania, this is known as: „Încheierea de legalizare a semnăturii traducătorului”.

This feature auto-generates the Notary Public's legalisation certification that is applied to legalise the translator's signature. This used to be a quasi-requirement in the past in Romania, though recent legislative changes have abolished this arcane requirement. Still, there are still some instances where this requirement still lingers (particularly when dealing with the Romanian state), so the option of adding the Legalisation Certification can be toggled through the appropriate checkbox.

# Contributing to this project

If you spot any bugs or mis-translations or if you want to contribute to this project, please raise an Issue or a Pull Request.