---
type: Guide
title: Plan
description: Så lägger du till, ändrar och tar bort plan med klasser, antal platser och addons per klass.
resource: app/admin/AircraftForm.tsx
feature: TRIP-004
tags: [admin, plan, klasser, platser, addons]
timestamp: 2026-10-20
---

# Plan

I kortet **Plan** på adminsidan bygger du flygbolagets flotta. Varje plan har ett namn, en eller flera klasser med ett antal platser, och de addons som går att köpa i varje klass.

## Tabellen

Tabellen visar varje plans namn, antal **Klasser** och totalt antal **Platser**. Planen hör inte till några rutter: resenären väljer plan själv (kommer snart).

- Klicka på pilen framför ett plan för att se dess klasser och antal platser.
- Klicka på pilen framför en klass för att se klassens addons och deras pris.

## Lägg till ett plan

1. Klicka på **Lägg till plan**.
2. Skriv planets namn, till exempel "Airbus A320neo".
3. **Klasser:** klicka på **+ Lägg till klass**, välj klass, skriv antal platser och klicka på **+**. Upprepa för fler klasser.
4. **Addons:** klicka på **+ Lägg till addon**, välj addon och klass och klicka på **+**. Samma addon kan läggas till i flera klasser.
5. Klicka på **Spara**. Hela planet sparas på en gång. **Avbryt** stänger formuläret utan att spara något.

I formuläret kan du ändra antal platser i en klass med pennan (bekräfta med ✓), och ändra eller ta bort en addon. Tar du bort en klass försvinner också dess addons.

Bra att veta:

- Antal platser måste vara ett heltal större än 0.
- En klass kan bara finnas en gång på ett plan.
- **+ Lägg till addon** går att klicka på först när planet har en klass och det finns addons. Addons skapar du i [Klasser och addons](admin-klasser-och-addons.md).
- Klasserna och addons listas i samma ordning som i klasstabellen.

## Ändra ett plan

Klicka på pennan på planets rad. Formuläret öppnas med planets namn, klasser och addons. Ändra och klicka på **Spara**.

## Ta bort ett plan

Klicka på papperskorgen och svara **Ja**.

## Felmeddelanden

| Meddelande | Gör så här |
|---|---|
| Planet måste ha ett namn. | Skriv ett namn. |
| Planet måste ha minst en klass. | Lägg till en klass. |
| Det finns redan ett plan som heter "…". | Välj ett annat namn. |
| Den addonen finns redan i den klassen. | Addonen finns redan; välj en annan addon eller klass. |
