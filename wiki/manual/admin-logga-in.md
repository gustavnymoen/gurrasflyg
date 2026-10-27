---
type: Guide
title: Logga in som administratör
description: Så loggar du in på och ut från adminsidan, och hur länge inloggningen gäller.
resource: app/admin/login/
feature: TRIP-002
tags: [admin, inloggning, lösenord]
generated:
  by: claude
  at: 2026-10-27T13:16:25+01:00
---

# Logga in som administratör

Adminsidan är till för den som sköter Gurras Flyg: plan, klasser, addons, rutter och omdömen.

## Logga in

1. Klicka på **Admin** längst ner på sidan, eller gå till `/admin`.
2. Skriv lösenordet och klicka på **Logga in**.

Står det **Fel lösenord.** stämmer inte lösenordet. Kontrollera stora och små bokstäver och försök igen.

Skriver du fel lösenord fem gånger på 15 minuter från samma dator eller nätverk spärras inloggningen därifrån en stund. Då står det **För många försök. Försök igen om N minuter.** Vänta så länge det står, så går det att logga in igen. Det hjälper inte att skriva rätt lösenord under tiden.

## Hur länge är jag inloggad?

Tills du stänger webbläsaren, men högst 8 timmar. Därefter får du logga in igen.

## Logga ut

Klicka på **Logga ut** uppe till höger på adminsidan. Gör det alltid om du använder en dator som andra också använder.

## Vanliga frågor

**Jag fick meddelandet "Du är inte inloggad längre. Ladda om sidan och logga in."** Inloggningen har gått ut medan sidan var öppen. Ladda om sidan, logga in och gör ändringen igen.

**Var ändrar jag lösenordet?** Lösenordet är inställningen `ADMIN_PASSWORD`, lokalt i `.env.local` och på Vercel under Settings → Environment Variables. Det kan inte ändras på sajten.

Hur det fungerar tekniskt, på engelska: [Admin sign-in](../system/admin-sign-in.md).
