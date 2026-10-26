---
type: Guide
title: Plan
description: Så lägger du till, ändrar och tar bort plan med klasser, antal platser och addons per klass.
resource: app/admin/AircraftForm.tsx
feature: TRIP-004
tags: [admin, plan, klasser, platser, addons]
timestamp: 2026-10-24
---

# Plan

I kortet **Plan** på adminsidan bygger du flygbolagets flotta. Varje plan har ett namn, en prisfaktor och en tidsfaktor, en eller flera klasser med ett antal platser, och de addons som går att köpa i varje klass.

## Tabellen

Tabellen visar varje plans namn, **Prisfaktor**, **Tidsfaktor**, antal **Klasser** och totalt antal **Platser**. Planen hör inte till några rutter: resenären väljer plan själv för varje flyg (se [Välja plan och klass](valja-plan-och-klass.md)).

- Klicka på pilen framför ett plan för att se dess klasser och antal platser.
- Klicka på pilen framför en klass för att se klassens addons och deras pris.

## Lägg till ett plan

1. Klicka på **Lägg till plan**.
2. Skriv planets namn, till exempel "Airbus A320neo", och vid behov dess **Prisfaktor** och **Tidsfaktor** (båda börjar på 1,00, se nedan).
3. **Klasser:** klicka på **+ Lägg till klass**, välj klass, skriv antal platser och klicka på **+**. Upprepa för fler klasser.
4. **Addons:** klicka på **+ Lägg till addon**, välj addon och klass och klicka på **+**. Samma addon kan läggas till i flera klasser.
5. Klicka på **Spara**. Hela planet sparas på en gång. **Avbryt** stänger formuläret utan att spara något.

I formuläret kan du ändra antal platser i en klass med pennan (bekräfta med ✓), och ändra eller ta bort en addon. Tar du bort en klass försvinner också dess addons.

Bra att veta:

- Antal platser måste vara ett heltal större än 0.
- En klass kan bara finnas en gång på ett plan.
- **+ Lägg till addon** går att klicka på först när planet har en klass och det finns addons. Addons skapar du i [Klasser och addons](admin-klasser-och-addons.md).
- Klasserna och addons listas i samma ordning som i klasstabellen.

## Pris- och tidsfaktor

Faktorerna avgör vad det kostar och hur lång tid det tar att flyga med planet:

- **Prisfaktor:** resenärens pris per person är avgångens pris gånger planets prisfaktor gånger klassens prisfaktor. 1,20 gör planet 20 % dyrare. Från 1,00 till 10,00.
- **Tidsfaktor:** flygtiden är ruttens flygtid gånger planets tidsfaktor. 4,00 tar fyra gånger så lång tid (ett luftskepp), 0,30 under en tredjedel (ett rymdskepp). Mer än 0 och högst 10,00.

Skriv dem med decimalkomma och högst två decimaler, till exempel 1,50. Ett fel värde blir rött och sparas inte.

## Ändra ett plan

Klicka på pennan på planets rad. Formuläret öppnas med planets namn, klasser och addons. Ändra och klicka på **Spara**.

## Ta bort ett plan

Klicka på papperskorgen och svara **Ja**.

Ett plan som finns i en bokning går inte att ta bort: efter **Ja** visas **Du kan ej ta bort** och "… det används av bokningar.". Av samma skäl går det inte att ta bort en klass från planet om en bokning med planet använder den, eller ge klassen färre platser än någon bokning har i den.

## Felmeddelanden

| Meddelande | Gör så här |
|---|---|
| Planet måste ha ett namn. | Skriv ett namn. |
| Planet måste ha minst en klass. | Lägg till en klass. |
| Det finns redan ett plan som heter "…". | Välj ett annat namn. |
| Den addonen finns redan i den klassen. | Addonen finns redan; välj en annan addon eller klass. |
| Prisfaktorn måste vara ett tal från 1 till 10 med högst två decimaler, t.ex. 1,50. | Skriv en faktor från 1,00 till 10,00, med decimalkomma. |
| Tidsfaktorn måste vara ett tal större än 0 och högst 10 med högst två decimaler, t.ex. 0,50. | Skriv en faktor större än 0 och högst 10,00, med decimalkomma. |
