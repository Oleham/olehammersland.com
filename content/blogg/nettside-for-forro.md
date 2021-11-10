+++
title = "Nettside for forro"
date = "2021-11-10T08:55:37+01:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["javascript","koding",]

# Add toc just above title
include_toc = false

# Add Alpine JS CDN
include_alpinejs = false

# Send data obj into Alpine.data()
include_data = false
+++

Har laget en ny nettside for forro som stort sett er lanseringsklar, i tide til dansekvelden vi skal arrangere på søndag.

[osloforro.site](https://osloforro.site)

![Skjermdump som viser Oslo forro-siden](/images/blogg/forro.jpg)

Nettsiden er laget ved hjelp av to rammeverk: Django og Svelte. Tanken er at Svelte skal håndtere frontenden (presentasjonen, selve siden), mens Django håndterer backenden (lagring av data og så videre). Jeg valgte dette oppsettet for å lett kunne invitere mine medsammensvorne i forrogruppen til å lage sine egne innlegg i Django sin backend.

Siden jeg jobber med dette på hobbybasis, har jeg tatt noen snarveier. Jeg har nå lagt opp til at de andre skal opprette innlegg og arrangementer direkte i Django sitt admin-panel. Det er litt uheldig, fordi det ikke er veldig brukervennlig, men jeg tenker at det bør fungere. Dessuten har det nå blitt slik at Nyheter/Blogg- og Om-delen på siden leveres rett fra Django, siden det gikk raskere for meg å sette opp slik.

Svelte er nå brukt som en SPA på hovedsiden. Rammeverket gjorde det enkelt for meg å lage en mer interaktiv opplevelse der, hvor man kan bla gjennom informasjonsboksen, se over kommende og tidligere arrangementer og bla gjennom de siste blogginnleggene. Alt med enkle animasjoner. Det var både gøy og lærerikt å bruke Svelte her, og i neste gjennomgang vil jeg utvide ansvarsområdet til dette rammeverket. Synes det er veldig gøy å jobbe med Django også, men Svelte gjør det mye lettere å skape en mer «levende» side.

![Skjermdump som administrasjonspanelet til siden](/images/blogg/forro2.jpg)

Slik ser adminpanelet til siden ut. Brukere kan opprette og endre nyhetsinnlegg, fanene i infoboksen og arrangementer samt laste opp bilder direkte til siden. Det vil si at alt innhold på siden kan styres herfra – man må ikke kunne noe om programmering for å endre på siden. Innholdet hentes fra Svelte gjennom REST API, mens sidene som leveres direkte fra Django kombinerer maler og innhold allerede før siden leveres.

Har i dette prosjektet dessuten forsøkt meg på litt enkel server side rendering i byggetrinnet med Svelte. Det fungerer, men siden tegnes uten innholdet fra API-et, så det gjør ikke så veldig stor forskjell. Det er i hvert fall noe. 

Ellers har jeg satt opp hele siden på en Digitalocean droplet. Serveren består av Nginx og Gunicorn, og Let's Encrypt leverer SSL-sertifikatet.

[Koden ligger på Github.](https://github.com/Oleham/forrosite)