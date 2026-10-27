---
type: Guide
title: Klasser och addons
description: Så skapar, ändrar och tar du bort kabinklasser och addons på adminsidan.
resource: app/admin/ClassTable.tsx
feature: TRIP-003
tags: [admin, klasser, addons, pris]
generated:
  by: claude
  at: 2026-10-27T13:16:25+01:00
---

# Klasser och addons

Klasser (till exempel Ekonomi, Business och Första klass) och addons (tillval som resenären kan köpa, till exempel extra bagage eller en måltid) skapas i kortet **Klasser & addons** på adminsidan. Sedan väljer du på varje plan vilka klasser det har och vilka addons som går att köpa i varje klass (se [Plan](admin-plan.md)).

Klicka på kortets rubrik för att fälla ihop eller fälla ut det.

## Klasser

- **Lägg till:** klicka på **Lägg till** under Klasser, skriv namnet och prisfaktorn och klicka på **Spara**. **Avbryt** stänger utan att spara.
- **Ändra namn eller prisfaktor:** klicka på pennan, ändra och klicka på **Spara**.
- **Ta bort:** klicka på papperskorgen och svara **Ja** på frågan "Är du säker?".

Två klasser kan inte heta likadant, inte heller med olika stora och små bokstäver.

**Prisfaktorn** (kolumnen **Prisfaktor**) avgör hur mycket dyrare klassen är: resenärens pris per person är avgångens pris gånger planets prisfaktor gånger klassens. Business med 1,50 kostar 50 % mer än en klass med 1,00. En ny klass börjar på 1,00. Skriv faktorn med decimalkomma och högst två decimaler, från 1,00 till 10,00.

## Addons

- **Lägg till:** klicka på **Lägg till** under Addons och fyll i namn, pris i kronor och en beskrivning. Klicka på **Spara**.
- **Ändra:** klicka på pennan. Fälten fylls i med nuvarande värden.
- **Ta bort:** som för klasser.

Priset visas i kolumnen **Pris (SEK)**. Det är i hela kronor, 0 kr eller mer. Du kan skriva mellanslag mellan tusentalen, till exempel 1 290.

## Det går inte att ta bort

Papperskorgen frågar alltid "Är du säker?". Används klassen eller addonen av ett plan, svarar sidan i stället **Du kan ej ta bort** och säger varför, till exempel "… den används av ett plan eller en flight." Ta först bort klassen eller addonen från planen, eller ta bort planet, så går den att ta bort direkt, utan att du behöver ladda om sidan.

## Felmeddelanden

| Meddelande | Gör så här |
|---|---|
| Klassen måste ha ett namn. | Skriv ett namn. |
| Klassen "…" finns redan. | Välj ett annat namn. |
| Prisfaktorn måste vara ett tal från 1 till 10 med högst två decimaler, t.ex. 1,50. | Skriv en faktor från 1,00 till 10,00, med decimalkomma. |
| Ange ett pris. | Skriv ett pris i kronor. |
| Addon måste ha ett namn. / Addon måste ha en beskrivning. | Fyll i fältet. |
| Addon "…" finns redan. | Välj ett annat namn. |
| Priset måste vara 0 kr eller mer. | Skriv ett pris som inte är negativt. |
| Ange priset i hela kronor. | Skriv bara siffror, till exempel 13 i stället för 12,50. |

Hur det fungerar tekniskt, på engelska: [Administration](../system/admin.md).
