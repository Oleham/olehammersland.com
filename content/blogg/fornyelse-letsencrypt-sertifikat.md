+++
title = "Fornyelse av Let's Encrypt-sertifikat"
date = "2021-10-04T17:02:15+02:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["automatisering","bash","enkeltpersonforetak","koding","linux",]

include_toc = false
+++

Jeg hoster min egen epost-tjener under domenet mitt, olehammersland.com. Det fungerer overraskende godt, og har ikke blitt et mål for storslåtte spam-angrep ennå (fingrene krysset). Dermed er det en billig måte å ha en e-post med eget domenenavn – og litt gøy å ha «fikset det selv». Det eneste som er litt skummelt, er når det er på tide å oppdatere SSL-sertifikatet. Siden jeg så sjelden åpner panseret og gjør arbeid på tjeneren, er det alltid litt uvant å orientere seg.

I dag tidlig var det f.eks. på tide å fornye sertifikatet, som var løpt ut i løpet av helgens Paris-Roubaix-ritt. Jeg gjorde prosessen slik jeg husket det, men glemte å restarte alle programmene som er involvert i e-posttjenesten min. Dermed fungerte fornyelsen av sertifikatet mitt øyensynlig ikke, og det ble en lett stresset og irritabel start på dagen.

Derfor skriver jeg nå en liten huskeliste til meg selv:

1. Skru av både Apache, Postfix **OG** Dovecot med `sudo service [---] stop`
2. Kjør Certbot, som av en eller annen grunn ikke ligger under PATH: `sudo ~/snap/bin/certbot renew`
2. Sjekk at alt er fornyet med `sudo ~/snap/bin/certbot certificates`
3. Start de tre daemonene igjen.
5. Sjekk ev. `/var/log/mail.log` for å se at e-posten er oppe.

Viktig å huske å skru av både Postfix og Dovecot 😅!

Og ja, dette kan selvfølgelig automatiseres, det vet jeg. Vet bare ikke om jeg orker å stikke fingeren i det vepsebolet i nærmeste fremtid...
