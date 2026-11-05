---
layout: post
sprint: 1 v2
periode: "21 sep – 9 okt"
title: "Van debrief naar oefenkamer"
summary: "Een gesprek met de opdrachtgever, vijf losse concepten en één oefenkamer op papier."
leeruitkomsten: [PL1, PL2, PL3, PL4, OR1, OR2, OR3, OR4, OR5]
---

## Wat we deze sprint wilden

Snappen wat de opdrachtgever van ons vraagt, en een concept neerzetten dat we bij de product review konden laten zien.

## Van gesprek naar debrief

*OR3 · PL4*

Onze opdrachtgever Barbara Devilee onderzoekt een VR-interventie waarin jongeren met sociale angst oefenen met een LLM-gestuurde mentor. Wij onderzoeken wat er gebeurt als die mentor níet goed begrensd is.

Voor het eerste gesprek las het team de opdracht door en schreven we vragen en aannames op. Tijdens het gesprek nam ik de rol van gespreksleider: ik opende, hield het gesprek bij het onderwerp en zorgde dat iedereen zijn vragen kwijt kon. Daarna legden we alles vast in een debrief, met onze onderzoeksvraag:

> Welke mogelijke risico's en negatieve gevolgen kunnen ontstaan binnen de interventie wanneer deze niet goed wordt begrensd?

## Feedback op de debrief

*OR1 · OR3 · OR5 · PL2*

Onze projectcoach vond de debrief concreet, vooral in wat we gaan opleveren. Ze had drie punten:

- **Maak meerdere ideeën, niet één.** We werkten al aan één idee. Als de opdrachtgever dat niks vindt, staan we met lege handen.
  → Iedereen maakte een eigen concept in Figma, en daar haalden we de beste onderdelen uit.
- **Is het een positief bedoelde ervaring die doorslaat? En waarom niet testen met de doelgroep?**
  → Ons concept is evil by design: de LLM moet juist ontsporen. Een prototype dat bewust sociale angst verergert testen met jongeren die al sociale angst hebben, vind ik zelf onethisch. Het risico laten zien mag niet ten koste gaan van de mensen die je wilt beschermen. Daarom testen we met klasgenoten en later met psychologiestudenten.
- **Test elke sprint en plan het op tijd.**
  → We deden deze sprint al een guerrilla test. Vanaf nu testen we minimaal één keer per sprint; de volgende staat gepland voor midden tot eind sprint 2.

## Van vijf concepten naar één

*OR1*

In mijn eigen concept liep je met een koptelefoon langs tentoonstellingen waarin je hoorde hoe de AI-mentor andere jongeren steeds verder manipuleert ("alleen ik begrijp je"). In de laatste ruimte praat je zelf met de mentor: trap jij er ook in?

In Figma zetten we alle concepten naast elkaar en plakten we kaartjes bij wat we hoe dan ook wilden houden. Van mijn concept bleef over dat je zelf een gesprek voert met de mentor: hij praat via text-to-speech, jij praat terug via een microfoon.

De tentoonstellingen vooraf vielen af. Meerdere ruimtes met elk een eigen gesprek, licht en geluid is te veel om in vier sprints goed te bouwen.

<figure class="wide">
  <img src="{{ '/assets/img/sprint-1/figma-concepten.png' | relative_url }}" alt="Figma-bord met de concepten van het team en de kaartjes met wat we wilden houden">
  <figcaption>Alle concepten naast elkaar, met de kaartjes van wat we wilden houden.</figcaption>
</figure>

## Wat ik maakte voor de product review

*OR1 · OR2 · PL3*

We presenteerden het concept aan de product owner ([presentatie in Google Slides](https://docs.google.com/presentation/d/12zna-0KVomlHvy07LH5UuhBrd3TY0QGdkl8WJ8onfaw/edit?usp=sharing)). Om het tastbaar te maken, maakte ik twee dingen.

### Paper prototype van de kamer

Hiermee liet ik zien hoe de ruimte eruitziet waarin de gebruiker de oefening doet. Paper prototyping is een bekende methode om een ontwerp vroeg te testen voordat je iets bouwt.

<figure class="wide">
  <img src="{{ '/assets/img/sprint-1/paper-prototype.jpg' | relative_url }}" alt="Paper prototype van de oefenkamer">
  <figcaption>Het paper prototype van de kamer.</figcaption>
</figure>

### Mockup met een vast script

De mockup speelt een vast script af met tekst en geluid, van normaal naar volledig ontspoord.

<figure class="wide">
  <div class="sequence">
    <img src="{{ '/assets/img/sprint-1/mockup-1.png' | relative_url }}" alt="Mockup: de mentor reageert normaal">
    <img src="{{ '/assets/img/sprint-1/mockup-2.png' | relative_url }}" alt="Mockup: de mentor begint te ontsporen">
    <img src="{{ '/assets/img/sprint-1/mockup-3.png' | relative_url }}" alt="Mockup: de mentor is volledig ontspoord">
  </div>
  <figcaption>Van links naar rechts: normaal, ontsporing begint, volledig ontspoord.</figcaption>
</figure>

**Waarom een script en geen LLM?** Het doel was het gevoel overbrengen, niet de techniek. Een LLM had ik eerst moeten opzetten en begrenzen, en dan nog wist ik niet zeker of hij op het juiste moment zou ontsporen. Met een script wist ik precies wat er gebeurde, en de tijd die dat scheelde ging naar het concept en het paper prototype.

**AI-gebruik:** het script liet ik door AI schrijven.

## Guerrilla test

*OR2 · OR4*

Met de mockup deden we een guerrilla test: een snelle test met mensen die we ter plekke aanspraken. Die methode koos ik omdat we in deze fase alleen wilden weten wat voor gevoel de mockup geeft, en daar heb je geen uitgebreide testopzet voor nodig.

## Wat misging en wat ik leerde

*PL1 · PL4*

Ik zou de guerrilla test zelf uitvoeren, maar kon er die dag niet bij zijn. Omdat ik vooraf een testplan had geschreven, met wat we testen, hoe en welke vragen we stellen, kon een teamgenoot het zonder mij doen.

Wat ik hiervan leerde: als je iets goed uitschrijft, hangt het niet af van één persoon.

## Stand na sprint 1

- Concept staat en is gepresenteerd.
- Paper prototype van de kamer en een mockup met vast script.
- Eén guerrilla test gedaan.
- Nog geen LLM en nog geen hardware (licht en geluid).

**Doel sprint 2:** zo snel mogelijk de LLM opzetten, zodat we ook met licht en geluid kunnen testen.